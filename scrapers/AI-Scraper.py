# filepath: simple_sodexo_menu.py
from __future__ import annotations

import json
import os
import time
from collections import OrderedDict
from typing import Any, Dict, List, Optional, Union

# Scraping deps (logic unchanged)
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager


# ------------------------------
# Scraping internals (UNCHANGED)
# ------------------------------

def setup_driver(headless: bool = True) -> webdriver.Chrome:
    options = webdriver.ChromeOptions()
    if headless:
        options.add_argument("--headless=new")
    for arg in [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-blink-features=AutomationControlled",
        "--window-size=1920,1080",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    ]:
        options.add_argument(arg)
    return webdriver.Chrome(
        service=ChromeService(ChromeDriverManager().install()),
        options=options
    )


def wait_for_menu_load(driver: webdriver.Chrome, timeout: int = 10) -> bool:
    try:
        WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((By.CLASS_NAME, "menu-item-container"))
        )
        return True
    except Exception:
        return False


def extract_preloaded_json(html: str) -> Union[dict, None]:
    key = 'window.__PRELOADED_STATE__'
    idx = html.find(key)
    if idx == -1:
        return None
    start = html.find('{', idx)
    if start == -1:
        return None

    depth = 0
    in_str = False
    esc = False
    for i in range(start, len(html)):
        ch = html[i]
        if in_str:
            if esc:
                esc = False
            elif ch == '\\':
                esc = True
            elif ch == '"':
                in_str = False
        else:
            if ch == '"':
                in_str = True
            elif ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    try:
                        return json.loads(html[start:i + 1])
                    except json.JSONDecodeError:
                        return None
    return None


def _coerce_calories(value: Any) -> Optional[float]:
    # Why: Upstream may store number-like strings; normalize for reliable filtering.
    if value is None:
        return None
    if isinstance(value, (int, float)):
        try:
            return float(value)
        except (ValueError, TypeError):
            return None
    if isinstance(value, str):
        s = value.strip().lower().replace("cal", "").replace(",", "").strip()
        try:
            return float(s) if s else None
        except ValueError:
            return None
    return None


def should_exclude_item(name: str, item_data: dict = None) -> bool:
    name_lower = name.lower().strip()
    if any(p in name_lower for p in ["have a nice day", "enjoy your meal", "bon appetit"]):
        return True
    if item_data:
        calories = item_data.get('calories') or item_data.get('cal') or item_data.get('calorieCount')
        if calories is not None:
            try:
                if calories == '' or float(calories) == 0:
                    return True
            except (ValueError, TypeError):
                pass
    return False


def _parse_json_grouped_with_calories(data: dict) -> OrderedDict:
    """
    Traversal & filtering match the original; we only keep richer dicts per item.
    Output shape: OrderedDict[meal -> List[{"name": str, "calories": Optional[float]}]]
    """
    grouped = OrderedDict()
    try:
        composition = data.get('composition', {})
        subject = composition.get('subject', {})
        regions = subject.get('regions', [])
        for region in regions:
            fragments = region.get('fragments', [])
            for fragment in fragments:
                content = fragment.get('content', {})
                main = content.get('main', {})
                sections = main.get('sections', [])
                for section in sections:
                    meal_name = section.get('name')
                    if not meal_name:
                        continue
                    groups = section.get('groups', [])
                    for group in groups:
                        items = group.get('items', [])
                        for item in items:
                            formal_name = item.get('formalName', '').strip()
                            if not formal_name or should_exclude_item(formal_name, item):
                                continue
                            cal_raw = item.get('calories') or item.get('cal') or item.get('calorieCount')
                            calories = _coerce_calories(cal_raw)
                            grouped.setdefault(meal_name, [])
                            # de-dupe by name
                            if not any(d["name"] == formal_name for d in grouped[meal_name]):
                                grouped[meal_name].append({"name": formal_name, "calories": calories})
    except Exception:
        # Keep silent; empty dict signals no items (same behavior as original).
        pass
    return grouped


def _scrape_grouped(url: str, headless: bool, wait: int, verbose: bool) -> OrderedDict:
    driver = setup_driver(headless=headless)
    try:
        if verbose:
            print(f"Opening {url}...")
        driver.get(url)

        if not wait_for_menu_load(driver, timeout=wait) and verbose:
            print("Warning: Menu content may not have loaded completely")

        html = driver.page_source
        data = extract_preloaded_json(html)
        if data:
            grouped = _parse_json_grouped_with_calories(data)
            if grouped:
                if verbose:
                    total = sum(len(v) for v in grouped.values())
                    print(f"Found {total} items across {len(grouped)} meals")
                return grouped

        if verbose:
            print("No items found. The page structure may have changed.")
        return OrderedDict()
    finally:
        driver.quit()


# ------------------------------
# Minimal cache-first API
# ------------------------------

class SimpleSodexoMenu:
    """
    Usage:
        m = SimpleSodexoMenu(cache_path="sodexo_menu_cache.json")
        m.warm(URL)                         # Scrape once & cache+write JSON
        menu = m.get_menu(URL)              # { meal: [ {name, calories}, ... ], ... }
        lunch = m.get_lunch(URL)            # [ {name, calories}, ... ]
        m.write_json(URL, "menu.json")      # Optional: export to custom file

    Behavior:
        - Reads cache JSON at init if present.
        - `warm()` scrapes only when URL not cached or `force=True`.
        - All getters read from the in-memory cache (fast).
    """

    def __init__(self, cache_path: str = "sodexo_menu_cache.json", headless: bool = True, wait: int = 6, verbose: bool = False) -> None:
        self.cache_path = cache_path
        self.headless = headless
        self.wait = wait
        self.verbose = verbose
        # { url: { "meals": OrderedDict[str, List[{"name","calories"}]], "fetched_at": epoch_seconds } }
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._load_cache_file()  # no-op if not found

    # ---------- persistence ----------

    def _load_cache_file(self) -> None:
        if not os.path.exists(self.cache_path):
            return
        try:
            with open(self.cache_path, "r", encoding="utf-8") as f:
                raw = json.load(f)
        except Exception:
            return
        for url, payload in raw.get("entries", {}).items():
            meals_items = payload.get("meals", [])
            od = OrderedDict()
            for meal, items in meals_items:
                od[meal] = list(items)
            self._cache[url] = {"meals": od, "fetched_at": payload.get("fetched_at")}

    def _save_cache_file(self) -> None:
        serializable = {
            "entries": {
                url: {
                    "meals": list(data["meals"].items()),
                    "fetched_at": data["fetched_at"],
                }
                for url, data in self._cache.items()
            }
        }
        with open(self.cache_path, "w", encoding="utf-8") as f:
            json.dump(serializable, f)

    def write_json(self, url: str, path: str) -> None:
        data = self._cache.get(url)
        if not data:
            raise RuntimeError("Nothing cached for this URL. Call warm(url) first.")
        out = {
            "source_url": url,
            "fetched_at": data["fetched_at"],
            "meals": data["meals"],  # OrderedDict is JSON-serializable as object
        }
        with open(path, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=2)

    # ---------- scrape+cache ----------

    def warm(self, url: str, force: bool = False) -> OrderedDict:
        """
        Scrape once and persist to cache/JSON. Use force=True to refresh manually.
        """
        if (not force) and (url in self._cache):
            if self.verbose:
                print("Using cached menu.")
            return self._cache[url]["meals"]

        grouped = _scrape_grouped(url, headless=self.headless, wait=self.wait, verbose=self.verbose)
        if not grouped:
            raise RuntimeError("No menu items found; page may have changed or failed to load.")
        self._cache[url] = {
            "meals": grouped,
            "fetched_at": time.time(),
        }
        self._save_cache_file()
        return grouped

    # ---------- reads (from cache) ----------

    def get_menu(self, url: str) -> OrderedDict:
        """
        Return full grouped menu: { meal: [ {name, calories}, ... ] }.
        """
        if url not in self._cache:
            raise RuntimeError("Not cached. Call warm(url) once before reading.")
        return self._cache[url]["meals"]

    def _find_meal(self, url: str, meal_keyword: str) -> List[Dict[str, Any]]:
        if url not in self._cache:
            raise RuntimeError("Not cached. Call warm(url) once before reading.")
        meal_keyword = meal_keyword.lower()
        for meal, items in self._cache[url]["meals"].items():
            if meal_keyword in meal.lower():
                return items
        return []

    def get_meal(self, url: str, meal_keyword: str) -> List[Dict[str, Any]]:
        """Arbitrary meal filter, e.g., 'brunch', 'continental', etc."""
        return self._find_meal(url, meal_keyword)

    def get_breakfast(self, url: str) -> List[Dict[str, Any]]:
        return self._find_meal(url, "breakfast")

    def get_lunch(self, url: str) -> List[Dict[str, Any]]:
        return self._find_meal(url, "lunch")

    def get_snack(self, url: str) -> List[Dict[str, Any]]:
        return self._find_meal(url, "snack")

    def get_dinner(self, url: str) -> List[Dict[str, Any]]:
        return self._find_meal(url, "dinner")

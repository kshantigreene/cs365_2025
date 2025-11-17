import json
import datetime
import requests
import os
import re

# --- CONFIG ---
API_KEY = "68717828-b754-420d-9488-4c37cb7d7ef7"
BASE_URL = "https://api-prd.sodexomyway.net/v0.2/data/menu/94311001/14863"

# --- DETERMINE TODAY ---
today = datetime.date.today()
today_filename = f"menu_{today}.json"

# Regex pattern for menu files
pattern = re.compile(r"menu_(\d{4}-\d{2}-\d{2})\.json")

# --- FETCH TODAY'S FILE IF MISSING ---
if not os.path.exists(today_filename):
    print(f"No local file for today ({today}). Downloading...")

    url = f"{BASE_URL}?date={today}"
    headers = {
        "api-key": API_KEY,
        "Accept": "application/json",
        "Origin": "https://thomas.sodexomyway.com",
        "Referer": "https://thomas.sodexomyway.com/",
        "User-Agent": "Mozilla/5.0"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        menu_data = response.json()
        with open(today_filename, "w", encoding="utf-8") as f:
            json.dump(menu_data, f, indent=2, ensure_ascii=False)
        print(f"Saved today's menu to {today_filename}")

    except requests.RequestException as e:
        print("Download error:", e)
        input("Press Enter to exit...")
        exit()

else:
    print(f"Using existing file: {today_filename}")

# --- MERGE ALL MENU FILES INTO MASTER.JSON ---
print("\nBuilding master.json from all available menu files...")

all_files = sorted(
    [f for f in os.listdir(".") if pattern.match(f)]
)

master_items = set()
master_output = []

for file in all_files:
    with open(file, "r", encoding="utf-8") as f:
        daily_menu = json.load(f)

    for meal in daily_menu:
        # Find-or-create meal entry
        existing_meal = next((m for m in master_output if m["name"] == meal["name"]), None)
        if not existing_meal:
            existing_meal = {"name": meal["name"], "groups": []}
            master_output.append(existing_meal)

        for group in meal.get("groups", []):
            # Skip junk groups like "Have a nice day"
            if "have" in group["name"].lower():
                continue

            existing_group = next((g for g in existing_meal["groups"] if g["name"] == group["name"]), None)
            if not existing_group:
                existing_group = {"name": group["name"], "items": []}
                existing_meal["groups"].append(existing_group)

            # Add unique items
            for item in group.get("items", []):
                item_name = item["formalName"].strip()

                if item_name not in master_items:
                    master_items.add(item_name)
                    existing_group["items"].append(item)

print("Merge complete.")

# --- SAVE MASTER FILE ---
with open("master.json", "w", encoding="utf-8") as f:
    json.dump(master_output, f, indent=2, ensure_ascii=False)

print("master.json has been updated.\n")

# --- DELETE ALL DAILY JSON FILES AFTER MERGING ---
print("Cleaning up daily JSON files...")
for file in all_files:
    try:
        os.remove(file)
        print(f"  Deleted {file}")
    except:
        print(f"  Could not delete {file}")

print("All daily menu files removed.\n")

# ==========================================================
# PRINT MASTER FILE TO CONSOLE
# ==========================================================

print("Merged Master Menu:\n")

for meal in master_output:
    print(f"=== {meal['name']} ===")
    for group in meal.get("groups", []):
        print(f"  {group['name']}:")
        for item in group.get("items", []):
            print(f"    - {item['formalName']}")

input("\nPress Enter to exit...")

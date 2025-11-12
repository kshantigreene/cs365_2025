import json
import datetime
import requests
import os
  # 🆕 for finding dates in filenames

# --- CONFIG ---
API_KEY = "68717828-b754-420d-9488-4c37cb7d7ef7"
BASE_URL = "https://api-prd.sodexomyway.net/v0.2/data/menu/94311001/14863"

# --- DETERMINE TODAY ---
today = datetime.date.today()
filename = f"menu_{today}.json"



# --- CHECK IF TODAY'S FILE EXISTS ---
if not os.path.exists(filename):
    # --- FETCH FROM API ---
    url = f"{BASE_URL}?date={today}"
    headers = {
        "api-key": API_KEY,
        "Accept": "application/json",
        "Origin": "https://thomas.sodexomyway.com",
        "Referer": "https://thomas.sodexomyway.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        menu_data = response.json()

        # --- SAVE NEW FILE ---
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(menu_data, f, indent=2, ensure_ascii=False)
            print(f"✅ Saved today's menu to {filename}")

    except requests.RequestException as e:
        print("❌ Error downloading menu data:", e)
        input("\nPress Enter to exit...")
        exit()
else:
    # Load existing file
    with open(filename, "r", encoding="utf-8") as f:
        menu_data = json.load(f)
    print(f"📁 Loaded existing menu from {filename}")

# --- DISPLAY MENU ---
print(f"\n📅 Showing menu for {today}:\n")
for meal in menu_data:
    print(f"=== {meal['name']} ===")
    for group in meal.get("groups", []):
        print(f"  {group['name']}:")
        for item in group.get("items", []):
            print(f"    - {item['formalName']}")

input("\nPress Enter to exit...")

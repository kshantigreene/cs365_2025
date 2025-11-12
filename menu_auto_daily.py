import json
import datetime # note to self: for today's date and file age calculation
import requests # for API calls 
import os 
import re  #  for finding dates in filenames

# configuration
API_KEY = "68717828-b754-420d-9488-4c37cb7d7ef7"
BASE_URL = "https://api-prd.sodexomyway.net/v0.2/data/menu/94311001/14863"

# determmine today's date and filename
today = datetime.date.today()
filename = f"menu_{today}.json"

# cleans up old files (older than 7 days) ---
print("Checking for old menu files to delete...")
pattern = re.compile(r"menu_(\d{4}-\d{2}-\d{2})\.json") # regex to match filenames like menu_YYYY-MM-DD.json

for file in os.listdir("."):
    match = pattern.match(file)
    if match:
        try:
            file_date = datetime.datetime.strptime(match.group(1), "%Y-%m-%d").date()
            age = (today - file_date).days
            if age > 7:
                os.remove(file)
                print(f"   Deleted old file: {file}")
        except ValueError:
            pass  # skip files that don't fit the date format
print(" Cleanup complete.\n")

#  Checks if today's menu file exists locally
if os.path.exists(filename):
    print(f" Found today's menu file: {filename}")
    with open(filename, "r", encoding="utf-8") as f: # what does utf-8 do again? # it handles special characters properly
        menu_data = json.load(f)
else:
    print(f" No local file for today ({today}).")
    print("Downloading from Sodexo API...")

    # fetch today's menu from the API
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
        print(f" Saved today's menu to {filename}")

    except requests.RequestException as e:
        print(" Error downloading menu data:", e)
        input("\nPress Enter to exit...")
        exit()

# this displays the menu and prompts for ratings under each item
print(f"\n Showing menu for {today}:\n")
for meal in menu_data:
    print(f"=== {meal['name']} ===") # display meal name
    for group in meal.get("groups", []): # loop through each group in the meal
        print(f"  {group['name']}:") # display group name
        for item in group.get("items", []): # loop through each menu item
            print(f"    - {item['formalName']}") # display item name
            # Prompt for rating
            while True: # while what is true? # to keep asking until valid input or skip
                rating_input = input(f"      Rate '{item['formalName']}' (1-5 stars, or Enter to skip): ").strip()
                if not rating_input: # User pressed Enter to skip
                    break # skip rating this item
                try: # try to convert input to integer
                    rating = int(rating_input)
                    if 1 <= rating <= 5:
                        print(f"      Your rating: {'*' * rating}")
                        break
                    else:
                        print("  --  Invalid rating. Please enter a number between 1 and 5.")
                except ValueError:
                    print("   --   Invalid input. Please enter a number or press Enter to skip.")

input("\nPress Enter to exit...")

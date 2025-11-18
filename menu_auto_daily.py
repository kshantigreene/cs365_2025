import json
import datetime 
import requests 
import os 
import re  
import boto3  # <-- NEW: Import the AWS library

# configuration
API_KEY = "68717828-b754-420d-9488-4c37cb7d7ef7"
BASE_URL = "https://api-prd.sodexomyway.net/v0.2/data/menu/94311001/14863"

# --- NEW: Initialize DynamoDB ---
# Boto3 will automatically find the credentials you set with 'aws configure'
try:
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('menus') # Your database name
    print("Successfully connected to DynamoDB table 'menus'.\n")
except Exception as e:
    print(f"Error connecting to DynamoDB: {e}")
    print("Please ensure your AWS credentials and region are correct.")
    input("\nPress Enter to exit...")
    exit()
# --- END NEW ---

# determmine today's date and filename
today = datetime.date.today()
filename = f"menu_{today}.json"

# ... (your file cleanup code remains exactly the same) ...
print("Checking for old menu files to delete...")
pattern = re.compile(r"menu_(\d{4}-\d{2}-\d{2})\.json") 
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
            pass  
print(" Cleanup complete.\n")

# ... (your file downloading/loading code remains exactly the same) ...
if os.path.exists(filename):
    print(f" Found today's menu file: {filename}")
    with open(filename, "r", encoding="utf-8") as f: 
        menu_data = json.load(f)
else:
    print(f" No local file for today ({today}).")
    print("Downloading from Sodexo API...")
    url = f"{BASE_URL}?date={today}"
    headers = { "api-key": API_KEY, "Accept": "application/json", "Origin": "https://thomas.sodexomyway.com", "Referer": "https://thomas.sodexomyway.com/", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        menu_data = response.json()
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(menu_data, f, indent=2, ensure_ascii=False)
        print(f" Saved today's menu to {filename}")
    except requests.RequestException as e:
        print(" Error downloading menu data:", e)
        input("\nPress Enter to exit...")
        exit()


# --- MODIFIED: This section now saves ratings to DynamoDB ---
# --- MODIFIED: This section now saves ratings to DynamoDB ---
print(f"\n Showing menu for {today}:\n")
for meal in menu_data:
    print(f"=== {meal['name']} ===") 
    for group in meal.get("groups", []): 
        print(f"  {group['name']}:") 
        for item in group.get("items", []): 
            print(f"    - {item['formalName']}") 

            # --- THIS IS THE KEY CHANGE ---
            # We are now using 'menuItemId' from your JSON file
            item_api_id = item.get('menuItemId') 
            
            if not item_api_id:
                print("      (Warning: Could not find an ID for this item, cannot save rating.)")
                continue # Skip to the next item

            while True: 
                rating_input = input(f"      Rate '{item['formalName']}' (1-5 stars, or Enter to skip): ").strip()
                if not rating_input: 
                    break 
                try: 
                    rating = int(rating_input)
                    if 1 <= rating <= 5:
                        print(f"      Your rating: {'*' * rating}")
                        
                        # --- NEW: Save to DynamoDB ---
                        try:
                            # We can add more useful data to the item we're saving
                            table.put_item(
                                Item={
                                    'item_id': str(item_api_id),  # Your PK
                                    'rating': rating,
                                    'rating_date': str(today),
                                    'itemName': item.get('formalName'),
                                    'meal': meal.get('name'),
                                    'description': item.get('description', ''), # Use .get() for safety
                                    'calories': item.get('calories', 'N/A'),
                                    'isVegetarian': item.get('isVegetarian', False),
                                    'isVegan': item.get('isVegan', False),
                                    'allergens': item.get('allergens', [])
                                }
                            )
                            print("      Rating saved to DynamoDB!")
                        except Exception as e:
                            print(f"  --  Error saving rating to DynamoDB: {e}")
                        # --- END NEW ---
                        
                        break # Exit the 'while' loop
                    else:
                        print("  --  Invalid rating. Please enter a number between 1 and 5.")
                except ValueError:
                    print("   --   Invalid input. Please enter a number or press Enter to skip.")

input("\nPress Enter to exit...")
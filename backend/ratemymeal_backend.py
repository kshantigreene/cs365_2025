from APIs.thomas_menu import ThomasMenu

def main():
    menu = ThomasMenu()
    menu.save_json('thomas_menu.json')

    foodItems = menu.parse_food_items()

    for item in foodItems:
        print(f"{item}")
        print("-" * 40)

main()
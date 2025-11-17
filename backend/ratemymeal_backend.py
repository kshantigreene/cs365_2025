from APIs.thomas_menu import ThomasMenu

def main():
    menu = ThomasMenu()
    menu.save_json('thomas_menu.json')

    foodItems = menu.parse_food_items()

    menu.save_menu_with_ratings(foodItems, 'thomas_menu.json')

    print("Menu with ratings saved to 'thomas_menu.json'")
        

main()
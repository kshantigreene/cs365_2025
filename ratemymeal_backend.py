from APIs.thomas_menu_api import ThomasMenuAPI
from APIs.read_json_api import ThomasMenu

def main():
    menu = ThomasMenuAPI()
    menu.save_json('thomas_menu.json')

    menuReader = ThomasMenu()
    foodItems = menuReader.parse_food_items()

main()
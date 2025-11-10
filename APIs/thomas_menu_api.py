import requests
from helper_functions import get_current_date_str

class ThomasMenuAPI:

    BASE_URL = "https://api-prd.sodexomyway.net/v0.2/data/menu/94311001/14863"
    HEADERS = {
        "api-key": "68717828-b754-420d-9488-4c37cb7d7ef7",
        "Accept": "application/json"
    }

    def __init__(self):
        self.__menu = self.get_menu(get_current_date_str())

    def get_menu(self, date: str): # date format: 'YYYY-MM-DD'
        params = {"date": date}
        response = requests.get(ThomasMenuAPI.BASE_URL, headers=ThomasMenuAPI.HEADERS, params=params)
        return response.json()
    
    def save_json(self, file_path: str):
        with open(file_path, 'w') as f:
            import json
            json.dump(self.__menu, f, indent=4)

# TCDineEval Minimum Viable Product:
***Note***: *User ID may be optional if we want it to be anonymous - though we risk review-bombing*

### Frontend Output
#### thomas_menu.py
```
Initialize ThomasMenu
ThomasMenu.save_json() - saves json file to current directory - NEEDED right now, will be changed to database later
ThomasMenu.parse_food_items() - returns a list of FoodItems.
print(FoodItem) gives all details of FoodItem (take what you need just by doing FoodItem.item)
ratemymeal_backend.py has sample usage.
```

## Backend Systems

### Classes/Objects
#### Meal
Should be hardcoded to have only 4 meals:
- BREAKFAST
- LUNCH
- AFTERNOON SNACK
- DINNER

| field | type | purpose/contents |
| --- | --- | --- |
| name | string | display meal name |
| foodItems | FoodItem List | hold all of the food items in the meal |
| mealRating | float/double | get the rating of the meal based on the food items | 

#### FoodItem
| field | type | purpose/contents |
| --- | --- | --- |
| name | string | display the food name |
| meal | string | what meal it is |
| reviews | string dictionary | hold user ID, message, rating |
| activeRating | float/double | 5.0 scale of the current day |
| overallRating | float/double | 5.0 scale of ratings it received |

#### Review
| field | type | purpose/contents |
| --- | --- | --- |
| userID | string | each user ID |
| rating | float/double | rating they give |
| message | string | message they want to leave |
| date | string-date-format (in EST) | to get the date of review for later usage |

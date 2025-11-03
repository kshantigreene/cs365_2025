# TCDineEval Minimum Viable Product:
***Note***: *User ID may be optional if we want it to be anonymous - though we risk review-bombing*

### Frontend Output
#### ratemymeal_api.py
```
get_breakfast(), get_snack(), get_lunch(), get_dinner() - returns dictionary of food item & calories IN THAT MEAL (ex: {name="Cheese Pizza",calories=150})

get_full_menu() - retuns dictionary of meal, food item, calories (ex: {meal="Breakfast",name="Waffles",calories="250"})

get_rating(food) - returns average 5.0 rating of food item (food parameter can just be a string)

get_rating(meal) - returns average 5.0 rating of that meal (meal parameter can just be a string)

get_comments(food) - returns a dictionary of comments (ex: {userID: 123123, message="this was great!", rating=4.8})
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

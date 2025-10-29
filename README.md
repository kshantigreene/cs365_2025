# TCDineEval Minimum Viable Product:
***Note***: *User ID may be optional if we want it to be anonymous - though we risk review-bombing*
### User Story:
**Viewing**
- I should be able to view the current meal depending on what time of day it is
- I should be able to see the overall rating of the meal based on the food items inside
- I should be able to open the meal and see all of the food items in the current meal
- I should be able to see the current rating of each of the food items
- I should be able to see the overall average rating of each of the food items from past times it has been served.
- I should be able to open the food item and view individual user comments/ratings of the item on the current day.

**Actions**
- I should be able to create a review of a food item and give it a 1-5 star rating as well as add a comment.

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

## Frontend Systems (other team below)

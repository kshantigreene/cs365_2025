import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface FoodItem {
  id: string;
  name: string;
  category: string;
  activeRating: number;
  overallRating: number;
  reviewCount: number;
  imageUrl?: string;
}

interface Meal {
  name: string;
  time: string;
  rating: number;
  foodItems: FoodItem[];
}

export default function HomePage() {
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // NEW: holds the full JSON menu file once loaded
  const [menuData, setMenuData] = useState<any[] | null>(null);

  // NEW: Load JSON menu file ONE TIME from /public
  useEffect(() => {
    async function loadMenu() {
      try {
        const response = await fetch("https://calebrichmond04.pythonanywhere.com/menu/today");
        const json = await response.json();
        console.log("Loaded menu API:", json);
        setMenuData(json);
      } catch (err) {
        console.error("Failed to load menu API:", err);
      }
    }

    loadMenu();
  }, []);

  // NEW: Converts JSON meal groups → FoodItem[]
  function convertMealToFoodItems(mealName: string): FoodItem[] {
    if (!menuData) return [];

    const meal = menuData.find(
      (m: any) => m.name.toUpperCase() === mealName.toUpperCase()
    );

    if (!meal) return [];

    const items: FoodItem[] = [];
    //Some dummy images for a few meals
    const images={
      "Genoa Salami":"https://myfavouritepastime.com/wp-content/uploads/2015/09/maestro-hot-genoa-salami-myfavouritepastime-com_6723.jpg",
      "Parmesan Panko Crusted Tilapia":"https://serpapi.com/searches/69383e77484c096bf7893246/images/6dde57c4a5cbb973a182c2bfd4682ddf1d2e14bca33d5957ed4ee5c4fee1cf30.jpeg",
      "Cavatappi Pasta":"https://www.garnishandglaze.com/wp-content/uploads/2016/02/Cavatappi-4.jpg",
      "Smoked Ham":"https://storage.googleapis.com/grazecart-images-prod/images/d83da4ac-9b7a-44f8-aa9b-0b0fb899e7b8.jpg",
      "Deli Turkey Breast":"https://www.paulinamarket.com/cdn/shop/products/deliturkey.jpg",
      "Chicken Salad":"https://www.herwholesomekitchen.com/wp-content/uploads/2021/03/chickensalad.jpg",
      "Iced Chocolate Cake":"https://i1.wp.com/www.scientificallysweet.com/wp-content/uploads/2020/09/IMG_4087-feature-1.jpg",
      "Pumpkin Pie":"https://tastesbetterfromscratch.com/wp-content/uploads/2022/10/PumpkinPie2-2.jpg"


    }
    meal.groups.forEach((group: any) => {
      group.items.forEach((item: any) => {
        console.log(group.name);
        if(group.name!= "MISCELLANEOUS"){
        items.push({
          id: String(item.menuItemId),
          name: item.formalName,
          category: group.name,
          activeRating: Math.random()*2+3,
          overallRating: Math.random()*2+3,
          reviewCount: Math.floor(Math.random()*100),
          imageUrl:images[item.formalName]  // No images yet, can be added later
        });}
      });
    });

    return items;
  }

  // NEW UPDATED fetchCurrentMeal that uses real menu items
  const fetchCurrentMeal = async (skipLoading = false) => {
    if (!menuData) return; // Wait for the JSON to load

    try {
      if (!skipLoading) setLoading(true);

      await new Promise(resolve => setTimeout(resolve, 300));

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour + currentMinute / 60;
      //const currentTime = 11.5;

      let mealName = "Dining Hall Closed";
      let mealTime = "Next meal: Check schedule";
      let mealRating = 0;
      let foodItems: FoodItem[] = [];

      if (currentTime >= 7 && currentTime < 10) {
        mealName = "Breakfast";
        mealTime = "7:00 AM – 10:00 AM";
        mealRating = 4.0;
        foodItems = convertMealToFoodItems("BREAKFAST");
      }
      else if (currentTime >= 10 && currentTime < 17) {
        mealName = "Lunch";
        mealTime = "11:30 AM – 2:00 PM";
        mealRating = 4.3;
        foodItems = convertMealToFoodItems("LUNCH");
      }
      else if (currentTime >= 17 && currentTime < 20) {
        mealName = "Dinner";
        mealTime = "5:00 PM – 8:00 PM";
        mealRating = 4.2;
        foodItems = convertMealToFoodItems("DINNER");
      }
      else if (currentTime >= 20 && currentTime < 23) {
        mealName = "Late Night";
        mealTime = "9:00 PM – 11:00 PM";
        mealRating = 3.8;
        foodItems = convertMealToFoodItems("LATE NIGHT");
      }

      setCurrentMeal({
        name: mealName,
        time: mealTime,
        rating: mealRating,
        foodItems
      });

    } catch (err) {
      console.error("Failed to fetch meal:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // NEW: Only fetch the current meal AFTER JSON loads
  useEffect(() => {
    if (menuData) fetchCurrentMeal();
  }, [menuData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCurrentMeal(true);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'high';
    if (rating >= 3.5) return '';
    return 'low';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push(<span key={i} className="star">★</span>);
      else if (i === fullStars && hasHalfStar)
        stars.push(<span key={i} className="star" style={{ opacity: 0.5 }}>★</span>);
      else stars.push(<span key={i} className="star empty">★</span>);
    }

    return stars;
  };

  if (loading || !currentMeal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* EVERYTHING BELOW THIS POINT IS YOUR ORIGINAL UI */}
      {/* I did not modify any styling, footer, cards, or navigation */}
      {/* Only the data source changed. */}

      <div className="app-container pb-24">

        <header className="header px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://www.thomas.edu/wp-content/uploads/2024/02/Thomas-College-Logo-2023-200.png"
                alt="Thomas College Logo"
                className="h-12 w-auto" />
              <div>
                <h1 className="logo-gradient text-2xl font-bold">TCDineEval</h1>
                <p className="text-gray-500 text-xs">Rate Your Dining Experience</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">

          {/* CURRENT MEAL CARD */}
          <div className="meal-card mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Current Meal</p>
                <h2 className="text-4xl font-bold text-white">{currentMeal.name}</h2>
                <p className="text-primary-400 mt-1">{currentMeal.time}</p>
              </div>

              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Overall Rating</p>
                <div className="flex items-center gap-2">
                  {renderStars(currentMeal.rating)}
                  <span className={`rating-badge ${getRatingColor(currentMeal.rating)} text-2xl ml-2`}>
                    {currentMeal.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MENU GRID */}
          <h3 className="text-2xl font-bold text-white mb-4">Today's Menu</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentMeal.foodItems.map(item => (
              <Link key={item.id} to={`/food/${item.id}`} className="food-item-card food-card-hover block">
                <div className="relative">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/400x200/1a1a1a/f97316?text=No+Image"}
                    alt={item.name}
                    className="food-image"
                  />

                  <div className="absolute top-3 right-3">
                    <span className={`rating-badge ${getRatingColor(item.activeRating)}`}>
                      {item.activeRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <span className="category-tag">{item.category}</span>
                  <h4 className="text-xl font-bold text-white mb-3">{item.name}</h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Today</p>
                      <div className="flex items-center gap-1">{renderStars(item.activeRating)}</div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">All-Time</p>
                      <p className="text-sm font-semibold text-gray-300">
                        Avg: {item.overallRating.toFixed(1)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-gray-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span>{item.reviewCount} reviews</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

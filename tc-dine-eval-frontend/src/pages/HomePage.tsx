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

  // fetchCurrentMeal
  const fetchCurrentMeal = async (skipLoading = false) => {
  try {
    if (!skipLoading) {
      setLoading(true);
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Determine current meal based on time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + currentMinute / 60;

    let mealName: string;
    let mealTime: string;
    let mealRating: number;
    let foodItems: FoodItem[];

    // Determine which meal it is
    if (currentTime >= 7 && currentTime < 10) {
      // Breakfast: 7:00 AM - 10:00 AM
      mealName = 'Breakfast';
      mealTime = '7:00 AM - 10:00 AM';
      mealRating = 4.0;
      foodItems = [
        {
          id: "b1",
          name: "Scrambled Eggs",
          category: "Protein",
          activeRating: 4.2,
          overallRating: 4.1,
          reviewCount: 34,
          imageUrl: "https://www.allrecipes.com/thmb/0VXMwCY9RVNrNvWcF_9v0iZpNqA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/JF_241160_CreamyCottageCheeseScrambled_4x3_12902-619d00dc88594ea9b8ed884a108db16d.jpg"
        },
        {
          id: "b2",
          name: "Pancakes",
          category: "Entrees",
          activeRating: 4.5,
          overallRating: 4.4,
          reviewCount: 52,
          imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400"
        },
        {
          id: "b3",
          name: "Fresh Fruit Bowl",
          category: "Sides",
          activeRating: 4.3,
          overallRating: 4.3,
          reviewCount: 28,
          imageUrl: "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400"
        },
        {
          id: "b4",
          name: "Bacon Strips",
          category: "Protein",
          activeRating: 4.6,
          overallRating: 4.5,
          reviewCount: 41,
          imageUrl: "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400"
        }
      ];
    } else if (currentTime >= 11.5 && currentTime < 14) {
      // Lunch: 11:30 AM - 2:00 PM
      mealName = 'Lunch';
      mealTime = '11:30 AM - 2:00 PM';
      mealRating = 4.3;
      foodItems = [
        {
          id: "l1",
          name: "Turkey Sandwich",
          category: "Entrees",
          activeRating: 4.4,
          overallRating: 4.2,
          reviewCount: 45,
          imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400"
        },
        {
          id: "l2",
          name: "Garden Salad",
          category: "Salads",
          activeRating: 4.1,
          overallRating: 4.0,
          reviewCount: 38,
          imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"
        },
        {
          id: "l3",
          name: "Tomato Soup",
          category: "Sides",
          activeRating: 4.5,
          overallRating: 4.4,
          reviewCount: 42,
          imageUrl: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400"
        },
        {
          id: "l4",
          name: "Chicken Wrap",
          category: "Entrees",
          activeRating: 4.3,
          overallRating: 4.2,
          reviewCount: 39,
          imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400"
        }
      ];
    } else if (currentTime >= 17 && currentTime < 20) {
      // Dinner: 5:00 PM - 8:00 PM
      mealName = 'Dinner';
      mealTime = '5:00 PM - 8:00 PM';
      mealRating = 4.2;
      foodItems = [
        {
          id: "1",
          name: "Grilled Chicken Breast",
          category: "Protein",
          activeRating: 4.5,
          overallRating: 4.3,
          reviewCount: 47,
          imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400"
        },
        {
          id: "2",
          name: "Caesar Salad",
          category: "Salads",
          activeRating: 4.2,
          overallRating: 4.4,
          reviewCount: 32,
          imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400"
        },
        {
          id: "3",
          name: "Pasta Marinara",
          category: "Entrees",
          activeRating: 3.8,
          overallRating: 3.9,
          reviewCount: 56,
          imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400"
        },
        {
          id: "4",
          name: "Chocolate Cake",
          category: "Desserts",
          activeRating: 4.7,
          overallRating: 4.6,
          reviewCount: 89,
          imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"
        }
      ];
    } else if (currentTime >= 21 && currentTime < 23) {
      // Late Night: 9:00 PM - 11:00 PM
      mealName = 'Late Night';
      mealTime = '9:00 PM - 11:00 PM';
      mealRating = 3.8;
      foodItems = [
        {
          id: "ln1",
          name: "Chicken Tenders",
          category: "Protein",
          activeRating: 4.0,
          overallRating: 3.9,
          reviewCount: 35,
          imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400"
        },
        {
          id: "ln2",
          name: "French Fries",
          category: "Sides",
          activeRating: 3.8,
          overallRating: 3.7,
          reviewCount: 48,
          imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400"
        },
        {
          id: "ln3",
          name: "Ice Cream",
          category: "Desserts",
          activeRating: 4.2,
          overallRating: 4.3,
          reviewCount: 52,
          imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400"
        },
        {
          id: "ln4",
          name: "Pizza Slice",
          category: "Entrees",
          activeRating: 4.1,
          overallRating: 4.0,
          reviewCount: 44,
          imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400"
        }
      ];
    } else {
      // Outside meal times - show next upcoming meal or dinner as default
      mealName = 'Dining Hall Closed';
      mealTime = 'Next meal: Check schedule';
      mealRating = 0;
      foodItems = [];
    }
    
    const mockData: Meal = {
      name: mealName,
      time: mealTime,
      rating: mealRating,
      foodItems: foodItems
    };

    setCurrentMeal(mockData);

    } catch (err) {
      console.error("Failed to fetch meal:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCurrentMeal(true);
  };

  const [pullDistance, setPullDistance] = useState(0);
  const [_isPulling, setIsPulling] = useState(false);

  useEffect(() => {
    fetchCurrentMeal();
  }, []);

  // Pull-to-refresh for touch devices
  useEffect(() => {
    let touchStartY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0 && !refreshing && !isDragging) {
        touchStartY = e.touches[0].clientY;
        isDragging = true;
        setIsPulling(true);
        setPullDistance(0);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || refreshing) return;

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartY;

      if (deltaY > 0) {
        // Pulling down
        setPullDistance(Math.min(deltaY * 0.5, 120)); // Scale and limit the distance
        e.preventDefault(); // Prevent default scroll behavior
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;

      isDragging = false;
      setIsPulling(false);

      if (pullDistance > 80) { // Threshold for triggering refresh
        handleRefresh();
      } else {
        setPullDistance(0);
      }
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [refreshing]);


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

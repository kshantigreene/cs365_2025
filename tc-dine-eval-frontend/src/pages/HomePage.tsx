<<<<<<< HEAD
import { Link } from "react-router-dom";
import { getCurrentMeal } from "../utils/GetCurrentMeals";
import type { MealType } from "../utils/GetCurrentMeals";
// ^ adjust the filename if yours is slightly different

export default function HomePage() {
  const currentMeal = getCurrentMeal();
  const meals: MealType[] = ["breakfast", "lunch", "dinner"];

  return (
    <main style={{ padding: 16 }}>
      <h1>Home Page</h1>

      <p style={{ marginTop: 8 }}>
        Current meal based on time: <b>{currentMeal}</b>
      </p>

      <ul>
        {meals.map((meal) => (
          <li
            key={meal}
            style={{ fontWeight: meal === currentMeal ? "bold" : "normal" }}
          >
            <Link to={`/meal/${meal}`}>
              Go to {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </Link>

            {meal === currentMeal && " ← active now"}
          </li>
         ))}
      </ul>
    </main>
=======
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
    
    let mealType: 'breakfast' | 'lunch' | 'dinner' | 'latenight';
    let mealName: string;
    let mealTime: string;
    let mealRating: number;
    let foodItems: FoodItem[];
    
    // Determine which meal it is
    if (currentTime >= 7 && currentTime < 10) {
      // Breakfast: 7:00 AM - 10:00 AM
      mealType = 'breakfast';
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
      mealType = 'lunch';
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
      mealType = 'dinner';
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
      mealType = 'latenight';
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
      mealType = 'dinner';
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
  } catch (error) {
    console.error('Failed to fetch meal:', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCurrentMeal(true);
  };

  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [startY, setStartY] = useState(0);

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
      if (i < fullStars) {
        stars.push(<span key={i} className="star">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star" style={{ opacity: 0.5 }}>★</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    return stars;
  };

  if (loading) {
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
    <div className="app-container pb-24">
      <header className="header px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
              <img 
                src="https://www.thomas.edu/wp-content/uploads/2024/02/Thomas-College-Logo-2023-200.png" 
                alt="Thomas College Logo" 
                className="h-12 w-auto"
              />
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
        {/* Visual indicator for pull-to-refresh */}
        {isPulling && window.scrollY === 0 && (
          <div
            className="fixed top-0 left-0 right-0 z-50 bg-primary-500 text-white text-center py-2 text-sm font-medium"
            style={{ transform: `translateY(${pullDistance - 60}px)` }}
          >
            {pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
          </div>
        )}

    
        <div className="meal-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Current Meal</p>
              <h2 className="text-4xl font-bold text-white">{currentMeal?.name}</h2>
              <p className="text-primary-400 mt-1">{currentMeal?.time}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">Overall Rating</p>
              <div className="flex items-center gap-2">
                {renderStars(currentMeal?.rating || 0)}
                <span className={`rating-badge ${getRatingColor(currentMeal?.rating || 0)} text-2xl ml-2`}>
                  {currentMeal?.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
  {refreshing ? (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
      Refreshing...
    </span>
  ) : (
    'Pull down to refresh'
  )}
</p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">Today's Menu</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentMeal?.foodItems.map((item) => (
            <Link
              key={item.id}
              to={`/food/${item.id}`}
              className="food-item-card food-card-hover block"
            >
              <div className="relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="food-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200/1a1a1a/f97316?text=No+Image';
                  }}
                />
                <div className="absolute top-3 right-3">
                  <span className={`rating-badge ${getRatingColor(item.activeRating)}`}>
                    {item.activeRating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <span className="category-tag">{item.category}</span>
                </div>

                <h4 className="text-xl font-bold text-white mb-3">{item.name}</h4>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Today</p>
                    <div className="flex items-center gap-1">
                      {renderStars(item.activeRating)}
                    </div>
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

      {/* Footer */}
      <footer className="bg-dark-50 border-t border-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* College Name Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white">Thomas College</h3>
            <p className="text-gray-400 text-sm">Dining Hall Rating System</p>
          </div>

          {/* College Info */}
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm">
              180 West River Road, Waterville, Maine 04901
            </p>
            <p className="text-gray-400 text-sm mt-1">
              <a href="tel:207-859-1111" className="hover:text-primary-500">207-859-1111</a> | 
              <a href="mailto:admissions@thomas.edu" className="hover:text-primary-500 ml-1">admissions@thomas.edu</a>
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <a 
              href="https://www.facebook.com/ThomasCollege" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            <a 
              href="https://www.instagram.com/thomascollege" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            <a 
              href="https://www.linkedin.com/school/thomas-college/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>

            <a 
              href="https://www.youtube.com/channel/UCaQ3goW19Fmtaa1iZTYkYBw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            <a 
              href="https://www.tiktok.com/@thomascollegemaine" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
              aria-label="TikTok"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>

            <a 
              href="https://www.twitter.com/thomascollege" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center border-t border-gray-800 pt-6">
            <p className="text-gray-500 text-sm">
              © 1894 - 2025 - All Rights Reserved. Thomas College
            </p>
            <p className="text-gray-500 text-xs mt-2">
              <a href="#" className="hover:text-primary-500">Privacy Policy</a> | 
              <a href="#" className="hover:text-primary-500 ml-2">Safety & Security</a> | 
              <a href="#" className="hover:text-primary-500 ml-2">Consumer Info</a>
            </p>
          </div>
        </div>
      </footer>

      <nav className="bottom-nav">
        <div className="nav-item active">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span className="text-xs">Home</span>
        </div>
        <Link to="/schedule" className="nav-item">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">Schedule</span>
        </Link>
        <Link to="/history" className="nav-item">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">History</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </div>
>>>>>>> d28bd9aea6d516f218774cdf28f516c9fca1d6cb
  );
}

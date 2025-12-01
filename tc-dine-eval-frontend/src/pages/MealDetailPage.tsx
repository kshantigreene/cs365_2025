import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

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
  id: string;
  name: string;
  time: string;
  date: string;
  rating: number;
  foodItems: FoodItem[];
}

export default function MealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchMeal = async () => {
    try {
      setLoading(true);
      
      // Parse the ID: "3-1" = day 3, meal 1 (Lunch)
      const [dayId, mealIndex] = (id || "1-2").split('-').map(Number);
      
      // Meal templates (same for all days)
      const mealTemplates = [
        {
          name: "Breakfast",
          time: "7:00 AM - 10:00 AM",
          rating: 4.0,
          foodItems: [
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
            },
            {
              id: "b5",
              name: "Orange Juice",
              category: "Sides",
              activeRating: 4.0,
              overallRating: 4.1,
              reviewCount: 25,
              imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400"
            }
          ]
        },
        {
          name: "Lunch",
          time: "11:30 AM - 2:00 PM",
          rating: 4.3,
          foodItems: [
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
            },
            {
              id: "l5",
              name: "Chips",
              category: "Sides",
              activeRating: 3.9,
              overallRating: 3.8,
              reviewCount: 31,
              imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400"
            },
            {
              id: "l6",
              name: "Iced Tea",
              category: "Sides",
              activeRating: 4.2,
              overallRating: 4.1,
              reviewCount: 28,
              imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400"
            },
            {
              id: "l7",
              name: "Apple",
              category: "Sides",
              activeRating: 4.0,
              overallRating: 4.0,
              reviewCount: 22,
              imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400"
            }
          ]
        },
        {
          name: "Dinner",
          time: "5:00 PM - 8:00 PM",
          rating: 4.2,
          foodItems: [
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
            },
            {
              id: "5",
              name: "Steamed Vegetables",
              category: "Sides",
              activeRating: 3.5,
              overallRating: 3.7,
              reviewCount: 23,
              imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400"
            },
            {
              id: "6",
              name: "Mashed Potatoes",
              category: "Sides",
              activeRating: 4.1,
              overallRating: 4.0,
              reviewCount: 35,
              imageUrl: "https://images.unsplash.com/photo-1585307812026-b0a1e7bfa5e4?w=400"
            }
          ]
        },
        {
          name: "Late Night",
          time: "9:00 PM - 11:00 PM",
          rating: 3.8,
          foodItems: [
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
          ]
        }
      ];

      // Get the meal template
      const mealTemplate = mealTemplates[mealIndex] || mealTemplates[2]; // Default to Dinner
      
      // Generate date based on day
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const today = new Date();
      const currentDay = today.getDay();
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
      const monday = new Date(today);
      monday.setDate(today.getDate() - daysFromMonday);
      
      const mealDate = new Date(monday);
      mealDate.setDate(monday.getDate() + (dayId - 1));
      
      const formattedDate = mealDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      const mealData: Meal = {
        id: id || "1-2",
        name: mealTemplate.name,
        time: mealTemplate.time,
        date: formattedDate,
        rating: mealTemplate.rating,
        foodItems: mealTemplate.foodItems
      };
      
      setMeal(mealData);
      
    } catch (error) {
      console.error('Failed to fetch meal:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchMeal();
}, [id]);

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

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'high';
    if (rating >= 3.5) return '';
    return 'low';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Protein': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Salads': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Entrees': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Desserts': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Sides': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading meal details...</p>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <div className="text-center">
          <p className="text-2xl text-white mb-4">Meal not found</p>
          <Link to="/" className="text-primary-500 hover:text-primary-400">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const categorizedItems = meal.foodItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as { [key: string]: FoodItem[] });

  return (
    <div className="app-container min-h-screen pb-24">
      <header className="header px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          <h1 className="logo-gradient text-xl font-bold">TCDineEval</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="meal-card mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Meal Details</p>
              <h2 className="text-5xl font-bold text-white mb-2">{meal.name}</h2>
              <p className="text-primary-400 text-lg">{meal.time}</p>
              <p className="text-gray-500 mt-1">{meal.date}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-2">Overall Meal Rating</p>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {renderStars(meal.rating)}
                </div>
                <span className={`rating-badge ${getRatingColor(meal.rating)} text-3xl`}>
                  {meal.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">{meal.foodItems.length} items available</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Complete Menu</h3>
          <p className="text-gray-400">Browse all items available for this meal</p>
        </div>

        {Object.entries(categorizedItems).map(([category, items]) => (
          <div key={category} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h4 className="text-xl font-bold text-white">{category}</h4>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(category)}`}>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
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
                    <h5 className="text-lg font-bold text-white mb-3">{item.name}</h5>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Today</p>
                        <div className="flex items-center gap-1">
                          {renderStars(item.activeRating)}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">All-Time</p>
                        <p className="text-sm font-semibold text-gray-300">
                          {item.overallRating.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span>{item.reviewCount}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
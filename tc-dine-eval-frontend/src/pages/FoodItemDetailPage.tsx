import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

interface Review {
  id: string;
  userId: string;
  rating: number;
  message: string;
  date: string;
}

interface FoodItem {
  id: string;
  name: string;
  category: string;
  activeRating: number;
  overallRating: number;
  reviewCount: number;
  imageUrl?: string;
  reviews: Review[];
}

export default function FoodItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

 useEffect(() => {
  const fetchFoodItem = async () => {
    try {
      setLoading(true);
      
      // Mock database of all food items
    const foodDatabase: { [key: string]: FoodItem } = {
        // Breakfast items
        "b1": {
          id: "b1",
          name: "Scrambled Eggs",
          category: "Protein",
          activeRating: 4.2,
          overallRating: 4.1,
          reviewCount: 34,
          imageUrl: "https://www.allrecipes.com/thmb/0VXMwCY9RVNrNvWcF_9v0iZpNqA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/JF_241160_CreamyCottageCheeseScrambled_4x3_12902-619d00dc88594ea9b8ed884a108db16d.jpg",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 5,
              message: "Perfectly cooked! Creamy and delicious.",
              date: "Nov 22, 2025"
            },
            {
              id: "2",
              userId: "Anonymous",
              rating: 4,
              message: "Good, but could use more seasoning.",
              date: "Nov 21, 2025"
            }
          ]
        },
        "b2": {
          id: "b2",
          name: "Pancakes",
          category: "Entrees",
          activeRating: 4.5,
          overallRating: 4.4,
          reviewCount: 52,
          imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 5,
              message: "Fluffy and amazing! Best pancakes ever.",
              date: "Nov 22, 2025"
            },
            {
              id: "2",
              userId: "Anonymous",
              rating: 4,
              message: "Really good with maple syrup!",
              date: "Nov 21, 2025"
            }
          ]
        },
        "b3": {
          id: "b3",
          name: "Fresh Fruit Bowl",
          category: "Sides",
          activeRating: 4.3,
          overallRating: 4.3,
          reviewCount: 28,
          imageUrl: "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 4,
              message: "Fresh and tasty! Great variety of fruits.",
              date: "Nov 22, 2025"
            }
          ]
        },
        "b4": {
          id: "b4",
          name: "Bacon Strips",
          category: "Protein",
          activeRating: 4.6,
          overallRating: 4.5,
          reviewCount: 41,
          imageUrl: "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 5,
              message: "Crispy perfection! Just how I like it.",
              date: "Nov 22, 2025"
            }
          ]
        },
        "b5": {
          id: "b5",
          name: "Orange Juice",
          category: "Sides",
          activeRating: 4.0,
          overallRating: 4.1,
          reviewCount: 25,
          imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 4,
              message: "Fresh squeezed! Very refreshing.",
              date: "Nov 22, 2025"
            }
          ]
        },
        
        // Lunch items
        "l1": {
          id: "l1",
          name: "Turkey Sandwich",
          category: "Entrees",
          activeRating: 4.4,
          overallRating: 4.2,
          reviewCount: 45,
          imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 5,
              message: "Best sandwich! Fresh ingredients and great taste.",
              date: "Nov 22, 2025"
            }
          ]
        },
        "l2": {
          id: "l2",
          name: "Garden Salad",
          category: "Salads",
          activeRating: 4.1,
          overallRating: 4.0,
          reviewCount: 38,
          imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 4,
              message: "Fresh veggies! Dressing is tasty.",
              date: "Nov 22, 2025"
            }
          ]
        },
        "l3": {
          id: "l3",
          name: "Tomato Soup",
          category: "Sides",
          activeRating: 4.5,
          overallRating: 4.4,
          reviewCount: 42,
          imageUrl: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 5,
              message: "Warm and comforting! Perfect for a cold day.",
              date: "Nov 22, 2025"
            }
          ]
        },
        
        // Dinner items (existing)
        "1": {
          id: "1",
          name: "Grilled Chicken Breast",
          category: "Protein",
          activeRating: 4.5,
          overallRating: 4.3,
          reviewCount: 47,
          imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 5,
              message: "Really good! Perfectly grilled and juicy. The seasoning was spot on.",
              date: "Nov 18, 2025"
            },
            {
              id: "2",
              userId: "Anonymous",
              rating: 4,
              message: "Pretty tasty but a bit dry today. Still worth trying.",
              date: "Nov 17, 2025"
            }
          ]
        },
        "2": {
          id: "2",
          name: "Caesar Salad",
          category: "Salads",
          activeRating: 4.2,
          overallRating: 4.4,
          reviewCount: 32,
          imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 5,
              message: "Fresh and crispy! The dressing was perfect.",
              date: "Nov 18, 2025"
            },
            {
              id: "2",
              userId: "Anonymous",
              rating: 4,
              message: "Good salad, but could use more parmesan cheese.",
              date: "Nov 17, 2025"
            }
          ]
        },
        "3": {
          id: "3",
          name: "Pasta Marinara",
          category: "Entrees",
          activeRating: 3.8,
          overallRating: 3.9,
          reviewCount: 56,
          imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 4,
              message: "Decent pasta, sauce was a bit bland though.",
              date: "Nov 18, 2025"
            },
            {
              id: "2",
              userId: "Anonymous",
              rating: 3,
              message: "Okay, nothing special. Expected more flavor.",
              date: "Nov 17, 2025"
            }
          ]
        },
        "4": {
          id: "4",
          name: "Chocolate Cake",
          category: "Desserts",
          activeRating: 4.7,
          overallRating: 4.6,
          reviewCount: 89,
          imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 5,
              message: "Amazing! So rich and moist. Best dessert here!",
              date: "Nov 18, 2025"
            },
            {
              id: "2",
              userId: "Anonymous",
              rating: 5,
              message: "Incredible chocolate cake. Always get this!",
              date: "Nov 17, 2025"
            },
            {
              id: "3",
              userId: "Anonymous",
              rating: 4,
              message: "Very good, but sometimes too sweet for me.",
              date: "Nov 16, 2025"
            }
          ]
        },
        
        // Late Night items
        "ln1": {
          id: "ln1",
          name: "Chicken Tenders",
          category: "Protein",
          activeRating: 4.0,
          overallRating: 3.9,
          reviewCount: 35,
          imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 4,
              message: "Crispy and tasty! Perfect late night snack.",
              date: "Nov 22, 2025"
            }
          ]
        },
        "ln2": {
          id: "ln2",
          name: "French Fries",
          category: "Sides",
          activeRating: 3.8,
          overallRating: 3.7,
          reviewCount: 48,
          imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 4,
              message: "Hot and crispy! Could use more salt though.",
              date: "Nov 22, 2025"
            }
          ]
        },
        "ln3": {
          id: "ln3",
          name: "Ice Cream",
          category: "Desserts",
          activeRating: 4.2,
          overallRating: 4.3,
          reviewCount: 52,
          imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 5,
              message: "Delicious! Great variety of flavors.",
              date: "Nov 22, 2025"
            }
          ]
        },
        "ln4": {
          id: "ln4",
          name: "Pizza Slice",
          category: "Entrees",
          activeRating: 4.1,
          overallRating: 4.0,
          reviewCount: 44,
          imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
          reviews: [
            {
              id: "1",
              userId: "Anonymous",
              rating: 4,
              message: "Good pizza! Cheese is melted perfectly.",
              date: "Nov 22, 2025"
            }
          ]
        }
      };

      // Get the food item by ID
      const item = foodDatabase[id || "1"];
      
      if (item) {
        setFoodItem(item);
      } else {
        setFoodItem(null);
      }
      
    } catch (error) {
      console.error('Failed to fetch food item:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchFoodItem();
}, [id]);

  const renderStars = (rating: number, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = interactive ? (hoveredStar >= i || (hoveredStar === 0 && newRating >= i)) : i <= rating;
      
      if (interactive) {
        stars.push(
          <button
            key={i}
            type="button"
            onClick={() => setNewRating(i)}
            onMouseEnter={() => setHoveredStar(i)}
            onMouseLeave={() => setHoveredStar(0)}
            className="text-3xl focus:outline-none transition-transform hover:scale-110"
          >
            <span className={isFilled ? "star" : "star empty"}>★</span>
          </button>
        );
      } else {
        stars.push(
          <span key={i} className={isFilled ? "star" : "star empty"}>★</span>
        );
      }
    }
    return stars;
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
      alert('Please select a rating');
      return;
    }
    
    console.log('Submitting review:', { rating: newRating, message: newReview });
    setShowReviewForm(false);
    setNewRating(0);
    setNewReview('');
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'high';
    if (rating >= 3.5) return '';
    return 'low';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading food details...</p>
        </div>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <div className="text-center">
          <p className="text-2xl text-white mb-4">Food item not found</p>
          <Link to="/" className="text-primary-500 hover:text-primary-400">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container min-h-screen pb-24">
      <header className="header px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          <h1 className="logo-gradient text-xl font-bold">TCDineEval</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 relative z-10">
        <div className="food-item-card overflow-hidden mb-8">
          <img
            src={foodItem.imageUrl}
            alt={foodItem.name}
            className="w-full h-80 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400/1a1a1a/f97316?text=No+Image';
            }}
          />
          
          <div className="p-6">
            <div className="mb-4">
              <span className="category-tag text-sm">{foodItem.category}</span>
            </div>

            <h2 className="text-4xl font-bold text-white mb-6">{foodItem.name}</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-orange p-4 rounded-2xl">
                <p className="text-white/80 text-sm mb-1">Today's Rating</p>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-white">{foodItem.activeRating.toFixed(1)}</span>
                  <div className="flex flex-col">
                    {renderStars(foodItem.activeRating)}
                  </div>
                </div>
              </div>

              <div className="bg-dark-100 p-4 rounded-2xl border border-primary-500/20">
                <p className="text-gray-400 text-sm mb-1">All-Time Average</p>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-white">{foodItem.overallRating.toFixed(1)}</span>
                  <div className="flex flex-col">
                    {renderStars(foodItem.overallRating)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-gray-400 text-sm mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span>{foodItem.reviewCount} Reviews</span>
              </div>
            </div>
          </div>
        </div>

        <div className="food-item-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Reviews</h3>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-2 bg-gradient-orange text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              {showReviewForm ? 'Cancel' : '+ Write Review'}
            </button>
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-dark-100 rounded-2xl border border-primary-500/20">
              <h4 className="text-xl font-bold text-white mb-4">Write Your Review</h4>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-semibold">How was it?</label>
                <div className="flex gap-2">
                  {renderStars(newRating, true)}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-semibold">Your Comments</label>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full bg-dark-50 text-white border border-gray-700 rounded-2xl p-4 focus:border-primary-500 focus:outline-none resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-gray-500 text-sm mt-1 text-right">{newReview.length}/500</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-orange text-white rounded-full font-bold text-lg hover:opacity-90 transition-opacity"
              >
                Submit Review
              </button>
            </form>
          )}

          <div className="space-y-4">
            {foodItem.reviews.map((review) => (
              <div key={review.id} className="p-4 bg-dark-100 rounded-2xl border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-orange flex items-center justify-center">
                      <span className="text-white font-bold">A</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{review.userId}</p>
                      <p className="text-gray-500 text-sm">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">{review.message}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <button
        onClick={() => setShowReviewForm(true)}
        className="floating-action-button"
      >
        +
      </button>
    </div>
  );
}
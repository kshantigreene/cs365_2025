import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Review {
  id: string;
  foodItemId: string;
  foodName: string;
  foodImage: string;
  category: string;
  rating: number;
  message: string;
  date: string;
  mealType: string;
}

export default function HistoryPage() {
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  // Mock user reviews
  const userReviews: Review[] = [
    {
      id: "1",
      foodItemId: "1",
      foodName: "Grilled Chicken Breast",
      foodImage: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400",
      category: "Protein",
      rating: 5,
      message: "Really good! Perfectly grilled and juicy.",
      date: "Nov 22, 2025",
      mealType: "Dinner"
    },
    {
      id: "2",
      foodItemId: "4",
      foodName: "Chocolate Cake",
      foodImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
      category: "Desserts",
      rating: 5,
      message: "Amazing! So rich and moist.",
      date: "Nov 21, 2025",
      mealType: "Dinner"
    },
    {
      id: "3",
      foodItemId: "2",
      foodName: "Caesar Salad",
      foodImage: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
      category: "Salads",
      rating: 4,
      message: "Fresh and crispy! The dressing was perfect.",
      date: "Nov 20, 2025",
      mealType: "Lunch"
    },
    {
      id: "4",
      foodItemId: "b2",
      foodName: "Pancakes",
      foodImage: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
      category: "Entrees",
      rating: 5,
      message: "Fluffy and amazing! Best pancakes ever.",
      date: "Nov 19, 2025",
      mealType: "Breakfast"
    },
    {
      id: "5",
      foodItemId: "3",
      foodName: "Pasta Marinara",
      foodImage: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
      category: "Entrees",
      rating: 3,
      message: "Okay, nothing special. Expected more flavor.",
      date: "Nov 18, 2025",
      mealType: "Dinner"
    }
  ];

  const stats = {
    totalReviews: userReviews.length,
    averageRating: (userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length).toFixed(1),
    favoriteCategory: "Desserts",
    mostReviewed: "Dinner"
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? "star" : "star empty"}>★</span>
      );
    }
    return stars;
  };

  return (
    <div className="app-container min-h-screen pb-24">
      <header className="header px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="logo-gradient text-2xl font-bold">My Review History</h1>
          <p className="text-gray-500 text-sm mt-1">Track your dining experiences</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="meal-card p-4">
            <p className="text-gray-400 text-xs uppercase mb-1">Total Reviews</p>
            <p className="text-3xl font-bold text-white">{stats.totalReviews}</p>
          </div>
          <div className="meal-card p-4">
            <p className="text-gray-400 text-xs uppercase mb-1">Avg Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-white">{stats.averageRating}</p>
              <span className="star text-2xl">★</span>
            </div>
          </div>
          <div className="meal-card p-4">
            <p className="text-gray-400 text-xs uppercase mb-1">Favorite</p>
            <p className="text-lg font-bold text-primary-400">{stats.favoriteCategory}</p>
          </div>
          <div className="meal-card p-4">
            <p className="text-gray-400 text-xs uppercase mb-1">Most Reviewed</p>
            <p className="text-lg font-bold text-primary-400">{stats.mostReviewed}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-orange text-white'
                : 'bg-dark-100 text-gray-400 border border-gray-700'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'week'
                ? 'bg-gradient-orange text-white'
                : 'bg-dark-100 text-gray-400 border border-gray-700'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'month'
                ? 'bg-gradient-orange text-white'
                : 'bg-dark-100 text-gray-400 border border-gray-700'
            }`}
          >
            This Month
          </button>
        </div>

        {/* Reviews List */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Your Reviews</h3>
          <div className="space-y-4">
            {userReviews.map((review) => (
              <Link
                key={review.id}
                to={`/food/${review.foodItemId}`}
                className="food-item-card block p-4 hover:border-primary-500/40 transition-all"
              >
                <div className="flex gap-4">
                  {/* Food Image */}
                  <img
                    src={review.foodImage}
                    alt={review.foodName}
                    className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100/1a1a1a/f97316?text=No+Image';
                    }}
                  />

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-white">{review.foodName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="category-tag text-xs">{review.category}</span>
                          <span className="text-gray-500 text-xs">• {review.mealType}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mt-2">{review.message}</p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <button className="flex items-center gap-1 hover:text-primary-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>
                      <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <nav className="bottom-nav">
        <Link to="/" className="nav-item">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/schedule" className="nav-item">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">Schedule</span>
        </Link>
        <div className="nav-item active">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
          </svg>
          <span className="text-xs">History</span>
        </div>
        <Link to="/profile" className="nav-item">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
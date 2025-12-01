import { useState } from 'react';
import { Link } from 'react-router-dom';

interface MealSchedule {
  id: string;
  name: string;
  time: string;
  date: string;
  dayOfWeek: string;
  rating: number;
  itemCount: number;
  dayId: number;
}

export default function SchedulePage() {
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'latenight'>('dinner');
  const [selectedDay, setSelectedDay] = useState(3);

  // Generate current week dynamically
  const generateWeek = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysFromMonday);
    
    const week = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      const isToday = date.toDateString() === today.toDateString();
      
      week.push({
        id: i + 1,
        name: dayNames[i],
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date,
        isToday
      });
    }
    
    return week;
  };

  const days = generateWeek();
  const todayIndex = days.findIndex(d => d.isToday);

  const mealTypes = [
    { id: 'breakfast', name: 'Breakfast', time: '7:00 AM - 10:00 AM' },
    { id: 'lunch', name: 'Lunch', time: '11:30 AM - 2:00 PM' },
    { id: 'dinner', name: 'Dinner', time: '5:00 PM - 8:00 PM' },
    { id: 'latenight', name: 'Late Night', time: '9:00 PM - 11:00 PM' },
  ];

  // Generate meals for the entire week
  const generateMeals = (): MealSchedule[] => {
    const meals: MealSchedule[] = [];
    const mealData = [
      { name: 'Breakfast', time: '7:00 AM - 10:00 AM', rating: 4.0, itemCount: 5 },
      { name: 'Lunch', time: '11:30 AM - 2:00 PM', rating: 4.3, itemCount: 7 },
      { name: 'Dinner', time: '5:00 PM - 8:00 PM', rating: 4.2, itemCount: 6 },
      { name: 'Late Night', time: '9:00 PM - 11:00 PM', rating: 3.8, itemCount: 4 },
    ];

    days.forEach((day) => {
      mealData.forEach((meal, idx) => {
        meals.push({
          id: `${day.id}-${idx}`,
          name: meal.name,
          time: meal.time,
          date: day.isToday ? `Today, ${day.date}` : 
                day.id === todayIndex + 2 ? `Tomorrow, ${day.date}` : 
                `${day.name}, ${day.date}`,
          dayOfWeek: day.name,
          rating: meal.rating + (Math.random() * 0.4 - 0.2), // Slight variation
          itemCount: meal.itemCount,
          dayId: day.id
        });
      });
    });

    return meals;
  };

  const allMeals = generateMeals();

  // Filter meals by selected day
  const upcomingMeals = allMeals.filter(meal => meal.dayId === selectedDay);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star text-sm">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star text-sm" style={{ opacity: 0.5 }}>★</span>);
      } else {
        stars.push(<span key={i} className="star empty text-sm">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="app-container min-h-screen pb-24">
      <header className="header px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="logo-gradient text-2xl font-bold">Meal Schedule</h1>
          <p className="text-gray-500 text-sm mt-1">Plan your dining week</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Week Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {days.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl border-2 transition-all ${
                  selectedDay === day.id
                    ? 'bg-gradient-orange border-primary-500 text-white'
                    : day.isToday
                    ? 'border-primary-500/30 text-primary-400 bg-primary-500/10'
                    : 'border-gray-700 text-gray-400 bg-dark-100 hover:border-gray-600'
                }`}
              >
                <div className="text-center">
                  <div className="text-xs mb-1">{day.name}</div>
                  <div className="font-bold">{day.date}</div>
                  {day.isToday && (
                    <div className="text-xs mt-1 opacity-80">Today</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Meal Type Tabs */}
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {mealTypes.map((meal) => (
              <button
                key={meal.id}
                onClick={() => setSelectedMeal(meal.id as any)}
                className={`flex-shrink-0 px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedMeal === meal.id
                    ? 'bg-gradient-orange text-white shadow-lg'
                    : 'bg-dark-100 text-gray-400 border border-gray-700 hover:border-primary-500/50'
                }`}
              >
                {meal.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Day Info */}
        <div className="meal-card mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-orange flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white">
                {days.find(d => d.id === selectedDay)?.name} - {days.find(d => d.id === selectedDay)?.date}
              </h2>
              <p className="text-primary-400 mt-1">
                {upcomingMeals.length} meals available
              </p>
            </div>
          </div>
        </div>

        {/* Meals for Selected Day */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
              {selectedMeal === 'breakfast' && 'Breakfast on '}
              {selectedMeal === 'lunch' && 'Lunch on '}
              {selectedMeal === 'dinner' && 'Dinner on '}
              {selectedMeal === 'latenight' && 'Late Night on '}
              {days.find(d => d.id === selectedDay)?.name}
          </h3>
          <div className="space-y-4">
            <div className="space-y-4">
  {upcomingMeals
    .filter((meal) => {
      // Filter by selected meal type
      if (selectedMeal === 'breakfast') return meal.name === 'Breakfast';
      if (selectedMeal === 'lunch') return meal.name === 'Lunch';
      if (selectedMeal === 'dinner') return meal.name === 'Dinner';
      if (selectedMeal === 'latenight') return meal.name === 'Late Night';
      return true; // Show all if no filter
    })
    .map((meal) => (
              <Link
                key={meal.id}
                to={`/meal/${meal.id}`}
                className="food-item-card block p-6 hover:border-primary-500/40 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{meal.name}</h4>
                    <p className="text-primary-400 text-sm">{meal.time}</p>
                    <p className="text-gray-500 text-sm mt-1">{meal.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="rating-badge mb-2">{meal.rating.toFixed(1)}</div>
                    <div className="flex items-center gap-1 justify-end">
                      {renderStars(meal.rating)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>{meal.itemCount} items available</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-500 font-semibold">
                    <span>View Menu</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
            </div>
          </div>
        </div>

        {/* Meal Reminders Toggle */}
        <div className="mt-8 p-6 bg-dark-100 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-bold">Meal Reminders</h4>
                <p className="text-gray-400 text-sm">Get notified before meal times</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-orange"></div>
            </label>
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
        <div className="nav-item active">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
          <span className="text-xs">Schedule</span>
        </div>
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
  );
}
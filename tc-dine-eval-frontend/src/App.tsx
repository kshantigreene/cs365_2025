import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MealDetailPage from "./pages/MealDetailPage";
import FoodItemDetailPage from "./pages/FoodItemDetailPage";
import SchedulePage from "./pages/SchedulePage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/meal/:id" element={<MealDetailPage />} />
        <Route path="/food/:id" element={<FoodItemDetailPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">404</h1>
              <p className="text-gray-400 mb-6">Page not found</p>
              <a href="/" className="px-6 py-3 bg-gradient-orange text-white rounded-full font-semibold hover:opacity-90">
                Back to Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
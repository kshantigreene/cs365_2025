import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main style={{ padding: 16 }}>
      <h1>Home Page — it works 🎉</h1>
      <ul>
        <li><Link to="/meal/breakfast">Go to Breakfast</Link></li>
        <li><Link to="/meal/lunch">Go to Lunch</Link></li>
        <li><Link to="/food/42">Go to Food Item 42</Link></li>
      </ul>
    </main>
  );
}

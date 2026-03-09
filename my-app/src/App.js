import { useState } from "react";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingCompanies = ["Google", "Meta", "Microsoft", "Apple"];
  const recentAnalyses = ["Software Engineer at Apple", "Data Scientist at IBM"];

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // later this will navigate to the company/role page
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <span className="logo">HireSense</span>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">How It Works</a>
        </div>
      </nav>

      {/* Hero / Search Section */}
      <div className="hero">
        <h1>Search internships!</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search a company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Analyze Posting</button>
        </div>
      </div>

      {/* Trending + Recent */}
      <div className="sections">
        <div className="trending">
          <h3>Trending Companies</h3>
          {trendingCompanies.map((company) => (
            <button key={company} className="chip">{company}</button>
          ))}
        </div>
        <div className="recent">
          <h3>Recent Internship Analyses</h3>
          {recentAnalyses.map((item) => (
            <button key={item} className="chip">{item}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
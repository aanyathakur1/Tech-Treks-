import { useState } from "react";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingCompanies = ["Google", "Amazon", "Nvidia"];
  const recentAnalyses = ["Software Engineer at Apple", "Data Scientist at IBM"];

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <span className="logo">HireSense</span>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">How It Works</a>
        </div>
      </nav>

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

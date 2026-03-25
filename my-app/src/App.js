import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import CompanyInfo from "./pages/CompanyInfo";
import HowItWorks from "./pages/HowItWorks"; 

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingCompanies = ["Google", "Meta", "Microsoft", "Apple"];
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
          <a href="/how-it-works">How It Works</a>
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/company" element={<CompanyInfo />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

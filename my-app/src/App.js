import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import CompanyInfo from "./pages/CompanyInfo";
import HowItWorks from "./pages/HowItWorks";
import RoleInfo from "./pages/RoleInfo"; 

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [trendingCompanies, setTrendingCompanies] = useState([]);
const [recentAnalyses, setRecentAnalyses] = useState([]);

useEffect(() => {
  fetch("http://0.0.0.0:5000/companies/trending")
    .then(res => res.json())
    .then(data => setTrendingCompanies(data));

fetch("http://0.0.0.0:5000/postings/recent")    .then(res => res.json())
    .then(data => setRecentAnalyses(data));
}, []);

  const toSlug = (value) => value.trim().replace(/\s+/g, "-");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const handleCompanyClick = (company) => {
    navigate(`/${toSlug(company)}`);
  };

  const handleRoleClick = (item) => {
    navigate(`/${toSlug(item.companies?.name)}/${toSlug(item.title)}`);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <a href="/" style={{ textDecoration: "none" }}>
          <span className="logo">
            <img src="/logo.png" alt="HireSense Logo" />
            HireSense
          </span>
        </a>
        <div className="nav-links">
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
            <button key={company.id} className="chip" onClick={() => handleCompanyClick(company.name)}>{company.name}</button>
          ))}
        </div>
        <div className="recent">
          <h3>Recent Internship Analyses</h3>
          {recentAnalyses.map((item) => (
             <button key={item.id} className="chip" onClick={() => handleRoleClick(item)}>
              {item.title} at {item.companies?.name}
               </button>
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
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/:companyName" element={<CompanyInfo />} />
        <Route path="/:companyName/:roleName" element={<RoleInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useState } from "react";
import { useParams } from "react-router-dom";

function CompanyInfo() {
  const [activeFilter, setActiveFilter] = useState("Selectivity");
  const [showAll, setShowAll] = useState(false);
  const { companyName } = useParams();

  const acronymMap = {
    ai: "AI",
    api: "API",
    hr: "HR",
    ibm: "IBM",
    ml: "ML",
    qa: "QA",
    ui: "UI",
    ux: "UX"
  };

  const toTitle = (value = "") =>
    value
      .replace(/-/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((part) => {
        const lower = part.toLowerCase();
        if (acronymMap[lower]) {
          return acronymMap[lower];
        }

        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join(" ");

  const toSlug = (value = "") => value.trim().replace(/\s+/g, "-");

  const company = {
    name: companyName ? toTitle(companyName) : "Google",
    linkedin: "linkedin.com/company/google",
    locations: "New York, NY · San Francisco, CA · Seattle, WA",
    hiringPage: "careers.google.com",
    jobPostings: [
      "Software Engineer Intern - Summer 2026",
      "Data Science Intern - Summer 2026",
      "Product Manager Intern - Summer 2026",
      "UX Design Intern - Summer 2026",
      "Machine Learning Intern - Summer 2026",
      "Systems Engineer Intern - Summer 2026",
    ]
  }

  const filters = ["Selectivity", "Reputation", "Experiences"];
  const visiblePostings = showAll ? company.jobPostings : company.jobPostings.slice(0, 4);

  return (
    <div style={{ fontFamily: "sans-serif" }}>

      {/* Navbar */}
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

      <div style={{ padding: "0 40px" }}>

      {/* Company Header */}
      <div style={{ background: "#dde3ff", borderRadius: "12px", padding: "24px", display: "flex", gap: "24px", marginTop: "24px" }}>
        <div style={{ width: "100px", height: "100px", background: "#aaa", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
          Logo
        </div>
        <div>
          <h2 style={{ margin: "0 0 8px 0" }}>{company.name}</h2>
          <p style={{ margin: "4px 0" }}>{company.linkedin}</p>
          <p style={{ margin: "4px 0" }}>{company.locations}</p>
          <p style={{ margin: "4px 0" }}>{company.hiringPage}</p>
        </div>
      </div>

      {/* Job Postings + Filter */}
      <div style={{ display: "flex", gap: "24px", marginTop: "32px" }}>

        {/* Job Postings List */}
        <div style={{ flex: 2 }}>
          <h3>Job Postings</h3>
          {visiblePostings.map((job) => (
            <a
              key={job}
              href={`/${toSlug(company.name)}/${toSlug(job.replace(/\s*-\s*Summer\s*\d{4}.*/i, "").replace(/\s+Intern$/i, "").trim())}`}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div style={{ background: "#dde3ff", borderRadius: "8px", padding: "16px", marginBottom: "8px" }}>
                {job}
              </div>
            </a>
          ))}
          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <button onClick={() => setShowAll(!showAll)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #aaa", cursor: "pointer" }}>
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <div style={{ flex: 1 }}>
          <h3>Filter By:</h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background: activeFilter === filter ? "#4F6EF7" : "#dde3ff",
                  color: activeFilter === filter ? "white" : "black"
                }}
              >
                {filter}
              </button>
            ))}
          </div>
          <div style={{ background: "#dde3ff", borderRadius: "8px", height: "300px", padding: "16px" }}>
            Filtering by: {activeFilter}
          </div>
        </div>

      </div>

      {/* LeetCode Section */}
      <div style={{ marginTop: "32px" }}>
        <h3>LeetCode</h3>
        <div style={{ background: "#dde3ff", borderRadius: "8px", padding: "40px", textAlign: "center", color: "#666" }}>
          Amount of space needed can be determined later
        </div>
      </div>
      </div>

    </div>
  );
}

export default CompanyInfo;
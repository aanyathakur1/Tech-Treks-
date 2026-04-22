import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function CompanyInfo() {
  const [activeFilter, setActiveFilter] = useState("Average Intern Rating");
  const [showAll, setShowAll] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [companyPostings, setCompanyPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { companyName } = useParams();
  const [reputation, setReputation] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);

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

  useEffect(() => {
    let ignore = false;

    const loadCompany = async () => {
      const requestedName = (companyName || "").replace(/-/g, " ").trim();

      if (!requestedName) {
        setLoadError("No company selected.");
        setCompanyData(null);
        setCompanyPostings([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError("");

      try {
        const searchResponse = await fetch(
          `http://0.0.0.0:5000/companies/search?q=${encodeURIComponent(requestedName)}`
        );

        if (!searchResponse.ok) {
          throw new Error("Failed to search company");
        }

        const companies = await searchResponse.json();
        const matchedCompany =
          companies.find(
            (company) => company.name.toLowerCase() === requestedName.toLowerCase()
          ) ?? companies[0];

        if (!matchedCompany) {
          if (!ignore) {
            setCompanyData(null);
            setCompanyPostings([]);
            setLoadError(`No company found for "${toTitle(companyName)}".`);
            setLoading(false);
          }
          return;
        }

        const [companyResponse, postingsResponse] = await Promise.all([
          fetch(`http://0.0.0.0:5000/companies/${matchedCompany.id}`),
          fetch(`http://0.0.0.0:5000/companies/${matchedCompany.id}/postings`)
        ]);

        if (!companyResponse.ok || !postingsResponse.ok) {
          throw new Error("Failed to fetch company data");
        }

        const [companyDetails, postings] = await Promise.all([
          companyResponse.json(),
          postingsResponse.json()
        ]);

        if (!ignore) {
          setCompanyData(companyDetails);
          setCompanyPostings(postings || []);
        }
        fetch(`http://0.0.0.0:5000/companies/${matchedCompany.id}/reputation`)
  .then(res => res.json())
  .then(data => setReputation(data));

fetch(`http://0.0.0.0:5000/companies/${matchedCompany.id}/interview-questions`)
  .then(res => res.json())
  .then(data => setInterviewQuestions(data));
      } catch (error) {
        if (!ignore) {
          setCompanyData(null);
          setCompanyPostings([]);
          setLoadError("Unable to load company information right now.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadCompany();

    return () => {
      ignore = true;
    };
  }, [companyName]);

  const company = {
    name: companyData?.name || (companyName ? toTitle(companyName) : "Company"),
    linkedin_url: companyData?.linkedin_url || "LinkedIn URL not available",
    headquarters: companyData?.headquarters || "Headquarters not listed",
    careers_url: companyData?.careers_url || "Careers page not available",
    jobPostings: companyPostings.map((posting) => posting.title)
  };

  const filters = [
    "Average Intern Rating",
    "Return Offer Rate",
    "Alumni Outcome Notes"
  ];
  const visiblePostings = showAll ? companyPostings : companyPostings.slice(0, 4);

  return (
    <div style={{ fontFamily: "sans-serif" }}>

      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" style={{ textDecoration: "none" }}>
  <span className="logo">
            <img src="/logo.png" alt="HireSense Logo" />
            HireSense
          </span>
        </Link>
        <div className="nav-links">
          <Link to="/how-it-works">How It Works</Link>
        </div>
      </nav>

      <div style={{ padding: "0 40px" }}>
      {loading ? <p style={{ marginTop: "16px" }}>Loading company information...</p> : null}
      {loadError ? <p style={{ marginTop: "16px", color: "#c62828" }}>{loadError}</p> : null}

      {/* Company Header */}
      <div style={{ background: "#dde3ff", borderRadius: "12px", padding: "24px", display: "flex", gap: "24px", marginTop: "24px" }}>
        {companyData?.logo_url ? (
  <img
    src={companyData.logo_url}
    alt={`${company.name} logo`}
    style={{ width: "100px", height: "100px", objectFit: "contain", background: "#fff", borderRadius: "8px", padding: "8px" }}
  />
) : (
  <img
  src={`https://www.google.com/s2/favicons?domain=${companyData?.careers_url?.replace("https://", "").split("/")[0]}&sz=128`}
  alt={`${company.name} logo`}
  style={{ width: "100px", height: "100px", objectFit: "contain", background: "#fff", borderRadius: "8px", padding: "8px" }}
  onError={(e) => { e.target.style.display = 'none' }}
/>
)}
        <div>
          <h2 style={{ margin: "0 0 8px 0" }}>{company.name}</h2>
          <a href={company.linkedin_url} target="_blank" rel="noreferrer" style={{ margin: "4px 0", display: "block" }}>{company.linkedin_url}</a>
          <p style={{ margin: "4px 0" }}>{company.headquarters}</p>
          <a href={company.careers_url} target="_blank" rel="noreferrer" style={{ margin: "4px 0", display: "block" }}>{company.careers_url}</a>
        </div>
      </div>

      {/* Job Postings + Filter */}
      <div style={{ display: "flex", gap: "24px", marginTop: "32px" }}>

        {/* Job Postings List */}
        <div style={{ flex: 2 }}>
          <h3>Job Postings</h3>

          {visiblePostings.length ? (
            <>
              {visiblePostings.map((job) => (
                <a
                  key={job.id}
                  href={`/${toSlug(company.name)}/${toSlug(job.title.replace(/\s*-\s*Summer\s*\d{4}.*/i, "").replace(/\s+Intern$/i, "").trim())}`}
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <div style={{ background: "#dde3ff", borderRadius: "8px", padding: "16px", marginBottom: "8px" }}>
                    {job.title}
                  </div>
                </a>
              ))}
              <div style={{ textAlign: "center", marginTop: "12px" }}>
                <button onClick={() => setShowAll(!showAll)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #aaa", cursor: "pointer" }}>
                  {showAll ? "Show Less" : "Show More"}
                </button>
              </div>
            </>
          ) : (
            <div style={{ background: "#dde3ff", borderRadius: "8px", padding: "16px" }}>
              No active internship postings found for this company.
            </div>
          )}
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
          <div style={{ background: "#dde3ff", borderRadius: "8px", padding: "16px" }}>
  {activeFilter === "Average Intern Rating" && (
    <p><strong>Average Intern Rating:</strong> {reputation?.avg_intern_rating}/5</p>
  )}
  {activeFilter === "Return Offer Rate" && (
    <p><strong>Return Offer Rate:</strong> {reputation ? `${(reputation.return_offer_rate * 100).toFixed(0)}%` : "N/A"}</p>
  )}
  {activeFilter === "Alumni Outcome Notes" && (
    <p>{reputation?.alumni_outcome_note || "No data available"}</p>
  )}
</div>
        </div>

      </div>

      {/* LeetCode Section */}
      <div style={{ marginTop: "32px" }}>
        <h3>Interview Questions</h3>
       <div style={{ marginTop: "32px", marginBottom: "40px" }}>
  
  <div style={{ background: "#dde3ff", borderRadius: "8px", padding: "24px" }}>
    {interviewQuestions.length ? (
      interviewQuestions.slice(0, 5).map((q) => (
        <div key={q.id} style={{ padding: "10px 0", borderBottom: "1px solid #b8c5ff" }}>
          <p style={{ margin: 0 }}>{q.question}</p>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#666" }}>{q.category} · {q.source}</p>
        </div>
      ))
    ) : (
      <p style={{ color: "#666", textAlign: "center" }}>No interview questions available.</p>
    )}
  </div>
</div>
      </div>
      </div>

    </div>
  );
}

export default CompanyInfo;

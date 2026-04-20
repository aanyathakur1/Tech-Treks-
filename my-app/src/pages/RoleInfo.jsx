import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../App.css";

function RoleInfo() {
  const { companyName, roleName } = useParams();

  const [roleData, setRoleData] = useState(null);

useEffect(() => {
  fetch(`http://0.0.0.0:5000/companies/search?q=${companyName}`)
    .then(res => res.json())
    .then(companies => {
      if (companies.length > 0) {
        const company = companies[0];
        fetch(`http://0.0.0.0:5000/companies/${company.id}/postings`)
          .then(res => res.json())
          .then(postings => {
            const match = postings.find(p => 
              p.title.toLowerCase().includes(roleName.replace(/-/g, " ").toLowerCase())
            );
            if (match) {
              fetch(`http://0.0.0.0:5000/postings/${match.id}`)
                .then(res => res.json())
                .then(data => setRoleData(data));
            }
          });
      }
    });

}, [companyName, roleName]);
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

  if (!roleData) return <div style={{ padding: "40px" }}>Loading...</div>;
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

        {/* Role Header */}
        <div style={{ background: "#dde3ff", borderRadius: "12px", padding: "24px", marginTop: "24px", display: "flex", gap: "24px", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <div style={{ width: "100px", height: "100px", background: "#aaa", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "600" }}>
              Logo
            </div>
            <div>
              <h2 style={{ margin: "0 0 8px 0" }}>{toTitle(companyName)}</h2>
              <p style={{ margin: "4px 0", fontSize: "16px", fontWeight: "500" }}>{roleData.posting.title}</p>
              <p style={{ margin: "4px 0", color: "#666" }}>📍 {roleData.posting.location}</p>
              <p style={{ margin: "4px 0", color: "#666" }}>{roleData.posting.season}</p>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ background: "#b8c5ff", borderRadius: "12px", padding: "12px 24px", marginBottom: "12px" }}>
              <div style={{ fontSize: "32px", letterSpacing: "4px" }}>
                {Array(5).fill("★").map((star, i) => (
                  <span key={i} style={{ color: "#ffd700" }}>{star}</span>
                ))}
              </div>
            </div>
            <button style={{ background: "#b8c5ff", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              View Original Posting
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "32px" }}>
          
          {/* Snapshot Card */}
          <div style={{ background: "#dde3ff", borderRadius: "12px", padding: "28px" }}>
            <h3 style={{ marginBottom: "18px", fontSize: "22px", borderBottom: "2px solid #b8c5ff", paddingBottom: "10px" }}>Snapshot</h3>
            
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #b8c5ff" }}>
                <span style={{ color: "#555", fontSize: "15px" }}>Estimated Applicants:</span>
                <span style={{ fontWeight: "600", fontSize: "15px" }}>{`${roleData.analysis?.est_applicants_low}-${roleData.analysis?.est_applicants_high}`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #b8c5ff" }}>
                <span style={{ color: "#555", fontSize: "15px" }}>Estimated Acceptance Rate:</span>
                <span style={{ fontWeight: "600", fontSize: "15px" }}>{`${roleData.analysis?.accept_rate_low * 100}%-${roleData.analysis?.accept_rate_high * 100}%`}</span>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontWeight: "600", marginBottom: "10px", fontSize: "15px" }}>Typical Backgrounds:</p>
              <p style={{ paddingLeft: "20px", fontSize: "15px", color: "#555", lineHeight: "1.8" }}>
                 {roleData.analysis?.typical_background}
              </p>
            </div>

            <div>
              <p style={{ fontWeight: "600", marginBottom: "10px", fontSize: "15px" }}>Workload:</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ display: "flex", gap: "5px" }}>
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: i < roleData.analysis?.workload_score ? "#4a6cf7" : "#b8c5ff"
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: "15px", fontWeight: "600" }}>Moderate</span>
              </div>
            </div>
          </div>

          {/* Right Column - Required Skills & What Previous Interns Say */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Required Skills */}
            <div style={{ background: "#dde3ff", borderRadius: "12px", padding: "28px" }}>
              <h3 style={{ marginBottom: "18px", fontSize: "22px", borderBottom: "2px solid #b8c5ff", paddingBottom: "10px" }}>Required Skills</h3>
              <p style={{ fontWeight: "600", marginBottom: "12px", fontSize: "15px" }}>Core Skills:</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {roleData.skills.filter(s => s.is_core).map((s, i) => (
                  <span key={i} style={{ 
                    background: "#7a8cff", 
                    color: "white", 
                    padding: "8px 16px", 
                    borderRadius: "6px",
                    fontSize: "15px",
                    fontWeight: "500"
                  }}>
                    {s.skill_name}
                  </span>
                ))}
              </div>
            </div>

            {/* What Previous Interns Say */}
            <div style={{ background: "#dde3ff", borderRadius: "12px", padding: "28px" }}>
              <h3 style={{ marginBottom: "18px", fontSize: "22px", borderBottom: "2px solid #b8c5ff", paddingBottom: "10px" }}>What Previous Interns Say</h3>
              
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #b8c5ff", marginBottom: "14px" }}>
                <span style={{ color: "#555", fontSize: "15px" }}>Resume Value:</span>
                <span style={{ fontWeight: "700", fontSize: "15px", color: "#4a6cf7" }}>{roleData.reviews[0]?.resume_value}</span>
              </div>

              <p style={{ fontWeight: "600", marginBottom: "10px", fontSize: "15px" }}>Comments:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {roleData.reviews.map((r, i) => (
                  <span key={i} style={{ 
                    background: "#b8c5ff", 
                    padding: "8px 14px", 
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#1a1a1a"
                  }}>
                    {r.review_text}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Apply Button */}
        <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "40px" }}>
          <button style={{
            padding: "14px 32px",
            background: "#4a6cf7",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "600"
          }}>
            Apply Now
          </button>
        </div>

      </div>
    </div>
  );
}

export default RoleInfo;

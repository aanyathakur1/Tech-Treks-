import { useState } from "react";
function HowItWorks() {
  const [activeCard, setActiveCard] = useState(0);

  const cards = [
    { title: "Selectivity", description: "Get an estimate of the applicant pool for your target role, see what acceptance rates have looked like, and understand what backgrounds most successful candidates come from." },
    { title: "Reputation", description: "Hear directly from past interns about their experience. Get a real insight into company culture so you can decide if the organization is the right fit for you." },
    { title: "Experiences", description: "Go beyond the job posting. Understand what the day-to-day workload looks like, how the interview process has played out in the past, and what skills you'll actually need to succeed." },
  ]

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

      <div style={{ padding: "0 40px 80px 40px" }}>

    <div style={{ textAlign: "center", padding: "60px 0 40px 0" }}>
      <h1 style={{ fontSize: "42px", marginBottom: "16px" }}>How It Works</h1>
      <p style={{ fontSize: "18px", color: "#666", maxWidth: "500px", margin: "0 auto" }}>
        We strive to take the guessing out of internship hunting so you can land the position meant for you.
      </p>
    </div>
    <div style={{ display: "flex", gap: "24px", marginBottom: "40px" }}>
    <div style={{ flex: 1, background: "#dde3ff", borderRadius: "12px", padding: "24px" }}>
      <h3 style={{ marginBottom: "12px" }}>1. Search</h3>
      <p>Enter a company you're interested in.</p>
    </div>
    <div style={{ flex: 1, background: "#dde3ff", borderRadius: "12px", padding: "24px" }}>
      <h3 style={{ marginBottom: "12px" }}>2. Analyze</h3>
      <p>Watch us break down the information for you. See internships offered, a snapshot of the role, required skills, and more.</p>
    </div>
    <div style={{ flex: 1, background: "#dde3ff", borderRadius: "12px", padding: "24px" }}>
      <h3 style={{ marginBottom: "12px" }}>3. Apply with Confidence</h3>
      <p>Know exactly what you're getting into before you commit.</p>
      </div>
    </div>
    <h2 style={{ textAlign: "center", marginBottom: "24px" }}>What We Analyze</h2>

    <div style={{ background: "#dde3ff", borderRadius: "12px", padding: "40px", textAlign: "center", marginBottom: "24px" }}>
      <h3 style={{ marginBottom: "16px" }}>{cards[activeCard].title}</h3>
      <p style={{ fontSize: "16px", color: "#444", maxWidth: "600px", margin: "0 auto" }}>{cards[activeCard].description}</p>
    </div>

    <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "40px" }}>
      {cards.map((card, index) => (
        <button
          key={card.title}
          onClick={() => setActiveCard(index)}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: activeCard === index ? "#4a6cf7" : "#dde3ff",
            color: activeCard === index ? "white" : "black"
          }}
        >
          {card.title}
        </button>
      ))}
    </div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
       <p style={{ fontSize: "18px", color: "#666" }}>Ready to get started?</p>
       <a href="/" style={{ display: "inline-block", marginTop: "12px", padding: "12px 28px", background: "#4a6cf7", color: "white", borderRadius: "8px", textDecoration: "none" }}>
       Search Internships
      </a>
      </div>
      </div>
    </div>
)

}
export default HowItWorks;


function HowItWorks() {
  return (
    <div className="app">
      <nav className="navbar">
        <span className="logo">HireSense</span>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/how-it-works">How It Works</a>
        </div>
      </nav>

      <div style={{ padding: "0 40px" }}>

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
      <p>Ready to get started? Head back to the search bar to look up your dream company.</p>
      </div>
    </div>
    
  )
}
export default HowItWorks;
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import HotelSection from "../components/HotelSection";
import { getUserHotels } from "../service/user.api";

// ── Animated Counter ────────────────────────────────────────────────────────
const AnimatedCount = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const end = Number(target);
          if (!end) { setCount(target); return; }
          let cur = 0;
          const step = end / 60;
          const id = setInterval(() => {
            cur = Math.min(cur + step, end);
            setCount(Math.floor(cur));
            if (cur >= end) clearInterval(id);
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const HeadphonesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);
const StarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, color, delay }) => (
  <div
    style={{
      background: "#111216",
      border: "1px solid #27272a",
      borderRadius: "20px",
      padding: "28px",
      animation: `fadeUp 0.6s ${delay}s ease both`,
      transition: "border-color 0.3s, transform 0.3s",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = color + "44";
      e.currentTarget.style.transform = "translateY(-4px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = "#27272a";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <div style={{
      width: "48px", height: "48px", borderRadius: "14px",
      background: color + "18", border: `1px solid ${color}33`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color, marginBottom: "18px",
    }}>
      {icon}
    </div>
    <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.15rem", color: "#fff", margin: "0 0 8px" }}>{title}</h3>
    <p style={{ color: "#52525b", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>{desc}</p>
  </div>
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ value, suffix, label, delay }) => (
  <div
    style={{
      textAlign: "center",
      animation: `fadeUp 0.6s ${delay}s ease both`,
      padding: "20px",
    }}
  >
    <p style={{
      fontFamily: "Georgia, serif",
      fontSize: "clamp(2rem,4vw,3rem)",
      color: "#d4af37",
      margin: "0 0 6px",
      lineHeight: 1,
    }}>
      <AnimatedCount target={value} suffix={suffix} />
    </p>
    <p style={{ color: "#71717a", fontSize: "13px", margin: 0 }}>{label}</p>
  </div>
);

// ── Testimonial Card ──────────────────────────────────────────────────────────
const testimonials = [
  { name: "Aisha Sharma", city: "Mumbai", text: "Absolutely stunning experience! Booked via BookMyStay and the room was exactly as described. Will book again.", stars: 5 },
  { name: "Rohan Mehra", city: "Delhi",  text: "Seamless booking process, beautiful interface. Got a luxury suite at a great price. Highly recommend!", stars: 5 },
  { name: "Priya Nair",  city: "Bangalore", text: "The best hotel booking experience I've had. Premium hotels, easy check-in, amazing support.", stars: 5 },
];

// ── Main Home Component ───────────────────────────────────────────────────────
const Home = () => {
  const [hotels, setHotels]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [heroLoaded, setHeroLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUserHotels();
        setHotels(data.hotels || []);
      } catch (err) {
        console.error("Hotels loading error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
    // trigger hero animation
    setTimeout(() => setHeroLoaded(true), 50);
  }, []);

  const filteredHotels = hotels.filter(h =>
    !search ||
    h.name?.toLowerCase().includes(search.toLowerCase()) ||
    h.city?.toLowerCase().includes(search.toLowerCase()) ||
    h.location?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = () => {
    const el = document.getElementById("hotels-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b0c10", color: "#fff", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0b0c10; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
        input::placeholder { color: #52525b; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        input[type="date"] { color-scheme: dark; }
      `}</style>

      <UserNavbar />

      {/* ════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION                                                 */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", alignItems: "center" }}>

        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920&auto=format&fit=crop")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.28)",
        }} />

        {/* Color overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "200px", background: "linear-gradient(to top, #0b0c10, transparent)" }} />

        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "15%", right: "8%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)", borderRadius: "50%", animation: "floatY 6s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "5%", width: "280px", height: "280px", background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "120px 24px 80px", position: "relative", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>

          {/* ── Left: Text + Search ── */}
          <div style={{ opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "999px", padding: "6px 14px", marginBottom: "24px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d4af37", animation: "pulse 2s ease-in-out infinite", display: "inline-block" }} />
              <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
              <span style={{ color: "#d4af37", fontSize: "11px", fontWeight: 700, letterSpacing: "0.3em" }}>PREMIUM HOTEL EXPERIENCE</span>
            </div>

            <h1 style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              lineHeight: 1.15,
              margin: "0 0 20px",
              background: "linear-gradient(140deg, #ffffff 50%, #d4af37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Discover Stays Made for Luxury & Peace
            </h1>

            <p style={{ color: "#71717a", fontSize: "16px", lineHeight: 1.75, margin: "0 0 36px", maxWidth: "480px" }}>
              Explore handpicked hotels, premium rooms, and seamless booking — all in one beautifully crafted experience with <strong style={{ color: "#d4af37" }}>BookMyStay</strong>.
            </p>

            {/* Search Bar */}
            <div style={{
              background: "rgba(17,18,22,0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid #27272a",
              borderRadius: "20px",
              padding: "12px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}>
              <div style={{ flex: 1, minWidth: "160px", display: "flex", alignItems: "center", gap: "10px", background: "#0b0c10", border: "1px solid #27272a", borderRadius: "12px", padding: "12px 14px" }}>
                <span style={{ color: "#52525b", flexShrink: 0 }}><MapPinIcon /></span>
                <input
                  type="text"
                  placeholder="Hotel name or city…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: "14px", width: "100%", fontFamily: "inherit" }}
                />
              </div>

              <button
                onClick={handleSearch}
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f0c960)",
                  color: "#0b0c10",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 28px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 20px rgba(212,175,55,0.35)",
                  transition: "opacity 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <SearchIcon />
                Search Hotels
              </button>
            </div>

            {/* Quick links */}
            <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
              {["Mumbai", "Delhi", "Goa", "Jaipur"].map(city => (
                <button
                  key={city}
                  onClick={() => { setSearch(city); handleSearch(); }}
                  style={{
                    background: "transparent",
                    border: "1px solid #27272a",
                    borderRadius: "999px",
                    padding: "6px 14px",
                    color: "#71717a",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#d4af3766"; e.currentTarget.style.color = "#d4af37"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#27272a"; e.currentTarget.style.color = "#71717a"; }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Hero Image Card ── */}
          <div style={{
            position: "relative",
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.9s 0.2s ease, transform 0.9s 0.2s ease",
          }}>
            {/* Glow behind */}
            <div style={{ position: "absolute", top: "-30px", left: "-30px", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

            {/* Main hotel image */}
            <div style={{ borderRadius: "24px", overflow: "hidden", border: "1px solid #27272a", position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
                alt="Luxury Hotel"
                style={{ width: "100%", height: "480px", objectFit: "cover", display: "block", animation: "floatY 8s ease-in-out infinite" }}
              />
              {/* Image overlay */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(11,12,16,0.7) 0%, transparent 50%)" }} />

              {/* Featured label */}
              <div style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px" }}>
                <div style={{
                  background: "rgba(17,18,22,0.9)", backdropFilter: "blur(16px)",
                  border: "1px solid #27272a", borderRadius: "16px", padding: "16px 20px",
                }}>
                  <p style={{ fontSize: "9px", letterSpacing: "0.3em", color: "#52525b", margin: "0 0 6px", fontWeight: 700 }}>FEATURED COLLECTION</p>
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem", color: "#fff", margin: "0 0 4px" }}>Luxury Rooms with Peaceful Vibes</h3>
                  <p style={{ color: "#71717a", fontSize: "12px", margin: 0 }}>Premium hotels added by admin</p>
                </div>
              </div>
            </div>

            {/* Floating stat card */}
            <div style={{
              position: "absolute", top: "24px", right: "-20px",
              background: "rgba(17,18,22,0.95)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: "16px", padding: "14px 18px",
              animation: "floatY 6s 1s ease-in-out infinite",
            }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "1.6rem", color: "#d4af37", margin: "0 0 2px", lineHeight: 1 }}>
                {loading ? "…" : `${hotels.length}+`}
              </p>
              <p style={{ color: "#52525b", fontSize: "11px", margin: 0 }}>Hotels Listed</p>
            </div>

            {/* Floating rating */}
            <div style={{
              position: "absolute", bottom: "120px", left: "-24px",
              background: "rgba(17,18,22,0.95)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(212,175,55,0.15)",
              borderRadius: "14px", padding: "12px 16px",
              display: "flex", alignItems: "center", gap: "10px",
              animation: "floatY 7s 2s ease-in-out infinite",
            }}>
              <div style={{ color: "#d4af37", display: "flex" }}>
                {[...Array(5)].map((_, i) => <span key={i} style={{ fontSize: "12px" }}>★</span>)}
              </div>
              <div>
                <p style={{ color: "#fff", fontSize: "12px", fontWeight: 700, margin: 0 }}>Trusted by Guests</p>
                <p style={{ color: "#52525b", fontSize: "10px", margin: 0 }}>100% verified reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* STATS BAR                                                    */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div style={{ borderTop: "1px solid #27272a", borderBottom: "1px solid #27272a", background: "#111216" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
          {[
            { value: hotels.length || 0, suffix: "+", label: "Premium Hotels" },
            { value: 24,    suffix: "/7", label: "Support Available" },
            { value: 100,   suffix: "%",  label: "Secure Payments" },
            { value: 5000,  suffix: "+",  label: "Happy Guests" },
          ].map((s, i) => (
            <div key={s.label} style={{ borderRight: i < 3 ? "1px solid #27272a" : "none" }}>
              <StatCard {...s} delay={i * 0.08} />
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* WHY CHOOSE US                                                */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.35em", color: "#d4af37", fontWeight: 700, margin: "0 0 12px" }}>✦ WHY BOOKMYSTAY</p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "#fff", margin: "0 0 14px" }}>
            Everything You Need for the Perfect Stay
          </h2>
          <p style={{ color: "#52525b", fontSize: "15px", maxWidth: "480px", margin: "0 auto", lineHeight: 1.65 }}>
            We make hotel booking simple, beautiful, and completely secure.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          <FeatureCard delay={0}    color="#d4af37" icon={<StarIcon />}       title="Handpicked Hotels"    desc="Every hotel is carefully verified by our admin team for quality and luxury standards." />
          <FeatureCard delay={0.08} color="#22c55e" icon={<ShieldIcon />}     title="Secure Payments"      desc="100% safe transactions powered by Razorpay with encryption and fraud protection." />
          <FeatureCard delay={0.16} color="#60a5fa" icon={<HeadphonesIcon />} title="24/7 Guest Support"   desc="Our dedicated support team is available around the clock to assist with any queries." />
          <FeatureCard delay={0.24} color="#a855f7" icon={<SearchIcon />}     title="Easy Booking"         desc="Find your perfect room, select dates, add guests and pay — all in under 2 minutes." />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* HOTELS SECTION                                               */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div id="hotels-section" style={{ scrollMarginTop: "80px" }}>
        {loading ? (
          /* Skeleton */
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 80px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ background: "#111216", border: "1px solid #27272a", borderRadius: "20px", overflow: "hidden" }}>
                  <div style={{ height: "220px", background: "#1a1a1f", animation: "pulse 1.5s ease-in-out infinite" }} />
                  <div style={{ padding: "20px" }}>
                    {[80, 60, 40].map((w, j) => (
                      <div key={j} style={{ height: 14, width: `${w}%`, background: "#1a1a1f", borderRadius: "6px", marginBottom: "12px", animation: "pulse 1.5s ease-in-out infinite", animationDelay: `${j * 0.1}s` }} />
                    ))}
                  </div>
                  <style>{`@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.75} }`}</style>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <HotelSection hotels={filteredHotels} />
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS                                                 */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section style={{ borderTop: "1px solid #27272a", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.35em", color: "#d4af37", fontWeight: 700, margin: "0 0 12px" }}>✦ GUEST REVIEWS</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#fff", margin: 0 }}>
              What Our Guests Say
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                style={{
                  background: "#111216",
                  border: "1px solid #27272a",
                  borderRadius: "20px",
                  padding: "28px",
                  animation: `fadeUp 0.6s ${i * 0.1}s ease both`,
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#d4af3744"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#27272a"}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: "2px", marginBottom: "16px" }}>
                  {[...Array(t.stars)].map((_, j) => (
                    <span key={j} style={{ color: "#d4af37", fontSize: "14px" }}>★</span>
                  ))}
                </div>

                <p style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>
                  "{t.text}"
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "18px", borderTop: "1px solid #27272a" }}>
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #d4af37, #f0c960)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#0b0c10", fontWeight: 700, fontSize: "14px", flexShrink: 0,
                  }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ color: "#fff", fontWeight: 600, fontSize: "14px", margin: 0 }}>{t.name}</p>
                    <p style={{ color: "#52525b", fontSize: "12px", margin: 0 }}>{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* CTA BANNER                                                   */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          background: "linear-gradient(135deg, #16131d 0%, #111216 50%, #16131d 100%)",
          border: "1px solid rgba(212,175,55,0.2)",
          borderRadius: "28px",
          padding: "clamp(40px, 6vw, 64px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "32px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* BG glow */}
          <div style={{ position: "absolute", right: "-80px", top: "-80px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

          <div>
            <p style={{ fontSize: "10px", letterSpacing: "0.35em", color: "#d4af37", fontWeight: 700, margin: "0 0 12px" }}>✦ START NOW</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#fff", margin: "0 0 10px", lineHeight: 1.2 }}>
              Ready for Your Next Luxury Stay?
            </h2>
            <p style={{ color: "#71717a", fontSize: "15px", margin: 0 }}>
              Browse hotels, pick your room, and confirm in minutes.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => document.getElementById("hotels-section")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "linear-gradient(135deg, #d4af37, #f0c960)",
                color: "#0b0c10",
                border: "none",
                borderRadius: "14px",
                padding: "14px 28px",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 6px 24px rgba(212,175,55,0.3)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Browse Hotels <ArrowRightIcon />
            </button>
            <button
              onClick={() => navigate("/my-bookings")}
              style={{
                background: "transparent",
                color: "#a1a1aa",
                border: "1px solid #27272a",
                borderRadius: "14px",
                padding: "14px 26px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#d4af3766"; e.currentTarget.style.color = "#d4af37"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#27272a"; e.currentTarget.style.color = "#a1a1aa"; }}
            >
              My Bookings
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* FOOTER                                                       */}
      {/* ════════════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: "1px solid #27272a", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.4rem", color: "#fff", margin: "0 0 4px" }}>BookMyStay</h3>
            <p style={{ color: "#52525b", fontSize: "13px", margin: 0 }}>Premium hotel booking experience.</p>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Home", "My Bookings", "Login"].map(link => (
              <button
                key={link}
                onClick={() => navigate(link === "Home" ? "/" : link === "My Bookings" ? "/my-bookings" : "/login")}
                style={{ background: "none", border: "none", color: "#52525b", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#d4af37"}
                onMouseLeave={e => e.currentTarget.style.color = "#52525b"}
              >
                {link}
              </button>
            ))}
          </div>
          <p style={{ color: "#3f3f46", fontSize: "12px", margin: 0 }}>© 2025 BookMyStay. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
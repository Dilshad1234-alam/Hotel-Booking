import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../auth/state/auth.slice.js";
import { logout } from "../../auth/service/auth.api.js";

// ── Icons ─────────────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const UserCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const BookmarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const AiMatchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Brain */}
    <path d="M9 3a3 3 0 0 0-3 3v1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2v2a3 3 0 0 0 3 3" />
    <path d="M15 3a3 3 0 0 1 3 3v1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2v2a3 3 0 0 1-3 3" />

    {/* Center */}
    <path d="M12 3v18" />
    <path d="M9 9h6" />
    <path d="M9 15h6" />
  </svg>
);

const UserNavbar = () => {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();
  const user      = useSelector((state) => state.auth?.user);

  const showBack = location.pathname !== "/";

  // ── Scroll detection for glass effect ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    if (!dropOpen) return;
    const close = (e) => {
      if (!e.target.closest("#user-dropdown")) setDropOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [dropOpen]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {/* ignore */}
    dispatch(setUser(null));
    navigate("/login");
  };

  const navLinks = [
  {
    to: "/",
    label: "Home",
    icon: <HomeIcon />,
  },
  {
    to: "/my-bookings",
    label: "My Bookings",
    icon: <BookmarkIcon />,
  },
  {
    to: "/ai-match",
    label: "AI Match",
    icon: <AiMatchIcon />,
  },
];

  // Active link style
  const linkStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.2s",
    color: isActive ? "#d4af37" : "#71717a",
    background: isActive ? "rgba(212,175,55,0.08)" : "transparent",
    border: isActive ? "1px solid rgba(212,175,55,0.2)" : "1px solid transparent",
  });

  return (
    <>
      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
        #nav-logo { font-family: Georgia, serif; }
      `}</style>

      {/* ── Main Navbar ── */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled
          ? "rgba(11,12,16,0.92)"
          : "rgba(11,12,16,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid #27272a" : "1px solid transparent",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
        fontFamily: "Inter, system-ui, sans-serif",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}>

          {/* Left Area (Logo & Back Button) */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                style={{
                  background: "rgba(17,18,22,0.8)",
                  border: "1px solid #27272a",
                  borderRadius: "10px",
                  padding: "8px",
                  color: "#a1a1aa",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#d4af3766"; e.currentTarget.style.color = "#d4af37"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#27272a"; e.currentTarget.style.color = "#a1a1aa"; }}
                title="Go Back"
              >
                <ArrowLeftIcon />
              </button>
            )}

            {/* ── Logo ── */}
            <Link
              to="/"
              id="nav-logo"
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#fff",
                textDecoration: "none",
                letterSpacing: "-0.01em",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              <span style={{
                width: "34px", height: "34px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #d4af37, #f0c960)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#0b0c10", fontWeight: 900, fontSize: "15px",
              }}>
                B
              </span>
              <span>
                Book<span style={{ color: "#d4af37" }}>MyStay</span>
              </span>
            </Link>
          </div>

          {/* ── Desktop Nav Links ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }} className="desktop-nav">
            {navLinks.map(({ to, label, icon }) => (
              <NavLink key={to} to={to} end={to === "/"} style={({ isActive }) => linkStyle(isActive)}>
                {icon} {label}
              </NavLink>
            ))}
          </div>

          {/* ── Right: User / Login ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            <div className="desktop-user-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {user ? (
                /* User Avatar + Dropdown */
                <div id="user-dropdown" style={{ position: "relative" }}>
                  <button
                    onClick={() => setDropOpen(d => !d)}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      background: "rgba(17,18,22,0.9)",
                      border: dropOpen ? "1px solid rgba(212,175,55,0.4)" : "1px solid #27272a",
                      borderRadius: "14px",
                      padding: "8px 14px 8px 8px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={e => !dropOpen && (e.currentTarget.style.borderColor = "#3f3f46")}
                    onMouseLeave={e => !dropOpen && (e.currentTarget.style.borderColor = "#27272a")}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "10px",
                      background: "linear-gradient(135deg, #d4af37, #f0c960)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#0b0c10", fontWeight: 800, fontSize: "14px", flexShrink: 0,
                    }}>
                      {user.fullname?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: 0, lineHeight: 1.2, maxWidth: "100px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {user.fullname || "User"}
                      </p>
                      <p style={{ color: "#52525b", fontSize: "10px", margin: 0, textTransform: "capitalize" }}>
                        {user.role || "Guest"}
                      </p>
                    </div>
                    {/* Chevron */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2.5" style={{ transition: "transform 0.2s", transform: dropOpen ? "rotate(180deg)" : "rotate(0)" }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {dropOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 8px)", right: 0,
                      background: "#111216",
                      border: "1px solid #27272a",
                      borderRadius: "16px",
                      padding: "8px",
                      minWidth: "200px",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                      animation: "slideDown 0.2s ease",
                      zIndex: 200,
                    }}>
                      {/* User info */}
                      <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid #27272a", marginBottom: "6px" }}>
                        <p style={{ color: "#fff", fontSize: "14px", fontWeight: 600, margin: "0 0 2px" }}>{user.fullname}</p>
                        <p style={{ color: "#52525b", fontSize: "12px", margin: 0 }}>{user.email}</p>
                      </div>

                      {/* Links */}
                      {[
                        { label: "My Bookings", icon: <BookmarkIcon />, onClick: () => { navigate("/my-bookings"); setDropOpen(false); } },
                      ].map(({ label, icon, onClick }) => (
                        <button
                          key={label}
                          onClick={onClick}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: "10px",
                            padding: "10px 14px", borderRadius: "10px",
                            background: "none", border: "none", cursor: "pointer",
                            color: "#a1a1aa", fontSize: "13px", fontWeight: 500,
                            fontFamily: "inherit", textAlign: "left",
                            transition: "background 0.15s, color 0.15s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#1a1a1f"; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#a1a1aa"; }}
                        >
                          {icon} {label}
                        </button>
                      ))}

                      <div style={{ borderTop: "1px solid #27272a", marginTop: "6px", paddingTop: "6px" }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: "10px",
                            padding: "10px 14px", borderRadius: "10px",
                            background: "none", border: "none", cursor: "pointer",
                            color: "#ef4444", fontSize: "13px", fontWeight: 600,
                            fontFamily: "inherit", textAlign: "left",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                          onMouseLeave={e => e.currentTarget.style.background = "none"}
                        >
                          <LogoutIcon /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Login / Register buttons */
                <div style={{ display: "flex", gap: "8px" }}>
                  <Link
                    to="/login"
                    style={{
                      padding: "9px 18px",
                      borderRadius: "12px",
                      background: "transparent",
                      border: "1px solid #27272a",
                      color: "#a1a1aa",
                      fontSize: "13px",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "all 0.2s",
                      display: "flex", alignItems: "center", gap: "6px",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#3f3f46"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#27272a"; e.currentTarget.style.color = "#a1a1aa"; }}
                  >
                    <UserCircleIcon /> Login
                  </Link>
                  <Link
                    to="/register"
                    style={{
                      padding: "9px 18px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #d4af37, #f0c960)",
                      border: "none",
                      color: "#0b0c10",
                      fontSize: "13px",
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 4px 16px rgba(212,175,55,0.28)",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* ── Hamburger (mobile) ── */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              style={{
                display: "none",
                background: "#111216",
                border: "1px solid #27272a",
                borderRadius: "10px",
                padding: "8px",
                color: "#a1a1aa",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
              }}
              id="hamburger-btn"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div style={{
            borderTop: "1px solid #27272a",
            background: "rgba(11,12,16,0.97)",
            padding: "16px 24px 20px",
            animation: "slideDown 0.2s ease",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              
              {user && (
                <div style={{ padding: "4px 8px 16px", borderBottom: "1px solid #27272a", marginBottom: "8px" }}>
                  <p style={{ color: "#fff", fontSize: "15px", fontWeight: 600, margin: "0 0 2px" }}>{user.fullname}</p>
                  <p style={{ color: "#52525b", fontSize: "12px", margin: 0 }}>{user.email}</p>
                </div>
              )}

              {navLinks.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({
                    ...linkStyle(isActive),
                    justifyContent: "flex-start",
                    fontSize: "15px",
                  })}
                >
                  {icon} {label}
                </NavLink>
              ))}

              <div style={{ borderTop: "1px solid #27272a", marginTop: "10px", paddingTop: "10px", display: "flex", gap: "10px" }}>
                {user ? (
                  <button
                    onClick={handleLogout}
                    style={{
                      flex: 1, padding: "11px",
                      background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: "12px", color: "#ef4444",
                      fontWeight: 600, fontSize: "14px", cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    }}
                  >
                    <LogoutIcon /> Logout
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1, padding: "11px", background: "transparent", border: "1px solid #27272a", borderRadius: "12px", color: "#a1a1aa", fontWeight: 600, fontSize: "14px", textDecoration: "none", textAlign: "center" }}>
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} style={{ flex: 1, padding: "11px", background: "linear-gradient(135deg,#d4af37,#f0c960)", borderRadius: "12px", color: "#0b0c10", fontWeight: 700, fontSize: "14px", textDecoration: "none", textAlign: "center" }}>
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Responsive hamburger CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-user-actions { display: none !important; }
          #hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default UserNavbar;
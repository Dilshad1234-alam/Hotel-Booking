import { useEffect, useState, useMemo } from "react";
import UserNavbar from "../components/UserNavbar";
import { getMyBookings } from "../service/user.api";

// ── Icons (inline SVG) ─────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const BedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const RupeeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12M6 8h12M6 13l8.5 8L19 13"/><path d="M6 13h3a4 4 0 0 0 0-8H6"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const DocIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const EmptyIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
};

const STATUS_CONFIG = {
  approved: { label: "Approved", color: "#22c55e", bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.3)"  },
  pending:   { label: "Pending",   color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)"  },
  completed: { label: "Completed", color: "#a855f7", bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.3)" },
};

const getStatus = (key) =>
  STATUS_CONFIG[key?.toLowerCase()] || STATUS_CONFIG.pending;

// ── Skeleton Loading Card ──────────────────────────────────────────────
const SkeletonCard = () => (
  <div style={{
    background: "#111216",
    border: "1px solid #27272a",
    borderRadius: "24px",
    overflow: "hidden",
    display: "grid",
  }} className="booking-card-grid">
    <div style={{ background: "#1a1a1f", minHeight: "260px", animation: "pulse 1.5s ease-in-out infinite" }} />
    <div style={{ padding: "32px" }}>
      {[100, 60, 80, 40, 50].map((w, i) => (
        <div key={i} style={{
          height: i === 0 ? 28 : 14,
          width: `${w}%`,
          background: "#1a1a1f",
          borderRadius: "8px",
          marginBottom: "18px",
          animation: "pulse 1.5s ease-in-out infinite",
          animationDelay: `${i * 0.12}s`,
        }} />
      ))}
    </div>
  </div>
);

// ── Stat Card ──────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color = "#d4af37", delay = 0 }) => (
  <div
    style={{
      background: "#111216",
      border: "1px solid #27272a",
      borderRadius: "20px",
      padding: "28px",
      animation: `fadeUp 0.6s ease both`,
      animationDelay: `${delay}s`,
      transition: "border-color 0.3s, transform 0.3s",
      cursor: "default",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = color + "55";
      e.currentTarget.style.transform = "translateY(-4px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = "#27272a";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
      <div style={{ color, opacity: 0.8 }}>{icon}</div>
      <p style={{ color: "#71717a", fontSize: "13px", fontWeight: 500, margin: 0 }}>{label}</p>
    </div>
    <h2 style={{ fontSize: "2rem", fontFamily: "Georgia, serif", color, lineHeight: 1, margin: 0 }}>{value}</h2>
  </div>
);

// ── Booking Card ───────────────────────────────────────────────────────
const BookingCard = ({ booking, index }) => {
  const status = getStatus(booking.status);
  const nights = getNights(booking.checkInDate, booking.checkOutDate);
  const imgSrc =
    booking.hotel?.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop";

  return (
    <div
      style={{
        background: "#111216",
        border: "1px solid #27272a",
        borderRadius: "24px",
        overflow: "hidden",
        animation: `fadeUp 0.5s ease both`,
        animationDelay: `${index * 0.08}s`,
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#d4af3755";
        e.currentTarget.style.boxShadow = "0 8px 40px rgba(212,175,55,0.07)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#27272a";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="booking-card-grid" style={{ display: "grid" }}>
        {/* Hotel Image */}
        <div style={{ position: "relative", minHeight: "260px", overflow: "hidden" }}>
          <img
            src={imgSrc}
            alt={booking.hotel?.name || "Hotel"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.5s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          />
          {/* Nights badge */}
          <div style={{
            position: "absolute", bottom: "12px", left: "12px",
            background: "rgba(0,0,0,0.72)", backdropFilter: "blur(10px)",
            borderRadius: "12px", padding: "6px 13px",
            display: "flex", alignItems: "center", gap: "6px",
            color: "#d4af37", fontSize: "13px", fontWeight: 700,
            border: "1px solid rgba(212,175,55,0.2)",
          }}>
            <MoonIcon />
            {nights} Night{nights !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Details Panel */}
        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column" }}>
          {/* Top: Name + Status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#52525b", fontWeight: 600, margin: 0 }}>
                BOOKING DETAILS
              </p>
              <h2 style={{
                fontSize: "clamp(1.3rem,2.5vw,1.9rem)",
                fontFamily: "Georgia, serif",
                color: "#fff",
                margin: "10px 0 0",
                lineHeight: 1.2,
              }}>
                {booking.hotel?.name || "Hotel"}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", color: "#d4af37", fontSize: "14px" }}>
                <MapPinIcon />
                <span>
                  {booking.hotel?.city || "City"}
                  {booking.hotel?.location ? ` • ${booking.hotel.location}` : ""}
                </span>
              </div>
            </div>

            {/* Status badge */}
            <span style={{
              background: status.bg,
              color: status.color,
              border: `1px solid ${status.border}`,
              borderRadius: "999px",
              padding: "7px 18px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
              flexShrink: 0,
              textTransform: "uppercase",
            }}>
              {status.label}
            </span>
          </div>

          {/* Info cards grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "10px",
            marginTop: "22px",
          }}>
            {[
              { icon: <BedIcon />,      label: "Room Type", value: booking.room?.roomType || "N/A"                        },
              { icon: <CalendarIcon />, label: "Check In",  value: formatDate(booking.checkInDate)                        },
              { icon: <CalendarIcon />, label: "Check Out", value: formatDate(booking.checkOutDate)                       },
              { icon: <UsersIcon />,    label: "Guests",    value: `${booking.guests || 1} Guest${(booking.guests || 1) > 1 ? "s" : ""}` },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                style={{
                  background: "#0b0c10",
                  border: "1px solid #27272a",
                  borderRadius: "14px",
                  padding: "14px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#52525b", marginBottom: "8px" }}>
                  {icon}
                  <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em", margin: 0 }}>{label}</p>
                </div>
                <p style={{ color: "#e4e4e7", fontWeight: 600, fontSize: "14px", margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Footer: price + buttons */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginTop: "auto",
            paddingTop: "22px",
            borderTop: "1px solid #27272a",
          }}>
            <div>
              <p style={{ color: "#52525b", fontSize: "12px", margin: "0 0 4px" }}>Total Price</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "2rem", fontFamily: "Georgia, serif", color: "#d4af37", lineHeight: 1 }}>
                  ₹{(booking.totalPrice || 0).toLocaleString("en-IN")}
                </span>
                {nights > 0 && (
                  <span style={{ color: "#52525b", fontSize: "13px" }}>
                    ({nights} nights)
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                style={{
                  background: "transparent",
                  border: "1px solid #3f3f46",
                  color: "#a1a1aa",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#d4af3766";
                  e.currentTarget.style.color = "#d4af37";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#3f3f46";
                  e.currentTarget.style.color = "#a1a1aa";
                }}
              >
                View Invoice
              </button>
              <button
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f0c960)",
                  color: "#0b0c10",
                  border: "none",
                  borderRadius: "12px",
                  padding: "10px 22px",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "opacity 0.2s, transform 0.2s",
                  boxShadow: "0 4px 18px rgba(212,175,55,0.28)",
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = "0.88";
                  e.currentTarget.style.transform = "scale(1.04)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                View Details
              </button>
            </div>
          </div>

           {/* ================= Booking Timeline ================= */}

<div
  style={{
    marginTop: "24px",
    paddingTop: "24px",
    borderTop: "1px solid #27272a",
  }}
>
  <h3
    style={{
      color: "#d4af37",
      fontSize: "20px",
      fontFamily: "Georgia, serif",
      marginBottom: "20px",
    }}
  >
    Booking Timeline
  </h3>

  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
    {(booking.timeline || [
      {
        title: "Booking Requested",
        note: "Customer submitted booking request.",
        date: booking.createdAt,
      },
      {
        title:
          booking.status === "approved"
            ? "Booking Approved"
            : booking.status === "cancelled"
            ? "Booking Cancelled"
            : "Waiting for Admin Approval",
        note:
          booking.status === "approved"
            ? "Admin approved your booking."
            : booking.status === "cancelled"
            ? "Booking cancelled by admin."
            : "Your booking is under review.",
        date: booking.updatedAt || booking.createdAt,
      },
    ]).map((item, index, arr) => (
      <div
        key={index}
        style={{
          display: "flex",
          gap: "16px",
        }}
      >
        {/* Timeline Dot */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "#d4af37",
            }}
          />

          {index !== arr.length - 1 && (
            <div
              style={{
                width: "2px",
                height: "55px",
                background: "#27272a",
                marginTop: "6px",
              }}
            />
          )}
        </div>

        {/* Timeline Content */}
        <div style={{ flex: 1 }}>
          <h4
            style={{
              color: "#fff",
              fontWeight: 600,
              margin: 0,
            }}
          >
            {item.title}
          </h4>

          <p
            style={{
              color: "#71717a",
              marginTop: "6px",
              marginBottom: "6px",
              lineHeight: 1.6,
              fontSize: "14px",
            }}
          >
            {item.note}
          </p>

          <span
            style={{
              color: "#52525b",
              fontSize: "12px",
            }}
          >
            {item.date
              ? new Date(item.date).toLocaleString("en-IN")
              : ""}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

// ── Main Page Component ────────────────────────────────────────────────
const MyBooking = () => {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeFilter, setFilter] = useState("all");
  const [search, setSearch]       = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyBookings();
        console.log(data.bookings);
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("My bookings error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalAmount = useMemo(
    () => bookings.reduce((s, b) => s + (b.totalPrice || 0), 0),
    [bookings]
  );
  const confirmedCount = useMemo(
    () => bookings.filter(b => b.status?.toLowerCase() === "approved").length,
    [bookings]
  );

  const FILTERS = ["all", "approved", "pending", "cancelled", "completed"];

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const matchStatus = activeFilter === "all" || b.status?.toLowerCase() === activeFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        b.hotel?.name?.toLowerCase().includes(q) ||
        b.hotel?.city?.toLowerCase().includes(q) ||
        b.room?.roomType?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [bookings, activeFilter, search]);

  return (
    <div style={{ minHeight: "100vh", background: "#0b0c10", color: "#fff", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Global styles + animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity: 0.4; }
          50%      { opacity: 0.75; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0b0c10; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
        input::placeholder { color: #52525b; }
        input:focus { outline: none; }
        
        .booking-card-grid {
          grid-template-columns: clamp(180px, 26%, 280px) 1fr;
        }
        @media (max-width: 768px) {
          .booking-card-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <UserNavbar />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px 100px" }}>

        {/* ── Hero Header ───────────────────────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg, #111216 0%, #16131d 100%)",
          border: "1px solid #27272a",
          borderRadius: "28px",
          padding: "clamp(30px, 5vw, 56px)",
          marginBottom: "28px",
          position: "relative",
          overflow: "hidden",
          animation: "fadeUp 0.5s ease both",
        }}>
          {/* Glow blob */}
          <div style={{
            position: "absolute", top: "-80px", right: "-80px",
            width: "360px", height: "360px",
            background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 65%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-60px", left: "30%",
            width: "200px", height: "200px",
            background: "radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }} />

          <p style={{ fontSize: "11px", letterSpacing: "0.38em", color: "#d4af37", fontWeight: 700, margin: 0 }}>
            ✦ MY BOOKINGS
          </p>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.4rem)",
            fontFamily: "Georgia, serif",
            margin: "16px 0 0",
            lineHeight: 1.15,
            background: "linear-gradient(140deg, #ffffff 40%, #d4af37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Your Hotel Reservations
          </h1>
          <p style={{ marginTop: "14px", color: "#71717a", fontSize: "16px", maxWidth: "500px", lineHeight: 1.65, marginBottom: 0 }}>
            Track your stays, room details, check-in/out dates, and complete payment history — all in one place.
          </p>
        </div>

        {/* ── Stats Dashboard ────────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "14px",
          marginBottom: "28px",
        }}>
          <StatCard delay={0.05}  icon={<DocIcon />}     label="Total Bookings" value={bookings.length}                                                               color="#d4af37" />
          <StatCard delay={0.10}  icon={<RupeeIcon />}   label="Total Spent"    value={`₹${totalAmount.toLocaleString("en-IN")}`}                                     color="#d4af37" />
          <StatCard delay={0.15}  icon={<CheckIcon />}   label="Confirmed"      value={confirmedCount}                                                                 color="#22c55e" />
          <StatCard delay={0.20}  icon={<StarIcon />}    label="Latest Status"  value={bookings[0]?.status ? bookings[0].status.charAt(0).toUpperCase() + bookings[0].status.slice(1) : "—"} color="#a855f7" />
        </div>

        {/* ── Filter Tabs + Search ───────────────────────────────────── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          animation: "fadeUp 0.5s 0.25s ease both",
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {FILTERS.map(f => {
              const isActive = activeFilter === f;
              const cfg = f === "all" ? null : getStatus(f);
              const count = f === "all" ? bookings.length : bookings.filter(b => b.status?.toLowerCase() === f).length;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: isActive ? `1px solid ${cfg?.border || "#d4af3766"}` : "1px solid #27272a",
                    background: isActive ? (cfg?.bg || "rgba(212,175,55,0.11)") : "transparent",
                    color: isActive ? (cfg?.color || "#d4af37") : "#71717a",
                    fontFamily: "inherit",
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <span style={{ marginLeft: "6px", opacity: 0.6, fontSize: "12px" }}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search input */}
          <div style={{ position: "relative", minWidth: "230px" }}>
            <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#52525b" }}>
              <SearchIcon />
            </div>
            <input
              type="text"
              id="booking-search"
              placeholder="Search hotel, city, room…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: "#111216",
                border: "1px solid #27272a",
                borderRadius: "14px",
                padding: "10px 16px 10px 44px",
                color: "#e4e4e7",
                fontSize: "14px",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "#d4af3766")}
              onBlur={e => (e.currentTarget.style.borderColor = "#27272a")}
            />
          </div>
        </div>

        {/* ── Results label ─────────────────────────────────────────── */}
        {!loading && (
          <p style={{ color: "#52525b", fontSize: "13px", marginBottom: "16px", animation: "fadeUp 0.4s 0.3s ease both" }}>
            Showing{" "}
            <span style={{ color: "#d4af37", fontWeight: 700 }}>{filtered.length}</span>
            {" "}booking{filtered.length !== 1 ? "s" : ""}
            {activeFilter !== "all" ? ` • ${activeFilter}` : ""}
          </p>
        )}

        {/* ── Main Content ──────────────────────────────────────────── */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <div style={{
            background: "#111216",
            border: "1px solid #27272a",
            borderRadius: "28px",
            padding: "80px 40px",
            textAlign: "center",
            animation: "fadeUp 0.5s ease both",
          }}>
            <div style={{ color: "#27272a", display: "inline-block", marginBottom: "24px" }}>
              <EmptyIcon />
            </div>
            <h2 style={{ fontSize: "1.8rem", fontFamily: "Georgia, serif", color: "#fff", margin: "0 0 12px" }}>
              {search || activeFilter !== "all" ? "No bookings match your filters" : "No bookings yet"}
            </h2>
            <p style={{ color: "#52525b", maxWidth: "360px", margin: "0 auto 32px", lineHeight: 1.65 }}>
              {search || activeFilter !== "all"
                ? "Try clearing your search or switching to a different filter."
                : "Your future hotel reservations will appear here after you make a booking."}
            </p>
            {(search || activeFilter !== "all") && (
              <button
                onClick={() => { setSearch(""); setFilter("all"); }}
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f0c960)",
                  color: "#0b0c10",
                  border: "none",
                  borderRadius: "14px",
                  padding: "12px 30px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 20px rgba(212,175,55,0.25)",
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* Booking List */
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {filtered.map((booking, idx) => (
              <BookingCard key={booking._id} booking={booking} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;
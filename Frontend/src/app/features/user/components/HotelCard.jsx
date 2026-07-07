import { Link } from "react-router-dom";

const HotelCard = ({ hotel, index = 0 }) => {
  const imgSrc =
    hotel.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop";

  return (
    <Link
      to={`/hotels/${hotel._id}`}
      style={{
        display: "block",
        background: "#111216",
        border: "1px solid #27272a",
        borderRadius: "20px",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        animation: `fadeUp 0.5s ${index * 0.07}s ease both`,
        transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#d4af3766";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(212,175,55,0.1)";
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.querySelector(".hotel-img").style.transform = "scale(1.07)";
        e.currentTarget.querySelector(".view-btn").style.opacity = "1";
        e.currentTarget.querySelector(".view-btn").style.transform = "translateY(0)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#27272a";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.querySelector(".hotel-img").style.transform = "scale(1)";
        e.currentTarget.querySelector(".view-btn").style.opacity = "0";
        e.currentTarget.querySelector(".view-btn").style.transform = "translateY(8px)";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
        <img
          className="hotel-img"
          src={imgSrc}
          alt={hotel.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
        />

        {/* Dark gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(11,12,16,0.7) 0%, transparent 60%)",
        }} />

        {/* Rating badge */}
        {hotel.rating != null && (
          <div style={{
            position: "absolute", top: "12px", right: "12px",
            background: "rgba(212,175,55,0.9)", backdropFilter: "blur(8px)",
            borderRadius: "999px", padding: "4px 10px",
            fontSize: "12px", fontWeight: 700, color: "#0b0c10",
            display: "flex", alignItems: "center", gap: "4px",
          }}>
            ★ {hotel.rating}
          </div>
        )}

        {/* View Rooms button (animated) */}
        <div
          className="view-btn"
          style={{
            position: "absolute", bottom: "14px", left: "50%",
            transform: "translateX(-50%) translateY(8px)",
            background: "linear-gradient(135deg, #d4af37, #f0c960)",
            color: "#0b0c10", borderRadius: "999px",
            padding: "8px 20px", fontSize: "13px", fontWeight: 700,
            whiteSpace: "nowrap",
            opacity: 0, transition: "opacity 0.3s, transform 0.3s",
            pointerEvents: "none",
          }}
        >
          View Rooms →
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: "20px 22px 22px" }}>
        <p style={{ fontSize: "9px", letterSpacing: "0.32em", color: "#52525b", fontWeight: 700, margin: "0 0 8px" }}>
          PREMIUM STAY
        </p>

        <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.25rem", color: "#fff", margin: "0 0 6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {hotel.name}
        </h3>

        <p style={{ color: "#d4af37", fontSize: "13px", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "4px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {hotel.city}{hotel.location ? ` • ${hotel.location}` : ""}
        </p>

        <p style={{ color: "#52525b", fontSize: "13px", margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>
          {hotel.description || "Experience luxury and comfort at its finest."}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid #27272a" }}>
          <span style={{ color: "#52525b", fontSize: "12px" }}>
            {hotel.rooms?.length ?? "—"} room types
          </span>
          <span style={{ color: "#d4af37", fontSize: "13px", fontWeight: 600 }}>
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
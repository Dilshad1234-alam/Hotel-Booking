import HotelCard from "./HotelCard";

const HotelSection = ({ hotels }) => {
  return (
    <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 80px" }}>

      {/* Section Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "36px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "10px", letterSpacing: "0.35em", color: "#d4af37", fontWeight: 700, margin: "0 0 10px" }}>
            ✦ FEATURED HOTELS
          </p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#fff", margin: 0, lineHeight: 1.2 }}>
            Explore Premium Stays
          </h2>
          <p style={{ color: "#52525b", marginTop: "10px", fontSize: "14px" }}>
            Handpicked luxury hotels — click any card to view rooms & book.
          </p>
        </div>

        {hotels.length > 0 && (
          <span style={{
            background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: "999px", padding: "6px 16px",
            color: "#d4af37", fontSize: "13px", fontWeight: 600,
            whiteSpace: "nowrap",
          }}>
            {hotels.length} Hotel{hotels.length !== 1 ? "s" : ""} Available
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "linear-gradient(to right, #d4af3722, transparent)", marginBottom: "36px" }} />

      {hotels.length === 0 ? (
        /* Empty State */
        <div style={{
          background: "#111216", border: "1px solid #27272a",
          borderRadius: "24px", padding: "64px 32px", textAlign: "center",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏨</div>
          <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.6rem", color: "#fff", margin: "0 0 10px" }}>
            No Hotels Listed Yet
          </h3>
          <p style={{ color: "#52525b", fontSize: "14px", maxWidth: "340px", margin: "0 auto" }}>
            Hotels added by admin will appear here. Check back soon!
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {hotels.map((hotel, i) => (
            <HotelCard key={hotel._id} hotel={hotel} index={i} />
          ))}
        </div>
      )}
    </section>
  );
};

export default HotelSection;
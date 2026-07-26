import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import UserNavbar from "../components/UserNavbar";
import {
  getUserHotelById,
  createUserBooking,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createReview,
} from "../service/user.api";

// ── Razorpay Script ──────────────────────────────────────────────────────────
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id = "razorpay-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

// ── Helpers ──────────────────────────────────────────────────────────────────
const todayStr   = () => new Date().toISOString().split("T")[0];
const minCO      = (ci) => { if (!ci) return todayStr(); const d = new Date(ci); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; };
const nights     = (ci, co) => { if (!ci || !co) return 0; return Math.max(0, Math.round((new Date(co) - new Date(ci)) / 86400000)); };
const fmt        = (n) => new Intl.NumberFormat("en-IN").format(n ?? 0);
const fmtDate    = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";
const avgRating  = (reviews) => reviews?.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : null;

// ── ICONS ────────────────────────────────────────────────────────────────────
const IC = {
  close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  cal:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  user:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  moon:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  check: () => <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  bed:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>,
  pin:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  star:  (filled=true) => <svg width="14" height="14" viewBox="0 0 24 24" fill={filled?"#d4af37":"none"} stroke="#d4af37" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  wifi:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  pool:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M2 8c1.5 0 3-1 3-2V4"/><path d="M22 8c-1.5 0-3-1-3-2V4"/><path d="M2 16c1.5 0 3 1 3 2v2"/><path d="M22 16c-1.5 0-3 1-3 2v2"/></svg>,
  ac:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="8" rx="2"/><path d="M8 18l4-4 4 4"/><path d="M6 10h1"/><path d="M10 10h1"/><path d="M14 10h1"/><path d="M18 10h1"/></svg>,
  park:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4a2 2 0 0 1 2 2v5H1"/><line x1="7" y1="21" x2="7" y2="16"/><line x1="17" y1="21" x2="17" y2="16"/></svg>,
  gym:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M3 10h3v4H3z"/><path d="M18 10h3v4h-3z"/><line x1="6" y1="12" x2="18" y2="12"/></svg>,
  food:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
  edit:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

// ── Star Rating Input ─────────────────────────────────────────────────────────
const StarInput = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: "4px" }}>
    {[1,2,3,4,5].map(n => (
      <button key={n} type="button" onClick={() => onChange(n)}
        style={{ background:"none", border:"none", cursor:"pointer", padding:"2px" }}>
        <svg width="22" height="22" viewBox="0 0 24 24"
          fill={n <= value ? "#d4af37" : "none"}
          stroke={n <= value ? "#d4af37" : "#3f3f46"} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </button>
    ))}
  </div>
);

// ── Review Card ───────────────────────────────────────────────────────────────
const ReviewCard = ({ review }) => (
  <div style={{
    background: "#0b0c10", border: "1px solid #27272a",
    borderRadius: "16px", padding: "20px",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          background: "linear-gradient(135deg, #d4af37, #f0c960)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#0b0c10", fontWeight: 800, fontSize: "15px", flexShrink: 0,
        }}>
          {review.user?.fullname?.charAt(0)?.toUpperCase() || "G"}
        </div>
        <div>
          <p style={{ color: "#fff", fontWeight: 600, fontSize: "14px", margin: 0 }}>
            {review.user?.fullname || "Guest"}
          </p>
          <p style={{ color: "#52525b", fontSize: "11px", margin: 0 }}>{fmtDate(review.createdAt)}</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "2px" }}>
        {[1,2,3,4,5].map(n => (
          <span key={n}>{IC.star(n <= review.rating)()}</span>
        ))}
      </div>
    </div>
    <p style={{ color: "#a1a1aa", fontSize: "13px", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
      "{review.comment || "Great experience!"}"
    </p>
  </div>
);

// ── Add Review Modal ──────────────────────────────────────────────────────────
const ReviewModal = ({ hotel, onClose, onSuccess }) => {
  const [rating, setRating]   = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!comment.trim()) { toast.error("Please write a review."); return; }
    setLoading(true);
    try {
      await createReview({ hotelId: hotel._id, rating, comment });
      toast.success("Review submitted!");
      onSuccess();
      onClose();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:"fixed",inset:0,zIndex:1001,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px" }}>
      <div style={{ background:"#111216",border:"1px solid #27272a",borderRadius:"24px",width:"100%",maxWidth:"480px",animation:"slideUp 0.3s ease" }}>
        {/* Header */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"22px 24px",borderBottom:"1px solid #27272a" }}>
          <div>
            <p style={{ fontSize:"10px",letterSpacing:"0.3em",color:"#d4af37",fontWeight:700,margin:"0 0 4px" }}>WRITE A REVIEW</p>
            <h3 style={{ fontFamily:"Georgia,serif",fontSize:"1.2rem",color:"#fff",margin:0 }}>{hotel.name}</h3>
          </div>
          <button onClick={onClose} style={{ background:"#1a1a1f",border:"1px solid #27272a",borderRadius:"10px",padding:"8px",cursor:"pointer",color:"#71717a",display:"flex" }}><IC.close /></button>
        </div>

        <div style={{ padding:"24px" }}>
          <label style={{ display:"block",color:"#71717a",fontSize:"12px",fontWeight:600,letterSpacing:"0.06em",marginBottom:"10px" }}>YOUR RATING</label>
          <StarInput value={rating} onChange={setRating} />

          <label style={{ display:"block",color:"#71717a",fontSize:"12px",fontWeight:600,letterSpacing:"0.06em",margin:"20px 0 8px" }}>YOUR REVIEW</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience about this hotel…"
            style={{ width:"100%",background:"#0b0c10",border:"1px solid #27272a",borderRadius:"12px",padding:"12px 14px",color:"#e4e4e7",fontSize:"14px",fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box",transition:"border-color 0.2s" }}
            onFocus={e => e.currentTarget.style.borderColor="#d4af3766"}
            onBlur={e => e.currentTarget.style.borderColor="#27272a"}
          />

          <div style={{ display:"flex",gap:"10px",marginTop:"20px" }}>
            <button onClick={onClose} style={{ flex:1,padding:"12px",background:"transparent",border:"1px solid #27272a",borderRadius:"12px",color:"#a1a1aa",fontWeight:600,fontSize:"14px",cursor:"pointer",fontFamily:"inherit" }}>Cancel</button>
            <button onClick={submit} disabled={loading} style={{ flex:2,padding:"12px",background:"linear-gradient(135deg,#d4af37,#f0c960)",border:"none",borderRadius:"12px",color:"#0b0c10",fontWeight:700,fontSize:"14px",cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 16px rgba(212,175,55,0.28)",opacity:loading?0.7:1 }}>
              {loading ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Booking Modal ─────────────────────────────────────────────────────────────
const BookingModal = ({ room, hotel, user, onClose }) => {
  const [checkIn,  setCheckIn]  = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests,   setGuests]   = useState(1);
  const [step,     setStep]     = useState("form");
  const [bookingId, setBookingId] = useState(null);
  const [errMsg,   setErrMsg]   = useState("");

  const n       = nights(checkIn, checkOut);
  const cost    = n * (room.pricePerNight || 0);
  const tax     = Math.round(cost * 0.12);
  const total   = cost + tax;
  const valid   = checkIn && checkOut && n > 0 && guests >= 1;

  const handlePay = useCallback(async () => {
    if (!valid) { toast.error("Please fill all details correctly."); return; }
    setStep("paying");
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay SDK failed to load.");

      let order;

      try {
        order = await createRazorpayOrder({
          amount: total,
          hotelId: hotel._id,
          roomId: room._id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guests,
        });
      } catch (error) {
        console.log("CREATE ORDER ERROR:", error);
        toast.error(error.response?.data?.message || "Razorpay order create failed");
        setStep("form");
        return;
      }

      const options = {
        key: order.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount, currency: order.currency || "INR",
        name: "BookMyStay", description: `${room.roomType} — ${hotel.name}`,
        order_id: order.orderId,
        prefill: { name: user?.fullname || "", email: user?.email || "", contact: user?.contact || "" },
        theme: { color: "#d4af37" },
        modal: { ondismiss: () => setStep("form") },
        handler: async (res) => {
          try {
            try { await verifyRazorpayPayment({ razorpay_order_id: res.razorpay_order_id, razorpay_payment_id: res.razorpay_payment_id, razorpay_signature: res.razorpay_signature }); } catch {}
            const bk = await createUserBooking({ hotelId: hotel._id, roomId: room._id, checkInDate: checkIn, checkOutDate: checkOut, guests, totalPrice: total, paymentId: res.razorpay_payment_id, orderId: res.razorpay_order_id });
            setBookingId(bk?.booking?._id || bk?._id || "BMS" + Date.now());
            setStep("success");
          } catch (e) { setErrMsg(e?.response?.data?.message || "Booking save failed."); setStep("error"); }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", r => { setErrMsg(r?.error?.description || "Payment failed."); setStep("error"); });
      rzp.open();
    } catch (e) { setErrMsg(e.message || "Something went wrong."); setStep("error"); }
  }, [checkIn, checkOut, guests, hotel, room, total, valid, user]);

  return (
    <div onClick={e => e.target===e.currentTarget && step==="form" && onClose()} style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",animation:"fadeIn 0.2s ease" }}>
      <div style={{ background:"#111216",border:"1px solid #27272a",borderRadius:"28px",width:"100%",maxWidth:"520px",maxHeight:"90vh",overflowY:"auto",animation:"slideUp 0.3s ease" }}>

        {/* FORM */}
        {step==="form" && (
          <>
            <div style={{ background:"linear-gradient(135deg,#16131d,#111216)",borderBottom:"1px solid #27272a",padding:"22px 26px",borderRadius:"28px 28px 0 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
              <div>
                <p style={{ fontSize:"10px",letterSpacing:"0.32em",color:"#d4af37",fontWeight:700,margin:"0 0 8px" }}>BOOK YOUR ROOM</p>
                <h2 style={{ fontFamily:"Georgia,serif",fontSize:"1.4rem",color:"#fff",margin:"0 0 6px" }}>{room.roomType}</h2>
                <div style={{ display:"flex",alignItems:"center",gap:"6px",color:"#71717a",fontSize:"13px" }}><IC.pin />{hotel.name} · {hotel.city}</div>
              </div>
              <button onClick={onClose} style={{ background:"#1a1a1f",border:"1px solid #27272a",borderRadius:"10px",padding:"8px",cursor:"pointer",color:"#71717a",display:"flex",transition:"all 0.2s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor="#d4af3766";e.currentTarget.style.color="#d4af37"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#27272a";e.currentTarget.style.color="#71717a"}}><IC.close /></button>
            </div>

            <div style={{ padding:"24px 26px" }}>
              {/* Dates */}
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"14px" }}>
                {[
                  { label:"CHECK IN", val:checkIn, min:todayStr(), onChange:e=>{ setCheckIn(e.target.value); if(checkOut&&e.target.value>=checkOut) setCheckOut(""); }, disabled:false },
                  { label:"CHECK OUT", val:checkOut, min:minCO(checkIn), onChange:e=>setCheckOut(e.target.value), disabled:!checkIn },
                ].map(({label,val,min,onChange,disabled}) => (
                  <div key={label}>
                    <label style={{ display:"flex",alignItems:"center",gap:"6px",color:"#71717a",fontSize:"11px",fontWeight:600,letterSpacing:"0.06em",marginBottom:"6px" }}><IC.cal />{label}</label>
                    <input type="date" value={val} min={min} disabled={disabled} onChange={onChange} style={{ width:"100%",background:"#0b0c10",border:"1px solid #27272a",borderRadius:"10px",padding:"11px 13px",color:"#e4e4e7",fontSize:"14px",fontFamily:"inherit",outline:"none",boxSizing:"border-box",opacity:disabled?0.4:1,cursor:disabled?"not-allowed":"auto" }} onFocus={e=>e.currentTarget.style.borderColor="#d4af3766"} onBlur={e=>e.currentTarget.style.borderColor="#27272a"} />
                  </div>
                ))}
              </div>

              {/* Guests */}
              <div style={{ marginBottom:"20px" }}>
                <label style={{ display:"flex",alignItems:"center",gap:"6px",color:"#71717a",fontSize:"11px",fontWeight:600,letterSpacing:"0.06em",marginBottom:"8px" }}><IC.user />GUESTS (Max {room.capacity||10})</label>
                <div style={{ display:"flex",alignItems:"center",gap:"12px" }}>
                  {[-1,null,1].map((d,i) => d===null
                    ? <span key="v" style={{ fontSize:"1.6rem",fontFamily:"Georgia,serif",color:"#d4af37",minWidth:"28px",textAlign:"center" }}>{guests}</span>
                    : <button key={i} onClick={()=>setGuests(g=>Math.min(room.capacity||10,Math.max(1,g+d)))} style={{ width:"38px",height:"38px",borderRadius:"10px",background:"#0b0c10",border:"1px solid #27272a",color:"#e4e4e7",fontSize:"20px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",fontFamily:"inherit" }} onMouseEnter={e=>e.currentTarget.style.borderColor="#d4af3766"} onMouseLeave={e=>e.currentTarget.style.borderColor="#27272a"}>{d>0?"+":"−"}</button>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              {n > 0 && (
                <div style={{ background:"#0b0c10",border:"1px solid #27272a",borderRadius:"14px",padding:"18px",marginBottom:"20px" }}>
                  <p style={{ fontSize:"10px",letterSpacing:"0.3em",color:"#52525b",fontWeight:600,margin:"0 0 12px" }}>PRICE BREAKDOWN</p>
                  {[
                    [`₹${fmt(room.pricePerNight)} × ${n} night${n>1?"s":""}`, `₹${fmt(cost)}`],
                    ["GST & taxes (12%)", `₹${fmt(tax)}`],
                  ].map(([l,v])=>(
                    <div key={l} style={{ display:"flex",justifyContent:"space-between",fontSize:"13px",marginBottom:"8px" }}>
                      <span style={{ color:"#71717a" }}>{l}</span><span style={{ color:"#e4e4e7" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ borderTop:"1px solid #27272a",marginTop:"10px",paddingTop:"12px",display:"flex",justifyContent:"space-between",alignItems:"baseline" }}>
                    <span style={{ color:"#fff",fontWeight:700,fontSize:"15px" }}>Total Amount</span>
                    <span style={{ fontFamily:"Georgia,serif",fontSize:"1.5rem",color:"#d4af37" }}>₹{fmt(total)}</span>
                  </div>
                </div>
              )}

              {/* Summary chips */}
              {n > 0 && (
                <div style={{ display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"20px" }}>
                  {[{icon:<IC.moon />,t:`${n} Night${n>1?"s":""}`},{icon:<IC.user />,t:`${guests} Guest${guests>1?"s":""}`},{icon:<IC.bed />,t:room.roomType}].map(({icon,t})=>(
                    <span key={t} style={{ display:"flex",alignItems:"center",gap:"5px",background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:"999px",padding:"5px 12px",color:"#d4af37",fontSize:"12px",fontWeight:600 }}>{icon}{t}</span>
                  ))}
                </div>
              )}

              {/* Pay Button */}
              <button onClick={handlePay} disabled={!valid} style={{ width:"100%",background:valid?"linear-gradient(135deg,#d4af37,#f0c960)":"#1a1a1f",color:valid?"#0b0c10":"#52525b",border:"none",borderRadius:"14px",padding:"15px",fontWeight:700,fontSize:"15px",cursor:valid?"pointer":"not-allowed",fontFamily:"inherit",boxShadow:valid?"0 6px 24px rgba(212,175,55,0.3)":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",transition:"opacity 0.2s" }} onMouseEnter={e=>valid&&(e.currentTarget.style.opacity="0.88")} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 2L9 7.5 12.5 9l-6 12.5 11-10-4-1.5L17.5 4z"/></svg>
                {valid ? `Pay ₹${fmt(total)} via Razorpay` : "Select dates to continue"}
              </button>
              <p style={{ textAlign:"center",color:"#52525b",fontSize:"12px",marginTop:"12px" }}>🔒 100% Secure · Powered by Razorpay</p>
            </div>
          </>
        )}

        {/* PAYING */}
        {step==="paying" && (
          <div style={{ padding:"60px 28px",textAlign:"center" }}>
            <div style={{ width:"52px",height:"52px",border:"3px solid #27272a",borderTop:"3px solid #d4af37",borderRadius:"50%",margin:"0 auto 20px",animation:"spin 0.8s linear infinite" }} />
            <h3 style={{ fontFamily:"Georgia,serif",fontSize:"1.4rem",color:"#fff",margin:"0 0 8px" }}>Opening Payment…</h3>
            <p style={{ color:"#52525b",fontSize:"14px" }}>Complete the payment in the Razorpay window.</p>
          </div>
        )}

        {/* SUCCESS */}
        {step==="success" && (
          <div style={{ padding:"44px 26px",textAlign:"center" }}>
            <div style={{ marginBottom:"16px" }}><IC.check /></div>
            <h3 style={{ fontFamily:"Georgia,serif",fontSize:"1.8rem",color:"#fff",margin:"0 0 8px" }}>Booking Confirmed! 🎉</h3>
            <p style={{ color:"#71717a",fontSize:"14px",lineHeight:1.6,marginBottom:"24px" }}>Your room at <strong style={{ color:"#fff" }}>{hotel.name}</strong> is booked.</p>
            <div style={{ background:"#0b0c10",border:"1px solid rgba(34,197,94,0.2)",borderRadius:"14px",padding:"18px",textAlign:"left",marginBottom:"24px" }}>
              {[["Booking ID",bookingId||"—"],["Room",room.roomType],["Hotel",hotel.name],["Check In",fmtDate(checkIn)],["Check Out",fmtDate(checkOut)],["Guests",guests],["Paid",`₹${fmt(total)}`]].map(([l,v])=>(
                <div key={l} style={{ display:"flex",justifyContent:"space-between",marginBottom:"8px",fontSize:"13px" }}>
                  <span style={{ color:"#52525b" }}>{l}</span>
                  <span style={{ color:l==="Paid"?"#d4af37":"#e4e4e7",fontWeight:l==="Paid"?700:500,fontFamily:l==="Booking ID"?"monospace":"inherit",fontSize:l==="Booking ID"?"11px":"inherit" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",gap:"10px" }}>
              <button onClick={onClose} style={{ flex:1,padding:"12px",background:"transparent",border:"1px solid #27272a",borderRadius:"12px",color:"#a1a1aa",fontWeight:600,fontSize:"14px",cursor:"pointer",fontFamily:"inherit" }}>Close</button>
              <button onClick={()=>window.location.href="/my-bookings"} style={{ flex:1,padding:"12px",background:"linear-gradient(135deg,#d4af37,#f0c960)",border:"none",borderRadius:"12px",color:"#0b0c10",fontWeight:700,fontSize:"14px",cursor:"pointer",fontFamily:"inherit" }}>View My Bookings</button>
            </div>
          </div>
        )}

        {/* ERROR */}
        {step==="error" && (
          <div style={{ padding:"48px 26px",textAlign:"center" }}>
            <div style={{ fontSize:"3.5rem",marginBottom:"16px" }}>⚠️</div>
            <h3 style={{ fontFamily:"Georgia,serif",fontSize:"1.5rem",color:"#fff",margin:"0 0 10px" }}>Something went wrong</h3>
            <p style={{ color:"#71717a",fontSize:"13px",lineHeight:1.6,marginBottom:"24px",maxWidth:"300px",margin:"0 auto 24px" }}>{errMsg||"Payment failed. Please try again."}</p>
            <div style={{ display:"flex",gap:"10px",justifyContent:"center" }}>
              <button onClick={onClose} style={{ padding:"11px 22px",background:"transparent",border:"1px solid #27272a",borderRadius:"12px",color:"#a1a1aa",fontWeight:600,fontSize:"14px",cursor:"pointer",fontFamily:"inherit" }}>Cancel</button>
              <button onClick={()=>{setStep("form");setErrMsg("");}} style={{ padding:"11px 26px",background:"linear-gradient(135deg,#d4af37,#f0c960)",border:"none",borderRadius:"12px",color:"#0b0c10",fontWeight:700,fontSize:"14px",cursor:"pointer",fontFamily:"inherit" }}>Try Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Amenity Chip ──────────────────────────────────────────────────────────────
const AMENITIES = [
  { icon: <IC.wifi />, label: "Free WiFi" },
  { icon: <IC.pool />, label: "Swimming Pool" },
  { icon: <IC.ac />,   label: "Air Conditioning" },
  { icon: <IC.park />, label: "Free Parking" },
  { icon: <IC.gym />,  label: "Fitness Center" },
  { icon: <IC.food />, label: "Restaurant" },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
const HotelDetails = () => {
  const { id } = useParams();
  const user   = useSelector(s => s.auth?.user);

  const [hotel,   setHotel]   = useState(null);
  const [rooms,   setRooms]   = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selRoom, setSelRoom] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("rooms"); // rooms | reviews | amenities

  const loadData = useCallback(async () => {
    try {
      const data = await getUserHotelById(id);
      setHotel(data.hotel);
      setRooms(data.rooms || []);
      setReviews(data.reviews || data.hotel?.reviews || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load hotel details.");
    }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  if (!hotel) return (
    <div style={{ minHeight:"100vh",background:"#0b0c10",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:"48px",height:"48px",border:"3px solid #27272a",borderTop:"3px solid #d4af37",borderRadius:"50%",margin:"0 auto 16px",animation:"spin 0.8s linear infinite" }} />
        <p style={{ color:"#52525b",fontSize:"14px" }}>Loading hotel details…</p>
      </div>
    </div>
  );

  const images = hotel.images?.length ? hotel.images : [{ url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop" }];
  const rating = avgRating(reviews);

  return (
    <div style={{ minHeight:"100vh",background:"#0b0c10",color:"#fff",fontFamily:"Inter,system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        * { box-sizing:border-box; }
        textarea { resize:vertical; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(0.5); cursor:pointer }
        input[type="date"] { color-scheme:dark }
        ::-webkit-scrollbar { width:6px }
        ::-webkit-scrollbar-track { background:#0b0c10 }
        ::-webkit-scrollbar-thumb { background:#27272a; border-radius:3px }
      `}</style>

      <Toaster position="top-right" toastOptions={{ style:{ background:"#111216",color:"#fff",border:"1px solid #27272a" } }} />

      {selRoom && <BookingModal room={selRoom} hotel={hotel} user={user} onClose={() => setSelRoom(null)} />}
      {showReviewModal && <ReviewModal hotel={hotel} onClose={() => setShowReviewModal(false)} onSuccess={loadData} />}

      <UserNavbar />

      <div style={{ maxWidth:"1280px",margin:"0 auto",padding:"36px 24px 80px" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <div style={{ borderRadius:"28px",border:"1px solid #27272a",background:"#111216",overflow:"hidden",marginBottom:"32px",animation:"fadeUp 0.5s ease both" }}>

          {/* Main image */}
          <div style={{ position:"relative",height:"clamp(280px,42vw,480px)",overflow:"hidden" }}>
            <img
              src={images[activeImg]?.url}
              alt={hotel.name}
              style={{ width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.6s ease" }}
            />
            <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(11,12,16,0.8) 0%,transparent 55%)" }} />

            {/* Hotel info overlay */}
            <div style={{ position:"absolute",bottom:"24px",left:"28px",right:"28px",display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:"12px" }}>
              <div>
                <p style={{ fontSize:"10px",letterSpacing:"0.35em",color:"#d4af37",fontWeight:700,margin:"0 0 8px" }}>✦ HOTEL DETAILS</p>
                <h1 style={{ fontFamily:"Georgia,serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",color:"#fff",margin:"0 0 6px",textShadow:"0 2px 20px rgba(0,0,0,0.5)",lineHeight:1.2 }}>{hotel.name}</h1>
                <div style={{ display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap" }}>
                  <span style={{ display:"flex",alignItems:"center",gap:"5px",color:"#d4af37",fontSize:"14px" }}><IC.pin />{hotel.city}{hotel.location?` · ${hotel.location}`:""}</span>
                  {rating && (
                    <span style={{ display:"flex",alignItems:"center",gap:"4px",background:"rgba(212,175,55,0.15)",border:"1px solid rgba(212,175,55,0.3)",borderRadius:"999px",padding:"3px 10px",fontSize:"12px",color:"#d4af37",fontWeight:700 }}>
                      ★ {rating} <span style={{ color:"#71717a",fontWeight:400 }}>({reviews.length} reviews)</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Image thumbnails */}
            {images.length > 1 && (
              <div style={{ position:"absolute",bottom:"16px",right:"16px",display:"flex",gap:"6px" }}>
                {images.slice(0,5).map((img,i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{ width:"48px",height:"36px",borderRadius:"8px",overflow:"hidden",border:`2px solid ${i===activeImg?"#d4af37":"transparent"}`,padding:0,cursor:"pointer",background:"none",transition:"border-color 0.2s" }}>
                    <img src={img.url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hotel info row */}
          <div style={{ padding:"24px 28px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"16px",borderBottom:"1px solid #27272a" }}>
            <p style={{ color:"#71717a",lineHeight:1.75,fontSize:"14px",maxWidth:"680px",margin:0 }}>
              {hotel.description || "Experience luxury and comfort at its finest."}
            </p>

            {/* Quick stats */}
            <div style={{ display:"flex",gap:"20px",flexShrink:0,flexWrap:"wrap" }}>
              {[
                { label:"Rooms",   value:rooms.length },
                { label:"Reviews", value:reviews.length },
                { label:"Rating",  value:rating ? `${rating}★` : "—" },
              ].map(({label,value}) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <p style={{ fontFamily:"Georgia,serif",fontSize:"1.5rem",color:"#d4af37",margin:"0 0 2px",lineHeight:1 }}>{value}</p>
                  <p style={{ color:"#52525b",fontSize:"11px",margin:0 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex",gap:0,padding:"0 28px" }}>
            {[["rooms","🛏 Rooms"],["amenities","✨ Amenities"],["reviews","⭐ Reviews"]].map(([tab,label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding:"16px 20px",background:"none",border:"none",borderBottom:`2px solid ${activeTab===tab?"#d4af37":"transparent"}`,
                color:activeTab===tab?"#d4af37":"#52525b",fontSize:"14px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ══ ROOMS TAB ═══════════════════════════════════════════════ */}
        {activeTab==="rooms" && (
          <>
            <div style={{ marginBottom:"24px" }}>
              <p style={{ fontSize:"10px",letterSpacing:"0.35em",color:"#d4af37",fontWeight:700,margin:"0 0 8px" }}>✦ AVAILABLE ROOMS</p>
              <h2 style={{ fontFamily:"Georgia,serif",fontSize:"clamp(1.6rem,3vw,2.4rem)",color:"#fff",margin:0 }}>Choose Your Room</h2>
            </div>

            {rooms.length === 0 ? (
              <div style={{ background:"#111216",border:"1px solid #27272a",borderRadius:"20px",padding:"48px",textAlign:"center",color:"#52525b" }}>No rooms available at the moment.</div>
            ) : (
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"20px" }}>
                {rooms.map((room, i) => {
                  const avail = room.availableRooms ?? 1;
                  return (
                    <div key={room._id} style={{
                      background:"#111216",border:"1px solid #27272a",borderRadius:"24px",overflow:"hidden",
                      animation:`fadeUp 0.5s ${0.15+i*0.07}s ease both`,
                      transition:"border-color 0.3s,box-shadow 0.3s,transform 0.3s",
                      display:"flex",flexDirection:"column",
                    }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="#d4af3755";e.currentTarget.style.boxShadow="0 8px 32px rgba(212,175,55,0.08)";e.currentTarget.style.transform="translateY(-4px)"}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="#27272a";e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="translateY(0)"}}
                    >
                      {/* Room image placeholder */}
                      <div style={{ height:"160px",overflow:"hidden",position:"relative" }}>
                        <img src={room.images?.[0]?.url||"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop"} alt={room.roomType} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.5s" }}
                          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
                          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                        />
                        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(11,12,16,0.6),transparent)" }} />
                        {avail===0 && (
                          <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                            <span style={{ background:"rgba(239,68,68,0.9)",color:"#fff",borderRadius:"999px",padding:"6px 18px",fontSize:"13px",fontWeight:700 }}>Sold Out</span>
                          </div>
                        )}
                        {avail > 0 && avail <= 3 && (
                          <div style={{ position:"absolute",top:"10px",right:"10px",background:"rgba(245,158,11,0.9)",color:"#0b0c10",borderRadius:"999px",padding:"4px 12px",fontSize:"11px",fontWeight:700 }}>
                            Only {avail} left!
                          </div>
                        )}
                      </div>

                      <div style={{ padding:"22px 22px 24px",display:"flex",flexDirection:"column",flex:1 }}>
                        <p style={{ fontSize:"9px",letterSpacing:"0.32em",color:"#52525b",fontWeight:700,margin:"0 0 8px" }}>ROOM TYPE</p>
                        <h3 style={{ fontFamily:"Georgia,serif",fontSize:"1.4rem",color:"#fff",margin:"0 0 14px",lineHeight:1.2 }}>{room.roomType}</h3>

                        {/* Feature chips */}
                        <div style={{ display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"18px" }}>
                          {[
                            {t:`${room.capacity||2} Guests`},
                            {t:`${avail} Avail.`},
                            ...(room.amenities||[]).slice(0,2).map(a=>({t:a})),
                          ].map(({t}) => (
                            <span key={t} style={{ background:"#0b0c10",border:"1px solid #27272a",borderRadius:"999px",padding:"4px 11px",color:"#71717a",fontSize:"11px",fontWeight:600 }}>{t}</span>
                          ))}
                        </div>

                        {/* Price */}
                        <div style={{ marginTop:"auto" }}>
                          <p style={{ color:"#52525b",fontSize:"11px",margin:"0 0 2px" }}>Starting from</p>
                          <p style={{ fontFamily:"Georgia,serif",fontSize:"2rem",color:"#d4af37",margin:"0 0 16px",lineHeight:1 }}>
                            ₹{fmt(room.pricePerNight)}<span style={{ fontSize:"13px",color:"#52525b",fontFamily:"inherit" }}> /night</span>
                          </p>

                          <button
                            onClick={() => { if(avail===0){toast.error("Room is fully booked.");return;} setSelRoom(room); }}
                            disabled={avail===0}
                            style={{ width:"100%",background:avail===0?"#1a1a1f":"linear-gradient(135deg,#d4af37,#f0c960)",color:avail===0?"#52525b":"#0b0c10",border:"none",borderRadius:"12px",padding:"13px",fontWeight:700,fontSize:"14px",cursor:avail===0?"not-allowed":"pointer",fontFamily:"inherit",boxShadow:avail!==0?"0 4px 20px rgba(212,175,55,0.28)":"none",transition:"opacity 0.2s" }}
                            onMouseEnter={e=>avail!==0&&(e.currentTarget.style.opacity="0.88")}
                            onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                          >
                            {avail===0 ? "Fully Booked" : "Book Now"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ══ AMENITIES TAB ═══════════════════════════════════════════ */}
        {activeTab==="amenities" && (
          <div style={{ animation:"fadeUp 0.4s ease both" }}>
            <div style={{ marginBottom:"24px" }}>
              <p style={{ fontSize:"10px",letterSpacing:"0.35em",color:"#d4af37",fontWeight:700,margin:"0 0 8px" }}>✦ HOTEL AMENITIES</p>
              <h2 style={{ fontFamily:"Georgia,serif",fontSize:"clamp(1.6rem,3vw,2.4rem)",color:"#fff",margin:0 }}>What's Included</h2>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"14px" }}>
              {AMENITIES.map(({icon,label}) => (
                <div key={label} style={{ background:"#111216",border:"1px solid #27272a",borderRadius:"16px",padding:"20px 22px",display:"flex",alignItems:"center",gap:"14px",transition:"border-color 0.2s,transform 0.2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#d4af3744";e.currentTarget.style.transform="translateY(-3px)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#27272a";e.currentTarget.style.transform="translateY(0)"}}>
                  <div style={{ color:"#d4af37",flexShrink:0 }}>{icon}</div>
                  <span style={{ color:"#e4e4e7",fontSize:"14px",fontWeight:500 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ REVIEWS TAB ═════════════════════════════════════════════ */}
        {activeTab==="reviews" && (
          <div style={{ animation:"fadeUp 0.4s ease both" }}>
            {/* Header */}
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"28px",flexWrap:"wrap",gap:"16px" }}>
              <div>
                <p style={{ fontSize:"10px",letterSpacing:"0.35em",color:"#d4af37",fontWeight:700,margin:"0 0 8px" }}>✦ GUEST REVIEWS</p>
                <h2 style={{ fontFamily:"Georgia,serif",fontSize:"clamp(1.6rem,3vw,2.4rem)",color:"#fff",margin:0 }}>
                  {reviews.length ? `${reviews.length} Review${reviews.length>1?"s":""}` : "No Reviews Yet"}
                </h2>
              </div>

              {/* Rating summary */}
              {rating && (
                <div style={{ background:"#111216",border:"1px solid #27272a",borderRadius:"16px",padding:"16px 24px",textAlign:"center" }}>
                  <p style={{ fontFamily:"Georgia,serif",fontSize:"2.5rem",color:"#d4af37",margin:"0 0 4px",lineHeight:1 }}>{rating}</p>
                  <div style={{ display:"flex",justifyContent:"center",gap:"2px",marginBottom:"4px" }}>
                    {[1,2,3,4,5].map(n=><span key={n}>{IC.star(n<=Math.round(Number(rating)))()}</span>)}
                  </div>
                  <p style={{ color:"#52525b",fontSize:"11px",margin:0 }}>{reviews.length} reviews</p>
                </div>
              )}
            </div>

            {/* Write review btn */}
            <div style={{ marginBottom:"24px" }}>
              <button onClick={() => { if(!user){toast.error("Please login to write a review.");return;} setShowReviewModal(true); }} style={{ display:"flex",alignItems:"center",gap:"8px",background:"transparent",border:"1px solid #27272a",borderRadius:"12px",padding:"10px 20px",color:"#a1a1aa",fontWeight:600,fontSize:"13px",cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor="#d4af3766";e.currentTarget.style.color="#d4af37"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#27272a";e.currentTarget.style.color="#a1a1aa"}}>
                <IC.edit /> Write a Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <div style={{ background:"#111216",border:"1px solid #27272a",borderRadius:"20px",padding:"48px",textAlign:"center" }}>
                <div style={{ fontSize:"2.5rem",marginBottom:"12px" }}>💬</div>
                <h3 style={{ fontFamily:"Georgia,serif",fontSize:"1.4rem",color:"#fff",margin:"0 0 8px" }}>Be the First to Review</h3>
                <p style={{ color:"#52525b",fontSize:"13px",margin:0 }}>Share your experience with other travelers.</p>
              </div>
            ) : (
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"16px" }}>
                {reviews.map((r,i) => <ReviewCard key={r._id||i} review={r} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetails;
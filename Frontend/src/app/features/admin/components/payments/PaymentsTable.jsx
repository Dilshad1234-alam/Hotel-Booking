import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiDollarSign,
  FiCreditCard,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiCalendar,
  FiUser,
  FiFilter,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

import { useAdmin } from "../../hooks/useAdmin";

const PaymentsTable = () => {
  const { handleGetPayments } = useAdmin();

  const { payments, loading } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    handleGetPayments();
  }, [handleGetPayments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch = `
        ${payment.user?.fullname || ""}
        ${payment.user?.email || ""}
        ${payment.transactionId || ""}
        ${payment.method || ""}
      `
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        payment.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchesMethod =
        methodFilter === "all" ||
        payment.method?.toLowerCase() === methodFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, search, statusFilter, methodFilter]);

  const stats = useMemo(() => {
    return {
      revenue: payments
        .filter((p) => p.status === "success")
        .reduce((sum, p) => sum + (p.amount || 0), 0),
      success: payments.filter((p) => p.status === "success").length,
      failed: payments.filter((p) => p.status === "failed").length,
      refunded: payments.filter((p) => p.status === "refunded").length,
    };
  }, [payments]);

  const uniqueMethods = useMemo(() => {
    const methods = new Set(payments.map((p) => p.method).filter(Boolean));
    return Array.from(methods);
  }, [payments]);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Transaction ID copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-400">
        <div className="w-10 h-10 border-2 border-zinc-800 border-t-[#d4af37] rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-wide">Fetching payment ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-[fadeUp_0.5s_ease_both]">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#111216", color: "#fff", border: "1px solid #27272a" },
        }}
      />

      {/* Header section with refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif text-[#d4af37]">Financial Overview</h2>
          <p className="text-zinc-400 text-xs mt-1">Monitor real-time system revenue, transaction success rate, and logs.</p>
        </div>
        <button
          onClick={() => handleGetPayments()}
          className="flex items-center gap-2 bg-[#111216] border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#d4af37]/40 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer"
        >
          <FiRefreshCw className="animate-hover-spin" /> Refresh Ledger
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<FiDollarSign />}
          title="Total Revenue"
          value={`₹${stats.revenue.toLocaleString("en-IN")}`}
          description="Successful transactions value"
          color="from-amber-500/20 to-yellow-500/5 border-[#d4af37]/20"
        />
        <StatCard
          icon={<FiCheckCircle />}
          title="Successful"
          value={stats.success}
          description="Settled transactions count"
          color="from-emerald-500/20 to-green-500/5 border-emerald-500/20"
        />
        <StatCard
          icon={<FiXCircle />}
          title="Failed"
          value={stats.failed}
          description="Declined or timed out attempts"
          color="from-rose-500/20 to-red-500/5 border-rose-500/20"
        />
        <StatCard
          icon={<FiRefreshCw />}
          title="Refunded"
          value={stats.refunded}
          description="Returned to source account"
          color="from-blue-500/20 to-indigo-500/5 border-blue-500/20"
        />
      </div>

      {/* Filters Panel */}
      <div className="bg-[#111216] border border-zinc-800 p-5 rounded-3xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, email, txid, method..."
              className="w-full bg-[#0b0c10] border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 outline-none text-sm text-white focus:border-[#d4af37] transition"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            
            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-[#0b0c10] border border-zinc-800 rounded-2xl px-3 py-2">
              <FiFilter className="text-zinc-500 text-xs" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-0 outline-none text-xs text-white cursor-pointer pr-4"
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Method Filter */}
            <div className="flex items-center gap-2 bg-[#0b0c10] border border-zinc-800 rounded-2xl px-3 py-2">
              <FiCreditCard className="text-zinc-500 text-xs" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Method:</span>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="bg-transparent border-0 outline-none text-xs text-white cursor-pointer pr-4"
              >
                <option value="all">All Methods</option>
                {uniqueMethods.map((m) => (
                  <option key={m} value={m.toLowerCase()}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredPayments.length === 0 ? (
        <div className="bg-[#111216] border border-zinc-800 rounded-3xl p-16 text-center text-zinc-500">
          <div className="text-4xl mb-4">💳</div>
          <h3 className="text-white text-lg font-bold">No Payments Found</h3>
          <p className="text-sm mt-1 max-w-md mx-auto">
            We couldn't find any transaction matches in the system logs. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          {/* Table for Desktop */}
          <div className="hidden lg:block bg-[#111216] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-[#0d0e11] text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Transaction ID</th>
                    <th className="py-4 px-6">Method</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Date & Time</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-sm text-zinc-300">
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-[#15161c]/40 transition duration-150">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-zinc-800/50 flex items-center justify-center text-[#d4af37] font-bold text-sm">
                            {payment.user?.fullname ? payment.user.fullname.charAt(0).toUpperCase() : <FiUser />}
                          </div>
                          <div>
                            <div className="font-semibold text-white truncate max-w-[180px]">
                              {payment.user?.fullname || "Guest User"}
                            </div>
                            <div className="text-xs text-zinc-500 truncate max-w-[180px]">
                              {payment.user?.email || "-"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs">
                        {payment.transactionId ? (
                          <div className="flex items-center gap-2 group">
                            <span className="text-zinc-400 select-all">{payment.transactionId}</span>
                            <button
                              onClick={() => handleCopy(payment.transactionId)}
                              className="text-zinc-500 hover:text-[#d4af37] transition cursor-pointer p-1 rounded hover:bg-zinc-800"
                              title="Copy transaction ID"
                            >
                              {copiedId === payment.transactionId ? <FiCheck className="text-emerald-400" /> : <FiCopy size={12} />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-zinc-600">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-[#0b0c10] border border-zinc-800 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 uppercase tracking-wide">
                          {payment.method || "Other"}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-white text-base">
                        ₹{(payment.amount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-6 text-zinc-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <FiCalendar className="text-[#d4af37]" />
                          {new Date(payment.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={payment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards for Mobile & Tablet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:hidden">
            {filteredPayments.map((payment) => (
              <div
                key={payment._id}
                className="bg-[#111216] border border-zinc-800 rounded-3xl p-5 hover:border-[#d4af37]/30 transition duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top user / status header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-zinc-800/50 flex items-center justify-center text-[#d4af37] font-bold text-sm">
                        {payment.user?.fullname ? payment.user.fullname.charAt(0).toUpperCase() : <FiUser />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm truncate max-w-[150px]">
                          {payment.user?.fullname || "Guest User"}
                        </h4>
                        <p className="text-zinc-500 text-xs truncate max-w-[150px]">
                          {payment.user?.email || "-"}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={payment.status} />
                  </div>

                  {/* Payment Details */}
                  <div className="grid grid-cols-2 gap-3 bg-[#0b0c10] border border-zinc-800/50 p-3.5 rounded-2xl">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Amount</span>
                      <p className="text-white font-bold text-sm mt-0.5">
                        ₹{(payment.amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Method</span>
                      <p className="text-zinc-300 font-semibold text-xs mt-1 uppercase tracking-wide">
                        {payment.method || "Other"}
                      </p>
                    </div>
                  </div>

                  {/* Transaction ID */}
                  {payment.transactionId && (
                    <div className="flex justify-between items-center text-xs font-mono bg-zinc-900/35 border border-zinc-800/40 p-2.5 rounded-xl">
                      <span className="text-zinc-400 truncate max-w-[180px]">{payment.transactionId}</span>
                      <button
                        onClick={() => handleCopy(payment.transactionId)}
                        className="text-zinc-500 hover:text-[#d4af37] p-1 cursor-pointer transition"
                      >
                        {copiedId === payment.transactionId ? <FiCheck className="text-emerald-400" /> : <FiCopy size={12} />}
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-850 mt-4 pt-3 flex justify-between items-center text-zinc-500 text-[11px]">
                  <span>
                    {new Date(payment.createdAt).toLocaleString("en-IN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, description, color }) => (
  <div className={`bg-gradient-to-br ${color} border rounded-3xl p-6 relative overflow-hidden group shadow-lg`}>
    <div className="absolute right-4 top-4 w-12 h-12 bg-zinc-900/45 rounded-2xl flex items-center justify-center text-[#d4af37] text-xl border border-zinc-800">
      {icon}
    </div>
    <div>
      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl text-white font-extrabold mt-2 tracking-tight">{value}</h3>
      <p className="text-[11px] text-zinc-500 mt-2 font-medium">{description}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase();
  if (normalized === "success") {
    return (
      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
        Success
      </span>
    );
  }
  if (normalized === "failed") {
    return (
      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
        Failed
      </span>
    );
  }
  return (
    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
      {status || "Pending"}
    </span>
  );
};

export default PaymentsTable;
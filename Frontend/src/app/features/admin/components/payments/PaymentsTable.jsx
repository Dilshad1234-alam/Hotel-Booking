import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiDollarSign,
  FiCreditCard,
  FiTrash2,
  FiCopy,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";

import { useAdmin } from "../../hooks/useAdmin";

const PaymentsTable = () => {
  const { handleGetPayments } = useAdmin();

  const { payments, loading } = useSelector(
    (state) => state.admin
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    handleGetPayments();
  }, [handleGetPayments]);

  const filteredPayments = payments.filter((payment) =>
    `
      ${payment.user?.fullname || ""}
      ${payment.transactionId || ""}
      ${payment.method || ""}
      ${payment.status || ""}
    `
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const stats = useMemo(() => {
    return {
      revenue: payments.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      ),

      success: payments.filter(
        (p) => p.status === "success"
      ).length,

      failed: payments.filter(
        (p) => p.status === "failed"
      ).length,

      refunded: payments.filter(
        (p) => p.status === "refunded"
      ).length,
    };
  }, [payments]);

  if (loading) {
    return (
      <p className="text-zinc-400">
        Loading payments...
      </p>
    );
  }

  return (
    <div className="space-y-8">

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-5">

        <StatCard
          icon={<FiDollarSign />}
          title="Revenue"
          value={`₹${stats.revenue}`}
        />

        <StatCard
          icon={<FiCheckCircle />}
          title="Successful"
          value={stats.success}
        />

        <StatCard
          icon={<FiXCircle />}
          title="Failed"
          value={stats.failed}
        />

        <StatCard
          icon={<FiRefreshCw />}
          title="Refunded"
          value={stats.refunded}
        />

      </div>

      {/* Search */}
      <div className="relative w-full md:w-96">
        <FiSearch
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-zinc-500
          "
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search payments..."
          className="
            w-full
            bg-[#18181b]
            border
            border-[#27272a]
            rounded-2xl
            pl-11
            pr-4
            py-3
            outline-none
            focus:border-[#d4af37]
          "
        />
      </div>

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <div
          className="
            bg-[#18181b]
            border
            border-dashed
            border-[#27272a]
            rounded-3xl
            p-16
            text-center
          "
        >
          <h2 className="text-2xl text-white">
            No Payments Found
          </h2>

          <p className="text-zinc-500 mt-3">
            Payment records will appear here.
          </p>
        </div>
      )}

      {/* Payment Cards */}
      <div className="grid gap-6">

        {filteredPayments.map((payment) => (
          <div
            key={payment._id}
            className="
              bg-[#18181b]
              border
              border-[#27272a]
              rounded-3xl
              p-6
              hover:border-[#d4af37]/40
              transition
            "
          >
            <div className="flex justify-between">

              <div>
                <h2 className="text-xl text-white font-semibold">
                  {payment.user?.fullname ||
                    "Unknown User"}
                </h2>

                <p className="text-zinc-500 text-sm mt-1">
                  {payment.user?.email}
                </p>
              </div>

              <span
                className={`
                  px-4 py-2 rounded-full text-sm
                  ${
                    payment.status === "success"
                      ? "bg-green-500/10 text-green-400"
                      : payment.status === "failed"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-blue-500/10 text-blue-400"
                  }
                `}
              >
                {payment.status}
              </span>

            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">

              <InfoCard
                icon={<FiDollarSign />}
                title="Amount"
                value={`₹${payment.amount}`}
              />

              <InfoCard
                icon={<FiCreditCard />}
                title="Method"
                value={payment.method}
              />

              <InfoCard
                icon={<FiCopy />}
                title="Transaction ID"
                value={
                  payment.transactionId ||
                  "N/A"
                }
              />

            </div>

            <div
              className="
                flex
                justify-between
                items-center
                mt-6
                pt-4
                border-t
                border-[#27272a]
              "
            >
              <span className="text-zinc-500 text-sm">
                {new Date(
                  payment.createdAt
                ).toLocaleString()}
              </span>

              <button
                className="
                  w-10 h-10
                  rounded-xl
                  bg-red-500/10
                  border
                  border-red-500/20
                  text-red-400
                  hover:bg-red-500/20
                "
              >
                <FiTrash2 />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
}) => (
  <div
    className="
      bg-[#18181b]
      border
      border-[#27272a]
      rounded-3xl
      p-6
    "
  >
    <div className="text-[#d4af37] text-2xl">
      {icon}
    </div>

    <p className="text-zinc-500 mt-4">
      {title}
    </p>

    <h2 className="text-3xl text-white font-bold mt-2">
      {value}
    </h2>
  </div>
);

const InfoCard = ({
  icon,
  title,
  value,
}) => (
  <div
    className="
      bg-[#0f0f0f]
      border
      border-[#27272a]
      rounded-2xl
      p-4
    "
  >
    <div className="text-[#d4af37] mb-3">
      {icon}
    </div>

    <p className="text-zinc-500 text-xs">
      {title}
    </p>

    <h3 className="text-white mt-2 break-all">
      {value}
    </h3>
  </div>
);

export default PaymentsTable;







// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import {
//   FiSearch,
//   FiDollarSign,
//   FiCreditCard,
//   FiTrash2,
//   FiHash,
// } from "react-icons/fi";

// import { useAdmin } from "../../hooks/useAdmin";

// const PaymentsTable = () => {
//   const { handleGetPayments } = useAdmin();

//   const { payments, loading } = useSelector(
//     (state) => state.admin
//   );

//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     handleGetPayments();
//   }, [handleGetPayments]);

//   const filteredPayments = payments.filter((payment) =>
//     `
//       ${payment.user?.fullname || ""}
//       ${payment.transactionId || ""}
//       ${payment.method || ""}
//       ${payment.status || ""}
//     `
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <p className="text-zinc-400">
//         Loading payments...
//       </p>
//     );
//   }

//   return (
//     <div className="space-y-6">

//       {/* Search */}
//       <div className="relative w-full md:w-96">
//         <FiSearch
//           className="
//             absolute
//             left-4
//             top-1/2
//             -translate-y-1/2
//             text-zinc-500
//           "
//         />

//         <input
//           value={search}
//           onChange={(e) =>
//             setSearch(e.target.value)
//           }
//           placeholder="Search payments..."
//           className="
//             w-full
//             bg-[#18181b]
//             border
//             border-[#27272a]
//             rounded-2xl
//             pl-11
//             pr-4
//             py-3
//             outline-none
//             focus:border-[#d4af37]
//           "
//         />
//       </div>

//       {/* Cards */}
//       <div className="grid gap-6">

//         {filteredPayments.map((payment) => (
//           <div
//             key={payment._id}
//             className="
//               bg-[#18181b]
//               border
//               border-[#27272a]
//               rounded-3xl
//               p-6
//             "
//           >
//             <div className="flex justify-between">

//               <div>
//                 <h2 className="text-xl text-white font-serif">
//                   {payment.user?.fullname || "Unknown User"}
//                 </h2>

//                 <p className="text-zinc-400 mt-1">
//                   Booking:
//                   {" "}
//                   {payment.booking?.slice?.(0, 8) ||
//                     payment.booking}
//                 </p>
//               </div>

//               <span
//                 className={`
//                   px-4 py-1 rounded-full text-sm
//                   ${
//                     payment.status === "success"
//                       ? "bg-green-500/10 text-green-400"
//                       : payment.status === "failed"
//                       ? "bg-red-500/10 text-red-400"
//                       : "bg-blue-500/10 text-blue-400"
//                   }
//                 `}
//               >
//                 {payment.status}
//               </span>

//             </div>

//             <div
//               className="
//                 grid
//                 md:grid-cols-3
//                 gap-4
//                 mt-6
//               "
//             >
//               <Info
//                 icon={<FiDollarSign />}
//                 label="Amount"
//                 value={`₹${payment.amount}`}
//               />

//               <Info
//                 icon={<FiCreditCard />}
//                 label="Method"
//                 value={payment.method}
//               />

//               <Info
//                 icon={<FiHash />}
//                 label="Transaction"
//                 value={
//                   payment.transactionId ||
//                   "N/A"
//                 }
//               />
//             </div>

//             <div
//               className="
//                 border-t
//                 border-[#27272a]
//                 mt-6
//                 pt-4
//                 flex
//                 justify-between
//                 items-center
//               "
//             >
//               <span className="text-zinc-500 text-sm">
//                 {new Date(
//                   payment.createdAt
//                 ).toLocaleDateString()}
//               </span>

//               <button
//                 className="
//                   w-10 h-10
//                   rounded-xl
//                   bg-red-500/10
//                   text-red-400
//                   border
//                   border-red-500/20
//                 "
//               >
//                 <FiTrash2 />
//               </button>
//             </div>

//           </div>
//         ))}

//       </div>
//     </div>
//   );
// };

// const Info = ({
//   icon,
//   label,
//   value,
// }) => (
//   <div
//     className="
//       bg-[#0f0f0f]
//       border
//       border-[#27272a]
//       rounded-2xl
//       p-4
//     "
//   >
//     <div className="text-[#d4af37] mb-2">
//       {icon}
//     </div>

//     <p className="text-zinc-500 text-xs">
//       {label}
//     </p>

//     <h4 className="text-white font-semibold mt-1 break-all">
//       {value}
//     </h4>
//   </div>
// );

// export default PaymentsTable;
// // app/admin/commissions/page.js
// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function CommissionsPage() {
//   const [transactions, setTransactions] = useState([]);
//   const [totalCommission, setTotalCommission] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   const fetchTransactions = async () => {
//     const { data, error } = await supabase
//       .from("platform_transactions")
//       .select(`
//         *,
//         businesses (business_name, slug)
//       `)
//       .order("created_at", { ascending: false });

//     if (data) {
//       setTransactions(data);
//       const total = data.reduce((sum, t) => sum + (t.commission_amount || 0), 0);
//       setTotalCommission(total);
//     }
//     setLoading(false);
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8">💰 Commission Dashboard</h1>

//         {/* Stats */}
//         <div className="grid grid-cols-3 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-xl shadow">
//             <p className="text-gray-500">Total Commission Earned</p>
//             <p className="text-3xl font-bold text-green-600">₹{totalCommission.toFixed(2)}</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow">
//             <p className="text-gray-500">Total Transactions</p>
//             <p className="text-3xl font-bold">{transactions.length}</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow">
//             <p className="text-gray-500">Commission Rate</p>
//             <p className="text-3xl font-bold">5%</p>
//           </div>
//         </div>

//         {/* Transactions Table */}
//         <div className="bg-white rounded-xl shadow overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-4 text-left">Date</th>
//                 <th className="p-4 text-left">Business</th>
//                 <th className="p-4 text-right">Total</th>
//                 <th className="p-4 text-right">Commission (5%)</th>
//                 <th className="p-4 text-right">Seller Gets</th>
//                 <th className="p-4 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions.map((t) => (
//                 <tr key={t.id} className="border-t">
//                   <td className="p-4">
//                     {new Date(t.created_at).toLocaleDateString()}
//                   </td>
//                   <td className="p-4">{t.businesses?.business_name || "N/A"}</td>
//                   <td className="p-4 text-right">₹{t.total_amount}</td>
//                   <td className="p-4 text-right text-green-600 font-medium">
//                     ₹{t.commission_amount}
//                   </td>
//                   <td className="p-4 text-right">₹{t.seller_amount}</td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded text-sm ${
//                       t.status === 'captured' 
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-yellow-100 text-yellow-700'
//                     }`}>
//                       {t.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
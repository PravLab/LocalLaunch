// // app/site/[slug]/admin/payments/page.jsx
// 'use client'; // Ye zaroori hai kyunki hum useState, useEffect use karenge

// import { useState, useEffect } from 'react';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; // Supabase client for browser
// import { useParams } from 'next/navigation'; // URL ke [slug] ko access karne ke liye

// // IMPORTANT: Aapko apni Lucia user/session context yahan get karni hogi.
// // Ye ek example hai. Apne project ke hisaab se adjust karein.
// // Agar aapke paas useAuth hook hai jo current user deta hai:
// // import { useAuth } from '@/hooks/useAuth'; // Ya jo bhi path hai
// // const { user } = useAuth(); // Yahin se user ID mil jaayegi
// // Agar nahi hai, toh aapko session server component se pass karna hoga.

// export default function PaymentSettingsPage() {
//     const [supabase] = useState(() => createClientComponentClient());
//     const params = useParams(); // URL se slug nikalne ke liye
//     const businessSlug = params.slug; // Ye aapka business ka slug hoga

//     const [settings, setSettings] = useState({
//         razorpay_key_id: '',
//         razorpay_secret_key: '',
//     });
//     const [loading, setLoading] = useState(true);
//     const [message, setMessage] = useState('');
//     const [ownerUserId, setOwnerUserId] = useState(null); // Owner ka user ID stored in DB
//     const [businessId, setBusinessId] = useState(null); // Business ka actual ID from DB

//     // --- TEMPORARY: Lucia User ID placeholder ---
//     // Jab tak aap useAuth() ya server se user ID nahi laate,
//     // aapko yahan hardcode karna pad sakta hai testing ke liye.
//     // YA: aapko confirm karna hoga ki current logged in user, is business ka owner hai.
//     // For now, hum assume karenge ki `auth.uid()` RLS se kaam karega.
//     // But UI level par bhi check karna better hai.
//     // Is example mein, hum Supabase se owner_user_id fetch karenge aur verify karenge.
//     // ---------------------------------------------

//     useEffect(() => {
//         async function fetchSettings() {
//             setLoading(true);
//             setMessage('');

//             if (!businessSlug) {
//                 setMessage('Error: Business slug not found in URL.');
//                 setLoading(false);
//                 return;
//             }

//             // Step 1: Business details fetch karo slug se
//             const { data: businessData, error: businessError } = await supabase
//                 .from('businesses')
//                 .select('id, owner_user_id, razorpay_key_id, razorpay_secret_key')
//                 .eq('slug', businessSlug)
//                 .single();

//             if (businessError) {
//                 setMessage('Error fetching business details: ' + businessError.message);
//                 console.error('Error fetching business:', businessError);
//                 setLoading(false);
//                 return;
//             }

//             if (!businessData) {
//                 setMessage('Business not found.');
//                 setLoading(false);
//                 return;
//             }

//             setBusinessId(businessData.id);
//             setOwnerUserId(businessData.owner_user_id);

//             // Fetch successful, set form fields
//             setSettings({
//                 razorpay_key_id: businessData.razorpay_key_id || '',
//                 razorpay_secret_key: businessData.razorpay_secret_key || '',
//             });

//             setLoading(false);
//         }

//         fetchSettings();
//     }, [businessSlug, supabase]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setSettings(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSave = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage('');

//         if (!businessId || !ownerUserId) {
//             setMessage('Error: Business or owner ID not found. Cannot save.');
//             setLoading(false);
//             return;
//         }

//         // IMPORTANT: Yahan aapko verify karna hoga ki current logged in user (`auth.uid()`)
//         // is `ownerUserId` ke barabar hai. Client-side pe confirm karne ke liye
//         // Lucia ka useAuth() hook ya similar method se current user ID get karein.
//         // Server-side RLS already check karega, but client-side UI feedback ke liye bhi achha hai.
//         // For example:
//         // if (user && user.id !== ownerUserId) {
//         //   setMessage('You do not have permission to save these settings.');
//         //   setLoading(false);
//         //   return;
//         // }


//         const { error } = await supabase
//             .from('businesses')
//             .update({
//                 razorpay_key_id: settings.razorpay_key_id,
//                 razorpay_secret_key: settings.razorpay_secret_key,
//                 // Add is_payment_enabled if you implement it
//             })
//             .eq('id', businessId) // Business ID se update karein
//             .eq('owner_user_id', ownerUserId); // Aur owner ID se bhi match karein (RLS help karega)

//         if (error) {
//             setMessage('Error saving settings: ' + error.message);
//             console.error('Error updating business settings:', error);
//         } else {
//             setMessage('Settings saved successfully!');
//         }
//         setLoading(false);
//     };

//     // Clear Fields button ka function
//     const handleClear = () => {
//         setSettings({
//             razorpay_key_id: '',
//             razorpay_secret_key: '',
//         });
//         setMessage('Fields cleared. "Save Settings" par click karke changes permanent karein.');
//     };

//     if (loading) {
//         return <div className="p-4 text-center">Loading payment settings...</div>;
//     }

//     // Optional: Agar current user, fetched ownerUserId se match nahi karta toh
//     // return <div className="p-4 text-red-600">Access Denied: You are not the owner of this business.</div>;

//     return (
//         <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md mt-8">
//             <h1 className="text-2xl font-bold mb-4 text-gray-800">Payment Gateway Settings</h1>
//             <p className="text-sm text-gray-600 mb-6">
//                 Yahan aap apne Razorpay API Keys daal sakte hain. Jab aap live payment lena shuru karenge,
//                 aapko Razorpay par KYC (PAN, Bank details) complete karni hogi. Test keys ke liye KYC ki zaroorat nahi hai.
//             </p>

//             <form onSubmit={handleSave} className="space-y-4">
//                 <div>
//                     <label htmlFor="razorpay_key_id" className="block text-sm font-medium text-gray-700">
//                         Razorpay Key ID (Public Key)
//                     </label>
//                     <input
//                         type="text"
//                         id="razorpay_key_id"
//                         name="razorpay_key_id"
//                         value={settings.razorpay_key_id}
//                         onChange={handleChange}
//                         placeholder="rzp_live_xxxxxxxxxxxxxxxx"
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     />
//                     <p className="mt-1 text-xs text-gray-500">Ye key aapko apne Razorpay dashboard se milegi. Ye 'rzp_live_' ya 'rzp_test_' se shuru hoti hai.</p>
//                 </div>

//                 <div>
//                     <label htmlFor="razorpay_secret_key" className="block text-sm font-medium text-gray-700">
//                         Razorpay Secret Key
//                     </label>
//                     <input
//                         type="password"
//                         id="razorpay_secret_key"
//                         name="razorpay_secret_key"
//                         value={settings.razorpay_secret_key}
//                         onChange={handleChange}
//                         placeholder="********"
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     />
//                     <p className="mt-1 text-xs text-gray-500">Ye key bahut confidential hai. Ise kabhi kisi se share na karein.</p>
//                 </div>

//                 <div className="flex space-x-4">
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     >
//                         {loading ? 'Saving...' : 'Save Settings'}
//                     </button>
//                     <button
//                         type="button"
//                         onClick={handleClear}
//                         disabled={loading}
//                         className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     >
//                         Clear Fields
//                     </button>
//                 </div>
//             </form>

//             {message && (
//                 <p className={`mt-4 text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
//                     {message}
//                 </p>
//             )}
//         </div>
//     );
// }


import React from 'react'

const payments = () => {
  return (
    <div className='bg-black h-screen flex items-center justify-center h-full w-full '>
        <p className='text-white text-7xl font-bold'>Comming Soon..</p>
    </div>
  )
}

export default payments
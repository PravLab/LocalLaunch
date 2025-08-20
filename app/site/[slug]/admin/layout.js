// app/site/[slug]/admin/layout.js
// 'use client'

export default function AdminLayout({ children, params }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}

export function generateMetadata({ params }) {
  const slug  = params;
  
  return {
    title: `Admin Panel - ${slug}`,
    description: `Admin panel for ${slug} business management`,
    robots: 'noindex, nofollow', // Admin pages shouldn't be indexed
  };
}
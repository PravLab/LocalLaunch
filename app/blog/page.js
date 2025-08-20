// app/blog/page.js (Server Component)
import BlogClient from "./BlogClient";

export const metadata = {
  title: "Local Launch Blog — Tips, Tools & Insights",
  description: "Grow your local business online with Local Launch tips, tools, and guides.",
};

export default function BlogListPage() {
  return <BlogClient />;
}

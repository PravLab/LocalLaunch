import blogs from "@/src/data/blogs";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return blogs.map((post) => ({ slug: post.slug }));
}

export default function BlogPage({ params }) {
  const blog = blogs.find((b) => b.slug === params.slug);
  if (!blog) return notFound();

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Title and Meta */}
        <header className="bg-[#1a1a1a] rounded-xl p-6 md:p-10 border border-[#333] shadow-lg">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white mb-4">
            {blog.title}
          </h1>
          <p className="text-sm text-gray-400">
            📅 <span className="ml-1">{blog.date}</span>
          </p>
        </header>

        {/* Blog Content */}
        <section className="bg-[#1a1a1a] rounded-xl p-6 md:p-10 border border-[#333] shadow-lg">
          <div className="prose prose-invert prose-orange max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md">
            <article dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </section>

        {/* Call To Action */}
        <section className="bg-gradient-to-r from-[#222] to-[#1c1c1c] border border-[#333] rounded-xl p-6 md:p-10 text-center shadow-inner">
          <h3 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4">
            🚀 Ready to Launch Your Local Business Online?
          </h3>
          <p className="text-gray-300 text-base md:text-lg mb-6">
            Start accepting orders online without any coding. Use <strong>Local Launch</strong> to build your digital storefront in just a few minutes.
          </p>
          <a
            href="https://locallaunch.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all"
          >
            Try Local Launch Now →
          </a>
        </section>

        {/* Bottom Note */}
        <footer className="text-center text-sm text-gray-500 pt-6 border-t border-[#333]">
          <p>
            Want to get your local shop online? Follow our blog to learn how small businesses are going digital with{" "}
            <strong className="text-orange-400">Local Launch</strong>.
          </p>
        </footer>
      </div>
    </main>
  );
}


export const dynamicParams = true;

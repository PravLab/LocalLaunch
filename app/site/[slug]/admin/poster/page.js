// import PosterEditor from "@/app/components/poster/PosterEditor";

// export default function PosterPage({ params }) {
//   const { slug } = params;

//   return (
//     <main className="min-h-screen bg-gray-50">
//       <PosterEditor slug={slug} />
//     </main>
//   );
// }



import PosterEditor from "@/app/components/poster/PosterEditor";

export default function PosterPage({ params ,slug }) {
  return <PosterEditor slug={slug} />;
}


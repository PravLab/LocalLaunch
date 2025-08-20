import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export default async function Layout({ children, params }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("preview_token")?.value;

  if (!token) {
    notFound();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.slug !== slug) {
      notFound();
    }
  } catch (err) {
    console.error("Invalid or expired token", err);
    notFound();
  }

  return <>{children}</>;
}

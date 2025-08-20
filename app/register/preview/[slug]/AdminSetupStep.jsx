// AdminSetupStep.jsx (no js-cookie needed)
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminSetupStep({ slug }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 // inside your signup handler (frontend/client component)
const handleSignup = async () => {
  const res = await fetch("/api/admin-signup", {
    method: "POST",
    body: JSON.stringify({ slug, email, password }),
  });

  const data = await res.json();

  if (data.success) {
    // ✅ Set slug/email in localStorage (optional)
    localStorage.setItem("slug", slug);
    localStorage.setItem("admin_email", email);

    // ✅ Redirect to admin page
    window.location.href = `/site/${slug}/admin`;
  } else {
    alert(data.error);
  }
};


  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Create password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleSignup}
        className="bg-black text-white p-2 rounded w-full"
      >
        Setup Admin
      </button>
    </div>
  );
}

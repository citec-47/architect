import LoginForm from "@/components/admin/LoginForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 md:p-12 w-full max-w-md">
        <h1 className="hero-mega-title text-white mb-2" style={{ fontSize: "clamp(2rem,6vw,4rem)" }}>
          ADMIN
        </h1>
        <p className="text-white/60 text-xs tracking-widest uppercase mb-8">
          Studio access
        </p>
        <LoginForm />
      </div>
    </main>
  );
}

import Link from "next/link";
import { Lock } from "lucide-react";

interface LoginGateProps {
  heading?: string;
  subtext?: string;
  loginHref?: string;
  signupHref?: string;
}

export default function LoginGate({
  heading = "Login to Continue",
  subtext = "Join 10,000+ GATE MT aspirants and get full access to study material.",
  loginHref = "/login",
  signupHref = "/signup",
}: LoginGateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      {/* Lock icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
        <Lock className="h-8 w-8" />
      </div>

      {/* Text */}
      <h3 className="mt-5 text-xl font-bold text-slate-900">{heading}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">{subtext}</p>

      {/* Buttons */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={loginHref}
          className="rounded-xl border-2 border-blue-600 px-6 py-2.5 text-sm font-bold text-blue-600 transition-all hover:bg-blue-50 hover:shadow-sm"
        >
          Login
        </Link>
        <Link
          href={signupHref}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Sign Up Free
        </Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Crown,
  Loader2,
  QrCode,
  Shield,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const freePlanFeatures = [
  "PYQs from last 3 years only",
  "2 mock tests per month",
  "Basic analytics dashboard",
  "Syllabus tracker",
  "Limited subject notes",
];

const premiumPlanFeatures = [
  "All PYQs from 2010–2026",
  "Unlimited mock tests",
  "Full analytics & insights",
  "All subject notes included",
  "Leaderboard access",
  "Priority support",
  "Detailed test analysis",
  "Bookmark unlimited questions",
];

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);


  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Card inputs
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // UPI input
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium")
          .eq("id", user.id)
          .maybeSingle();
        setIsPremium(profile?.is_premium ?? false);
      }

    }
    checkUser();
  }, []);

  function handleGetPremium() {
    if (!user) {
      // Redirect to login if not authenticated
      router.push("/login?next=/pricing");
      return;
    }
    setIsCheckoutOpen(true);
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setProcessing(true);

    // Simulated local validation
    if (paymentMethod === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        setErrorMessage("Please enter a valid 16-digit card number.");
        setProcessing(false);
        return;
      }
      if (!cardExpiry.includes("/")) {
        setErrorMessage("Please enter expiration date (MM/YY).");
        setProcessing(false);
        return;
      }
      if (cardCvv.length < 3) {
        setErrorMessage("Please enter a valid CVV.");
        setProcessing(false);
        return;
      }
    } else {
      if (!upiId.includes("@")) {
        setErrorMessage("Please enter a valid UPI ID (e.g. student@upi).");
        setProcessing(false);
        return;
      }
    }

    // Call the activate api
    try {
      const response = await fetch("/api/premium/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPaymentSuccess(true);
        setTimeout(() => {
          setIsCheckoutOpen(false);
          router.push("/dashboard");
          router.refresh();
        }, 2500);
      } else {
        setErrorMessage(result.error || "Failed to process payment. Please try again.");
      }
    } catch (err) {
      console.error("Checkout payment error:", err);
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 py-20 sm:py-28 text-center">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-200">
            <Zap className="h-4 w-4 text-amber-400" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Invest in Your GATE Rank
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Start free. Upgrade when you&apos;re ready to go all in on GATE MT preparation.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            {/* Free */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <h2 className="text-xl font-bold text-slate-900 font-sans">Free Plan</h2>
              <p className="mt-2 text-sm text-slate-500">Perfect to explore the platform</p>
              <p className="mt-6 text-4xl font-extrabold text-slate-900">
                ₹0
                <span className="text-base font-medium text-slate-500">/forever</span>
              </p>
              <ul className="mt-8 space-y-3">
                {freePlanFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="mt-8 flex w-full items-center justify-center rounded-xl border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
              >
                Get Started Free
              </Link>
            </div>

            {/* Premium */}
            <div className="relative rounded-2xl border-2 border-blue-500 bg-white p-8 shadow-xl shadow-blue-200/50 ring-4 ring-blue-500/10 transition-all hover:shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                  <Crown className="h-3 w-3" />
                  Most Popular
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Premium Plan</h2>
              <p className="mt-2 text-sm text-slate-500">Everything you need to crack GATE MT</p>
              <p className="mt-6 text-4xl font-extrabold text-slate-900">
                ₹999
                <span className="text-base font-medium text-slate-500">/year</span>
              </p>
              <ul className="mt-8 space-y-3">
                {premiumPlanFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    {item}
                  </li>
                ))}
              </ul>

              {isPremium ? (
                <div className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-50 px-6 py-3 text-sm font-semibold text-amber-800 border border-amber-200">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" />
                  Premium Active
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGetPremium}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-colors hover:bg-blue-700"
                >
                  Get Premium
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <p className="mt-12 text-center text-sm text-slate-500">
            All plans include access to the GATE MT syllabus tracker and community support.
            <br />
            Premium payments include instant subscription activation.
          </p>
        </div>
      </section>

      {/* Checkout Modal Dialog */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-slate-100">
            {paymentSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">Payment Successful!</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Your account has been upgraded to Premium.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting to dashboard...
                </div>
              </div>
            ) : (
              <form onSubmit={handlePayment}>
                {/* Modal Header */}
                <div className="bg-slate-950 p-6 text-white relative">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-lg">GATE MT Pro Checkout</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    Complete your upgrade to access full PYQs, mock tests, and subject notes.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Amount Row */}
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Subtotal Amount</span>
                  <span className="text-lg font-extrabold text-slate-900">₹999</span>
                </div>

                {/* Body Content */}
                <div className="p-6">
                  {/* Tabs */}
                  <div className="mb-6 flex rounded-lg bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-xs font-semibold transition-all ${
                        paymentMethod === "card"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      Card Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-xs font-semibold transition-all ${
                        paymentMethod === "upi"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <QrCode className="h-4 w-4" />
                      UPI / QR Code
                    </button>
                  </div>

                  {errorMessage && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-medium text-red-600 animate-shake">
                      {errorMessage}
                    </div>
                  )}

                  {/* Form inputs depending on method */}
                  {paymentMethod === "card" ? (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => {
                              // Auto format card digits spacing
                              const raw = e.target.value.replace(/\s/g, "");
                              const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
                              setCardNumber(formatted);
                            }}
                            placeholder="4111 2222 3333 4444"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            required
                          />
                          <CreditCard className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-600">Expiry Date</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => {
                              let val = e.target.value;
                              if (val.length === 2 && !val.includes("/")) {
                                val = val + "/";
                              }
                              setCardExpiry(val);
                            }}
                            placeholder="MM/YY"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-600">CVV</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">UPI Address</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="student@okaxis"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 p-3 text-[11px] text-slate-500 leading-relaxed">
                        <QrCode className="h-4 w-4 text-slate-400 shrink-0" />
                        Enter your UPI ID to trigger a simulated subscription request in the database.
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-1/3 rounded-xl border border-slate-300 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Shield className="h-3.5 w-3.5" />
                        Pay Securely ₹999
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FAQ CTA */}
      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Still have questions?</h2>
          <p className="mt-3 text-slate-600">
            Start with the free plan and upgrade anytime when you&apos;re ready.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 shadow-md transition-all"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

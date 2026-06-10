import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ClipboardList,
  Crown,
  FileQuestion,
  LineChart,
  Play,
  Quote,
  RefreshCw,
  Star,
  Timer,
  Trophy,
  UserPlus,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GATE MT Pro — India's Premier GATE Metallurgy Prep Platform",
  description:
    "Boost your GATE Metallurgy score with exam-focused notes, solved PYQs, timed mock tests, and actionable smart analytics. Start for free!",
};

const stats = [
  { value: "5000+", label: "PYQs" },
  { value: "50+", label: "Mock Tests" },
  { value: "10,000+", label: "Students" },
  { value: "95%", label: "Selection Rate" },
];

const features = [
  {
    icon: FileQuestion,
    title: "PYQ Bank",
    description:
      "All GATE MT questions from 2010 to 2026 organized by subject, topic and difficulty",
    color: "bg-blue-50 text-blue-600 border border-blue-100",
  },
  {
    icon: Timer,
    title: "Timed Mock Tests",
    description:
      "Full length 3-hour GATE simulations with real exam interface and auto-scoring",
    color: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  },
  {
    icon: LineChart,
    title: "Smart Analytics",
    description:
      "Track your weak subjects, accuracy trends, and compare with toppers",
    color: "bg-violet-50 text-violet-600 border border-violet-100",
  },
  {
    icon: BookOpen,
    title: "Subject Notes",
    description:
      "Concise, exam-focused notes for every GATE MT topic written by experts",
    color: "bg-sky-50 text-sky-600 border border-sky-100",
  },
  {
    icon: RefreshCw,
    title: "Revision Mode",
    description:
      "Revisit bookmarked and incorrectly answered questions for targeted practice",
    color: "bg-cyan-50 text-cyan-600 border border-cyan-100",
  },
  {
    icon: Trophy,
    title: "Leaderboard",
    description:
      "Compete with thousands of aspirants and track your all-India rank",
    color: "bg-amber-50 text-amber-600 border border-amber-100",
  },
];

const subjects = [
  "Engineering Mathematics",
  "Engineering Physics",
  "Thermodynamics",
  "Phase Transformations",
  "Phase Diagrams",
  "Solidification",
  "Heat Treatment",
  "Mechanical Properties",
  "Deformation",
  "Fracture",
  "Fatigue",
  "Creep",
  "Diffusion",
  "Electrochemistry",
  "Corrosion",
  "Casting",
  "Forming",
  "Welding",
  "Powder Metallurgy",
  "Non-Ferrous Alloys",
  "Ferrous Alloys",
  "Ceramics",
  "Polymers",
  "Composites",
  "Electronic Properties",
  "Magnetic Properties",
  "Optical Properties",
  "Manufacturing Processes",
];

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Free Account",
    description: "Sign up in 30 seconds with your email. No credit card required.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Practice PYQs and Mock Tests",
    description: "Build concepts and speed with subject-wise PYQs and full-length mocks.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Track and Improve",
    description: "Use analytics to fix weak areas and climb the all-India leaderboard.",
  },
];

const testimonials = [
  {
    name: "Rohan Sharma",
    rank: "AIR 12 GATE MT 2024",
    quote:
      "The mock tests on GATE MT Pro are identical to the real exam. My rank jumped from 400 to 12 in 6 months of serious preparation on this platform.",
    initials: "RS",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Priya Nair",
    rank: "AIR 34 GATE MT 2024",
    quote:
      "The subject-wise analytics showed me exactly where I was losing marks. The notes are concise and the PYQ bank is the most complete I have seen.",
    initials: "PN",
    color: "from-indigo-500 to-violet-600",
  },
  {
    name: "Aman Verma",
    rank: "AIR 67 GATE MT 2024",
    quote:
      "I tried many platforms but GATE MT Pro is the only one built specifically for Metallurgy. The quality of explanations is exceptional.",
    initials: "AV",
    color: "from-violet-500 to-purple-600",
  },
];

const freePlanFeatures = [
  "PYQs from last 3 years only",
  "2 mock tests per month",
  "Basic analytics dashboard",
];

const premiumPlanFeatures = [
  "All PYQs from 2010–2026",
  "Unlimited mock tests",
  "Full analytics & insights",
  "All subject notes included",
  "Leaderboard access",
  "Priority support",
];

const faqs = [
  {
    question: "How long will I have access to the Premium Plan?",
    answer: "You get full, unrestricted access to all Premium features for one full year (365 days) from the date of subscription. No automatic recurring charges.",
  },
  {
    question: "Are the notes and mock tests updated for the latest syllabus?",
    answer: "Yes, our subject notes, PYQ bank (2010–2026), and mock tests are fully updated and reviewed annually by experts to align with the latest GATE MT syllabus.",
  },
  {
    question: "Can I bookmark questions and track progress on the free plan?",
    answer: "Yes, free tier accounts can track their basic progress, use the syllabus tracker, and view PYQs for the last 3 years. Upgrade anytime to unlock the full database.",
  },
  {
    question: "How are the mock tests scored?",
    answer: "Mock tests are timed and replicate the exact GATE interface. They are auto-scored instantly upon completion, providing comprehensive analytics on accuracy and time spent per question.",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="animate-page-entry">
      {/* Section 1 — Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950" />
        <div className="absolute -left-32 top-20 h-96 w-96 animate-pulse rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-96 w-96 animate-pulse rounded-full bg-indigo-600/20 blur-3xl [animation-delay:1s]" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-blue-500/10 blur-3xl [animation-delay:0.5s]" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-32">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-200 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-amber-400 animate-pulse" />
              Trusted by 10,000+ GATE Aspirants
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Crack GATE Metallurgy
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
                With Confidence
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              India&apos;s most comprehensive GATE MT preparation platform. PYQs,
              Mock Tests, Smart Analytics, and Expert Notes — all in one place.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/40 transition-all hover:bg-blue-500 hover:shadow-blue-500/50"
              >
                Start for Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <Play className="h-5 w-5 fill-white" />
                Explore Features
              </Link>
            </div>
          </div>

          <div className="relative hidden h-[420px] lg:block">
            <div className="absolute right-8 top-0 w-64 animate-float rounded-2xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                  <Trophy className="h-5 w-5 text-green-400 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Rank Improved</p>
                  <p className="text-lg font-bold text-white">
                    450 <span className="text-slate-500">→</span> 23
                  </p>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
                <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
              </div>
            </div>

            <div className="absolute left-4 top-24 w-56 animate-float rounded-2xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-md [animation-delay:0.5s]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-300">Accuracy</p>
                <span className="text-2xl font-bold text-blue-400">87%</span>
              </div>
              <div className="mt-3 flex gap-1">
                {[65, 72, 68, 80, 75, 87].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-blue-500/60"
                    style={{ height: `${h * 0.4}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="absolute bottom-8 right-0 w-72 animate-float rounded-2xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-md [animation-delay:1s]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20">
                  <LineChart className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Weekly Progress</p>
                  <p className="text-lg font-bold text-white">+24% this week</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Thermodynamics accuracy up 18%
              </p>
            </div>

            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/20 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm">
              <div className="flex h-full flex-col items-center justify-center">
                <div className="text-4xl font-extrabold text-white">MT</div>
                <div className="mt-1 text-xs font-medium text-blue-300">GATE 2025</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Stats bar */}
      <section className="bg-slate-900 border-y border-slate-800/80 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-white sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — Features */}
      <section id="features" className="bg-white py-20 sm:py-28 scroll-mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Everything You Need to Crack GATE MT
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              A complete toolkit designed exclusively for Metallurgy aspirants.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-glow"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${feature.color}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Subjects */}
      <section className="bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Complete GATE MT Syllabus Coverage
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Every subject, every topic — structured for efficient preparation.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {subjects.map((subject) => (
              <span
                key={subject}
                className="cursor-default rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-all hover:border-blue-400 hover:bg-blue-100 hover:shadow-md hover:shadow-blue-100"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 — How it works */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Start Your GATE Journey in 3 Steps
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From signup to selection — a clear path to your dream rank.
            </p>
          </div>

          <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
            <div className="absolute left-[16.67%] right-[16.67%] top-12 hidden border-t-2 border-dashed border-blue-200 md:block" />

            {steps.map((step) => (
              <div key={step.number} className="relative text-center group">
                <div className="mx-auto flex h-24 w-24 flex-col items-center justify-center rounded-2xl border-2 border-blue-100 bg-blue-50 shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <span className="text-xs font-bold text-blue-400">
                    STEP {step.number}
                  </span>
                  <step.icon className="mt-1 h-7 w-7 text-blue-600" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — Testimonials */}
      <section className="bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              What Our Students Say
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Real results from GATE MT toppers who prepared with us.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >
                <Quote className="absolute right-6 top-6 h-8 w-8 text-blue-100/60" />
                <StarRating />
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-6">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-white shadow-sm`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs font-medium text-blue-600">{t.rank}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 — Pricing */}
      <section id="pricing" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Start free. Upgrade when you are ready to go all in.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2 md:items-center">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">Free Plan</h3>
              <p className="mt-2 text-sm text-slate-500">
                Perfect to explore the platform
              </p>
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

            <div className="relative md:scale-105 rounded-2xl border-2 border-blue-500 bg-white p-8 shadow-xl shadow-blue-200/50 ring-4 ring-blue-500/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                  <Crown className="h-3 w-3" />
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Premium Plan</h3>
              <p className="mt-2 text-sm text-slate-500">
                Everything you need to crack GATE MT
              </p>
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
              <Link
                href="/signup?plan=premium"
                className="mt-8 flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-colors hover:bg-blue-700"
              >
                Get Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-slate-50 border-t border-slate-200/60 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Everything you need to know about GATE MT Pro and your preparation.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-slate-200 bg-white p-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-slate-900">
                  <h3 className="font-semibold text-base md:text-lg">
                    {faq.question}
                  </h3>
                  <span className="relative h-5 w-5 shrink-0">
                    <span className="absolute inset-0 h-5 w-0.5 rounded-full bg-slate-400 group-open:rotate-90 transition-transform duration-300" />
                    <span className="absolute inset-0 w-5 h-0.5 rounded-full bg-slate-400 group-open:opacity-0 transition-opacity duration-300 mt-2" style={{marginTop: '9px'}} />
                  </span>
                </summary>
                <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8 — Final CTA */}
      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 to-indigo-950/50" />
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your GATE Rank is Waiting
          </h2>
          <p className="mt-6 text-lg text-slate-400">
            Join 10,000+ metallurgy students already preparing smarter
          </p>
          <Link
            href="/signup"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-600/40 transition-all hover:bg-blue-500 hover:shadow-blue-500/50"
          >
            Start Preparing for Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

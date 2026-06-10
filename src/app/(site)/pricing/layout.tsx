import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Plan Pricing | GATE MT Pro",
  description: "Get unlimited access to all 2010–2026 GATE Metallurgy solved PYQs, full-length timed mock tests, and expert subject notes. Start preparation today.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

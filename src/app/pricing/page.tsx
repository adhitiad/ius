"use client";

import PricingCard from "@/components/pricing/PricingCard";
import { Sidebar } from "@/components/Sidebar";
import { type PlanType } from "@/lib/rbac";
import { cn } from "@/lib/utils";
import { useMarketStore } from "@/store/useMarketStore";
import { useRouter } from "next/navigation";

const PricingPage = () => {
  const { updateSubscription, user: marketUser } = useMarketStore();
  const router = useRouter();

  const handleUpgrade = (tier: PlanType) => {
    updateSubscription(tier);
    router.push("/settings/billing");
  };

  const tiers = [
    {
      tier: "free" as const,
      displayName: "Basic",
      price: "Free",
      description: "Ideal for beginners exploring market insights with basic scanning.",
      features: [
        "Real-time Ticker Search",
        "Top 20 Stock Screener",
        "Basic Technical Indicators",
        "Community Support",
      ],
      buttonText: marketUser?.subscription?.tier === "free" ? "Current Plan" : "Get Started",
      variant: "basic" as const,
    },
    {
      tier: "pro" as const,
      displayName: "Pro",
      price: "IDR 149k",
      description: "Most popular for active traders who need advanced AI signals.",
      features: [
        "Everything in Basic",
        "AI Algorithmic Signals",
        "Advanced Strategy Backtester",
        "Volume Spikes Alerts",
        "Priority Email Support",
      ],
      buttonText: marketUser?.subscription?.tier === "pro" ? "Current Plan" : "Upgrade to Pro",
      variant: "pro" as const,
      isPopular: true,
    },
    {
      tier: "bisnis" as const,
      displayName: "VIP",
      price: "IDR 499k",
      description: "For institutional traders requiring deep sentiment & customization.",
      features: [
        "Everything in Pro",
        "Custom Sentiment Analysis",
        "Institutional Order Flow",
        "24/7 Dedicated Manager",
        "Top 100+ Stock Ticker",
        "AI Algorithmic Signals",
        "Advanced Strategy Backtester",
        "Volume Spikes Alerts",
        "Priority Email Support",
      ],
      buttonText: marketUser?.subscription?.tier === "bisnis" ? "Current Plan" : "Go VIP",
      variant: "vip" as const,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="text-blue-500 font-semibold tracking-widest uppercase text-sm mb-4">
              Pricing Plans
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Unlock Professional Insights
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your trading style. Upgrade or downgrade anytime.
              Get the edge you need with our AI-powered market intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, i) => (
              <div 
                key={tier.tier}
                className={cn(
                  "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both",
                  i === 0 && "animate-stagger-1",
                  i === 1 && "animate-stagger-2",
                  i === 2 && "animate-stagger-3"
                )}
              >
                <PricingCard
                  {...tier}
                  tier={tier.displayName}
                  onSelect={() => handleUpgrade(tier.tier)}
                />
              </div>
            ))}
          </div>

          <div className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/5 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Need a custom enterprise solution?</h3>
            <p className="text-gray-400 mb-6">We provide tailored data feeds and white-label solutions for larger firms.</p>
            <button className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;

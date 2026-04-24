"use client";

import React from "react";
import { Check, Zap, Rocket, Crown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pricingCardVariants = cva(
  "relative flex flex-col p-8 rounded-3xl transition-all duration-500 border overflow-hidden",
  {
    variants: {
      variant: {
        basic: "bg-white/5 border-white/10 hover:border-white/20",
        pro: "bg-blue-600/10 border-blue-500/30 hover:border-blue-500/50 shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)]",
        vip: "bg-purple-600/10 border-purple-500/30 hover:border-purple-500/50 shadow-[0_0_40px_-15px_rgba(168,85,247,0.3)]",
      },
    },
    defaultVariants: {
      variant: "basic",
    },
  }
);

interface PricingCardProps extends VariantProps<typeof pricingCardVariants> {
  tier: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  onSelect?: () => void;
  className?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  price,
  description,
  features,
  buttonText,
  variant,
  isPopular,
  onSelect,
  className,
}) => {
  const Icon = variant === "basic" ? Zap : variant === "pro" ? Rocket : Crown;

  return (
    <div className={cn(pricingCardVariants({ variant }), className)}>
      {isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
            Most Popular
          </div>
        </div>
      )}

      {variant === "pro" && (
        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-blue-500/20 to-transparent opacity-50 blur-3xl pointer-events-none animate-pulse" />
      )}

      <div className="relative z-10">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center mb-6",
          variant === "basic" ? "bg-white/10" : 
          variant === "pro" ? "bg-blue-500/20 text-blue-400" : 
          "bg-purple-500/20 text-purple-400"
        )}>
          <Icon size={24} />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{tier}</h3>
        <p className="text-gray-400 text-sm mb-6 min-h-[40px]">{description}</p>

        <div className="flex items-baseline mb-8">
          <span className="text-4xl font-bold text-white">{price}</span>
          {price !== "Free" && <span className="text-gray-500 ml-2 text-sm">/mo</span>}
        </div>

        <ul className="space-y-4 mb-10 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-300">
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center mr-3 shrink-0",
                variant === "basic" ? "bg-white/10" : 
                variant === "pro" ? "bg-blue-500/20 text-blue-400" : 
                "bg-purple-500/20 text-purple-400"
              )}>
                <Check size={12} strokeWidth={3} />
              </div>
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={onSelect}
          className={cn(
            "w-full py-4 rounded-2xl font-semibold transition-all duration-300",
            variant === "basic" 
              ? "bg-white/5 hover:bg-white/10 text-white border border-white/10" 
              : variant === "pro"
              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
              : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20"
          )}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PricingCard;

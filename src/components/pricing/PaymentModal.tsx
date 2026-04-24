"use client";

import React from "react";
import { X, CreditCard, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: string;
  price: string;
  onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  tier,
  price,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <CreditCard size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Complete Upgrade</h3>
              <p className="text-sm text-gray-400">Secure checkout powered by Stripe</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400 text-sm">Selected Plan</span>
                <span className="text-white font-semibold">{tier} Tier</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-white">
                <span>Total Due Today</span>
                <span>{price}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <ShieldCheck size={20} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200/70 leading-relaxed">
                  Your subscription will renew automatically every month. You can cancel 
                  anytime from your billing settings.
                </p>
              </div>
              
              <button
                onClick={onConfirm}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 transition-all group scale-100 hover:scale-[1.02] active:scale-95"
              >
                Confirm Payment
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-4 border-t border-white/5 flex justify-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <div className="w-8 h-5 bg-white/10 rounded" />
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest text-[8px]">Visa</span>
          </div>
          <div className="flex items-center gap-2 grayscale opacity-50">
            <div className="w-8 h-5 bg-white/10 rounded" />
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest text-[8px]">Mastercard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

"use client";

import React, { useState } from "react";
import { useMockStore } from "@/lib/mock-store";
import {
  Settings,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Bell,
  ToggleLeft,
  ToggleRight,
  Sliders,
  DollarSign,
  PhoneCall,
  X,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useMockStore();

  const [minWithdrawal, setMinWithdrawal] = useState(settings.minWithdrawal);
  const [maxWithdrawal, setMaxWithdrawal] = useState(settings.maxWithdrawal);
  const [referralBonus, setReferralBonus] = useState(settings.referralBonus);

  const [bkashNumber, setBkashNumber] = useState(settings.bkashNumber);
  const [nagadNumber, setNagadNumber] = useState(settings.nagadNumber);
  const [rocketNumber, setRocketNumber] = useState(settings.rocketNumber);

  const [announcement, setAnnouncement] = useState(settings.announcement);
  const [isDepositEnabled, setIsDepositEnabled] = useState(settings.isDepositEnabled);
  const [isWithdrawalEnabled, setIsWithdrawalEnabled] = useState(settings.isWithdrawalEnabled);

  const [successToast, setSuccessToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      minWithdrawal,
      maxWithdrawal,
      referralBonus,
      bkashNumber,
      nagadNumber,
      rocketNumber,
      announcement,
      isDepositEnabled,
      isWithdrawalEnabled,
    });
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">সিস্টেম কনফিগারেশন ও সেটিংস</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          পেমেন্ট নাম্বার, উইথড্রয়াল লিমিট, রেফারেল বোনাস ও সার্বজনীন ঘোষণা নিয়ন্ত্রণ করুন।
        </p>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">
              সিস্টেম সেটিংস সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!
            </span>
          </div>
          <button onClick={() => setSuccessToast(false)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Financial Rules Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900">
            <Sliders className="w-5 h-5 text-[#1e5eb3]" />
            <h2 className="font-bold text-sm sm:text-base">আর্থিক নীতিমালা ও লিমিট</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                সর্বনিম্ন উত্তোলন (৳):
              </label>
              <input
                type="number"
                min={10}
                value={minWithdrawal}
                onChange={(e) => setMinWithdrawal(Number(e.target.value))}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                সর্বোচ্চ উত্তোলন (৳):
              </label>
              <input
                type="number"
                min={100}
                value={maxWithdrawal}
                onChange={(e) => setMaxWithdrawal(Number(e.target.value))}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                প্রতি রেফার বোনাস (৳):
              </label>
              <input
                type="number"
                min={0}
                value={referralBonus}
                onChange={(e) => setReferralBonus(Number(e.target.value))}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
              />
            </div>
          </div>
        </div>

        {/* Official Payment Accounts */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-sm sm:text-base">অফিসিয়াল মার্চেন্ট / ডিপোজিট নাম্বার</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                bKash নম্বর:
              </label>
              <input
                type="text"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nagad নম্বর:
              </label>
              <input
                type="text"
                value={nagadNumber}
                onChange={(e) => setNagadNumber(e.target.value)}
                className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Rocket নম্বর:
              </label>
              <input
                type="text"
                value={rocketNumber}
                onChange={(e) => setRocketNumber(e.target.value)}
                className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
              />
            </div>
          </div>
        </div>

        {/* Global Features & Notice */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-sm sm:text-base">ঘোষণা ও গেটওয়ে নিয়ন্ত্রণ</h2>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              ইউজার নোটিশ / প্ল্যাটফর্ম অ্যানাউন্সমেন্ট:
            </label>
            <textarea
              rows={3}
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">ডিপোজিট সিস্টেম</span>
                <span className="text-[11px] text-slate-400">ইউজাররা ডিপোজিট রিকোয়েস্ট পাঠাতে পারবে</span>
              </div>
              <button
                type="button"
                onClick={() => setIsDepositEnabled(!isDepositEnabled)}
                className="text-2xl transition-transform active:scale-95"
              >
                {isDepositEnabled ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">উইথড্রয়াল সিস্টেম</span>
                <span className="text-[11px] text-slate-400">ইউজাররা টাকা তোলার রিকোয়েস্ট পাঠাতে পারবে</span>
              </div>
              <button
                type="button"
                onClick={() => setIsWithdrawalEnabled(!isWithdrawalEnabled)}
                className="text-2xl transition-transform active:scale-95"
              >
                {isWithdrawalEnabled ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1e5eb3] hover:bg-[#184a8f] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>সেটিংস সংরক্ষণ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
}

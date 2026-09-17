"use client";

import React, { useState } from "react";
import { useMockStore, PackageItem } from "@/lib/mock-store";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function AdminPackagesPage() {
  const { packages, createPackage, updatePackage, deletePackage } = useMockStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(500);
  const [validityDays, setValidityDays] = useState<number>(30);
  const [dailyTaskLimit, setDailyTaskLimit] = useState<number>(10);
  const [dailyRewardLimit, setDailyRewardLimit] = useState<number>(100);
  const [referralBonus, setReferralBonus] = useState<number>(15);
  const [featuresText, setFeaturesText] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [colorGradient, setColorGradient] = useState("from-slate-600 to-slate-800");

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingPackage(null);
    setName("");
    setPrice(1000);
    setValidityDays(30);
    setDailyTaskLimit(10);
    setDailyRewardLimit(150);
    setReferralBonus(15);
    setFeaturesText("দৈনিক ১০টি টাস্ক\nঅগ্রাধিকার সাপোর্ট\nরেফারেল বোনাস\n৩০ দিন মেয়াদ");
    setIsPopular(false);
    setColorGradient("from-indigo-600 to-blue-800");
    setModalOpen(true);
  };

  const openEditModal = (pkg: PackageItem) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setPrice(pkg.price);
    setValidityDays(pkg.validityDays);
    setDailyTaskLimit(pkg.dailyTaskLimit);
    setDailyRewardLimit(pkg.dailyRewardLimit);
    setReferralBonus(pkg.referralBonus);
    setFeaturesText(pkg.features.join("\n"));
    setIsPopular(!!pkg.isPopular);
    setColorGradient(pkg.color);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const featuresList = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    if (editingPackage) {
      updatePackage({
        ...editingPackage,
        name,
        price,
        validityDays,
        dailyTaskLimit,
        dailyRewardLimit,
        referralBonus,
        isPopular,
        color: colorGradient,
        features: featuresList,
      });
      setToastMsg(`প্যাকেজ "${name}" সফলভাবে আপডেট করা হয়েছে!`);
    } else {
      createPackage({
        name,
        price,
        validityDays,
        dailyTaskLimit,
        dailyRewardLimit,
        referralBonus,
        isPopular,
        color: colorGradient,
        features: featuresList,
      });
      setToastMsg(`নতুন প্যাকেজ "${name}" যোগ করা হয়েছে!`);
    }

    setModalOpen(false);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleDelete = (pkg: PackageItem) => {
    if (confirm(`আপনি কি "${pkg.name}" প্যাকেজটি মুছে ফেলতে চান?`)) {
      deletePackage(pkg.id);
      setToastMsg(`প্যাকেজটি মুছে ফেলা হয়েছে।`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">প্যাকেজ ও সাবস্ক্রিপশন কন্ট্রোল</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ইউজারদের জন্য সাবস্ক্রিপশন প্যাকেজ, মূল্য, মেয়াদ ও দৈনিক টাস্কের সীমা পরিচালনা করুন।
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e5eb3] hover:bg-[#184a8f] text-white text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন প্যাকেজ তৈরি করুন</span>
        </button>
      </div>

      {/* Success Notification */}
      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Header gradient bar */}
              <div className={`p-4 bg-gradient-to-r ${pkg.color} text-white relative`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold">{pkg.name}</h3>
                  {pkg.isPopular && (
                    <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      জনপ্রিয়
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black font-inter">৳{pkg.price}</span>
                  <span className="text-xs opacity-80">/ {pkg.validityDays} দিন</span>
                </div>
              </div>

              {/* Package Stats */}
              <div className="p-4 grid grid-cols-3 gap-2 bg-slate-50 border-b border-slate-100 text-center">
                <div className="p-1.5">
                  <span className="text-[10px] text-slate-400 block">দৈনিক কাজ</span>
                  <span className="text-xs font-bold text-slate-800">{pkg.dailyTaskLimit}টি</span>
                </div>
                <div className="p-1.5 border-x border-slate-200">
                  <span className="text-[10px] text-slate-400 block">সর্বোচ্চ আয়</span>
                  <span className="text-xs font-bold text-emerald-600 font-inter">৳{pkg.dailyRewardLimit}</span>
                </div>
                <div className="p-1.5">
                  <span className="text-[10px] text-slate-400 block">রেফার বোনাস</span>
                  <span className="text-xs font-bold text-amber-600">{pkg.referralBonus}%</span>
                </div>
              </div>

              {/* Features List */}
              <div className="p-4 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">সুবিধাসমূহ:</span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1e5eb3]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => openEditModal(pkg)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>সম্পাদনা</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(pkg)}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                title="মুছে ফেলুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Package Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingPackage ? `প্যাকেজ সম্পাদনা (${editingPackage.name})` : "নতুন প্যাকেজ তৈরি"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">প্যাকেজের নাম:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: গোল্ড প্যাকেজ"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">মূল্য (৳):</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">মেয়াদ (দিন):</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">দৈনিক কাজ:</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={dailyTaskLimit}
                    onChange={(e) => setDailyTaskLimit(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">দৈনিক রিওয়ার্ড (৳):</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={dailyRewardLimit}
                    onChange={(e) => setDailyRewardLimit(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">রেফার কমিশন (%):</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={referralBonus}
                    onChange={(e) => setReferralBonus(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  সুবিধাসমূহ (প্রতি লাইনে একটি করে লিখুন):
                </label>
                <textarea
                  rows={4}
                  required
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="rounded text-[#1e5eb3]"
                />
                <label htmlFor="popularCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  এটি একটি বিশেষ জনপ্রিয় (Featured) প্যাকেজ হিসেবে চিহ্নিত করুন
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl text-xs font-bold text-white bg-[#1e5eb3] hover:bg-[#184a8f] shadow"
                >
                  {editingPackage ? "পরিবর্তন সংরক্ষণ করুন" : "প্যাকেজ যোগ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

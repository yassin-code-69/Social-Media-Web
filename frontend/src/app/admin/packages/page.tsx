"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api-client";
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
  RefreshCw,
  ShoppingBag,
  Check,
  Clock,
  XCircle,
} from "lucide-react";

interface AdminPackageItem {
  id: string;
  name: string;
  price: number;
  validityDays: number;
  dailyTaskLimit: number;
  dailyRewardLimit: number;
  referralBonus: number;
  features: string[];
  isPopular?: boolean;
  color: string;
  status: string;
}

interface PackagePurchaseItem {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  packageId: string;
  packageName: string;
  validityDays: number;
  amount: { amount: number; formatted: string };
  paymentMethod: string;
  senderNumber: string;
  transactionId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function AdminPackagesPage() {
  const [activeTab, setActiveTab] = useState<"PACKAGES" | "PURCHASES">("PACKAGES");
  const [packages, setPackages] = useState<AdminPackageItem[]>([]);
  const [purchases, setPurchases] = useState<PackagePurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Package Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<AdminPackageItem | null>(null);

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
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pkgs, purs] = await Promise.allSettled([
        adminApi.getPackages(),
        adminApi.getPackagePurchases(),
      ]);
      if (pkgs.status === "fulfilled") setPackages(pkgs.value);
      if (purs.status === "fulfilled") setPurchases(purs.value);
    } catch (err: any) {
      console.error("Failed to load packages data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const openEditModal = (pkg: AdminPackageItem) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setPrice(pkg.price);
    setValidityDays(pkg.validityDays);
    setDailyTaskLimit(pkg.dailyTaskLimit);
    setDailyRewardLimit(pkg.dailyRewardLimit);
    setReferralBonus(pkg.referralBonus);
    setFeaturesText((pkg.features || []).join("\n"));
    setIsPopular(!!pkg.isPopular);
    setColorGradient(pkg.color || "from-slate-600 to-slate-800");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const featuresList = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      setActionLoading("form");
      if (editingPackage) {
        await adminApi.updatePackage(editingPackage.id, {
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
        await adminApi.createPackage({
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
        setToastMsg(`নতুন প্যাকেজ "${name}" সফলভাবে যোগ করা হয়েছে!`);
      }

      setModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || "প্যাকেজ সেভ করতে সমস্যা হয়েছে");
    } finally {
      setActionLoading(null);
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  const handleDelete = async (pkg: AdminPackageItem) => {
    if (confirm(`আপনি কি "${pkg.name}" প্যাকেজটি মুছে ফেলতে চান?`)) {
      try {
        await adminApi.deletePackage(pkg.id);
        setToastMsg(`প্যাকেজটি মুছে ফেলা হয়েছে।`);
        await loadData();
      } catch (err: any) {
        alert(err.message || "প্যাকেজ মুছে ফেলা যায়নি");
      } finally {
        setTimeout(() => setToastMsg(null), 3000);
      }
    }
  };

  // Purchase approvals
  const handleApprovePurchase = async (purchaseId: string) => {
    try {
      setActionLoading(purchaseId);
      const res = await adminApi.approvePackagePurchase(purchaseId);
      setToastMsg(res.message || "প্যাকেজ সাবস্ক্রিপশন অ্যাক্টিভ করা হয়েছে!");
      await loadData();
    } catch (err: any) {
      alert(err.message || "অনুমোদন ব্যর্থ হয়েছে");
    } finally {
      setActionLoading(null);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const handleRejectPurchase = async (purchaseId: string) => {
    const reason = prompt("বাতিলের কারণ লিখুন:", "ভুল ট্রানজেকশন তথ্য বা পেমেন্ট পাওয়া যায়নি");
    if (reason === null) return;
    try {
      setActionLoading(purchaseId);
      const res = await adminApi.rejectPackagePurchase(purchaseId, reason);
      setToastMsg(res.message || "প্যাকেজ ক্রয়ের আবেদন বাতিল করা হয়েছে।");
      await loadData();
    } catch (err: any) {
      alert(err.message || "বাতিল করা যায়নি");
    } finally {
      setActionLoading(null);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">প্যাকেজ ও সাবস্ক্রিপশন কন্ট্রোল</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ইউজারদের জন্য সাবস্ক্রিপশন প্যাকেজ কনফিগার করুন এবং প্যাকেজ ক্রয়ের আবেদনগুলো অনুমোদন করুন।
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-white text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#1e5eb3]" : ""}`} />
            <span>রিফ্রেশ</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1e5eb3] hover:bg-[#184a8f] text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন প্যাকেজ তৈরি</span>
          </button>
        </div>
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

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("PACKAGES")}
          className={`pb-3 px-3 text-xs font-bold transition-all relative ${
            activeTab === "PACKAGES"
              ? "text-[#1e5eb3] border-b-2 border-[#1e5eb3]"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            প্যাকেজ তালিকা ({packages.length})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("PURCHASES")}
          className={`pb-3 px-3 text-xs font-bold transition-all relative ${
            activeTab === "PURCHASES"
              ? "text-[#1e5eb3] border-b-2 border-[#1e5eb3]"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            ক্রয়ের আবেদন কিউ ({purchases.length})
            {purchases.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </span>
        </button>
      </div>

      {/* Tab 1: Packages List */}
      {activeTab === "PACKAGES" && (
        <div>
          {loading && packages.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
              <div className="w-8 h-8 border-3 border-[#1e5eb3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-bold">প্যাকেজ লোড হচ্ছে...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-bold">কোনো প্যাকেজ তৈরি করা নেই।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Header gradient bar */}
                    <div className={`p-4 bg-gradient-to-r ${pkg.color || "from-slate-700 to-slate-900"} text-white relative`}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold">{pkg.name}</h3>
                        {pkg.isPopular && (
                          <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/30 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            জনপ্রিয়
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-2xl font-black font-sans">৳ {pkg.price}</span>
                        <span className="text-xs text-white/80">/ {pkg.validityDays} দিন</span>
                      </div>
                    </div>

                    {/* Body specs */}
                    <div className="p-5 space-y-3 text-xs text-slate-700">
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">দৈনিক টাস্ক লিমিট</span>
                          <span className="font-bold text-slate-900 font-sans">{pkg.dailyTaskLimit} টি</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">দৈনিক আয় লিমিট</span>
                          <span className="font-bold text-emerald-600 font-sans">৳ {pkg.dailyRewardLimit}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          সুবিধাসমূহ:
                        </span>
                        {(pkg.features || []).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-[11px] font-bold text-slate-500">
                      রেফারেল বোনাস: <span className="text-[#1e5eb3]">{pkg.referralBonus}%</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(pkg)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-[#1e5eb3] hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                        title="প্যাকেজ সম্পাদনা করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(pkg)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                        title="প্যাকেজ মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Purchases Queue */}
      {activeTab === "PURCHASES" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">ইউজার</th>
                  <th className="py-3 px-4">অনুরোধকৃত প্যাকেজ</th>
                  <th className="py-3 px-4">মূল্য</th>
                  <th className="py-3 px-4">মাধ্যম</th>
                  <th className="py-3 px-4">প্রেরক ও TrxID</th>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                      কোনো প্যাকেজ ক্রয়ের পেন্ডিং আবেদন নেই!
                    </td>
                  </tr>
                ) : (
                  purchases.map((pur) => (
                    <tr key={pur.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {pur.userName}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {pur.phone}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#1e5eb3]">
                        {pur.packageName} ({pur.validityDays} দিন)
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900 font-sans">
                        ৳ {pur.amount?.amount || (pur.amount as any)}
                      </td>
                      <td className="py-3 px-4 uppercase font-bold text-slate-700">
                        {pur.paymentMethod}
                      </td>
                      <td className="py-3 px-4">
                        <span className="block font-mono text-slate-800">{pur.senderNumber}</span>
                        <span className="block font-mono text-[10px] text-slate-500 bg-slate-100 px-1 rounded inline-block">
                          {pur.transactionId}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-sans text-[11px]">
                        {new Date(pur.createdAt).toLocaleString("bn-BD")}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={actionLoading === pur.id}
                            onClick={() => handleApprovePurchase(pur.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>অনুমোদন</span>
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading === pur.id}
                            onClick={() => handleRejectPurchase(pur.id)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>বাতিল</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Package Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingPackage ? "প্যাকেজ সম্পাদনা করুন" : "নতুন প্যাকেজ তৈরি করুন"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">প্যাকেজের নাম:</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: গোল্ড প্ল্যান"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">মূল্য (৳):</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">মেয়াদ (দিন):</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">দৈনিক টাস্ক লিমিট:</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={dailyTaskLimit}
                    onChange={(e) => setDailyTaskLimit(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">দৈনিক আয় লিমিট (৳):</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={dailyRewardLimit}
                    onChange={(e) => setDailyRewardLimit(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">রেফারেল বোনাস (%):</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={referralBonus}
                    onChange={(e) => setReferralBonus(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">কার্ড গ্রেডিয়েন্ট কালার:</label>
                  <select
                    value={colorGradient}
                    onChange={(e) => setColorGradient(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                  >
                    <option value="from-indigo-600 to-blue-800">Indigo to Blue</option>
                    <option value="from-emerald-600 to-teal-800">Emerald to Teal</option>
                    <option value="from-amber-600 to-orange-800">Amber to Orange</option>
                    <option value="from-purple-600 to-pink-800">Purple to Pink</option>
                    <option value="from-slate-700 to-slate-900">Dark Slate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  সুবিধাসমূহ (প্রতি লাইনে একটি করে সুবিধা লিখুন):
                </label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPop"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1e5eb3]"
                />
                <label htmlFor="isPop" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  এই প্যাকেজটিকে &apos;জনপ্রিয়&apos; (Popular Tag) হিসেবে হাইলাইট করুন
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "form"}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1e5eb3] hover:bg-[#184a8f] text-white shadow-sm disabled:opacity-50"
                >
                  {editingPackage ? "আপডেট সংরক্ষণ করুন" : "প্যাকেজ তৈরি করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

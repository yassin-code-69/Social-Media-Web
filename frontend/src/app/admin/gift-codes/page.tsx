"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api-client";
import {
  Gift,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  RefreshCw,
  Copy,
  Check,
  Users,
  Calendar,
  Clock,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface GiftCodeItem {
  id: string;
  code: string;
  reward: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

interface RedemptionItem {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  amount: number;
  redeemedAt: string;
}

export default function AdminGiftCodesPage() {
  const [giftCodes, setGiftCodes] = useState<GiftCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newReward, setNewReward] = useState(25);
  const [newMaxUses, setNewMaxUses] = useState(500);
  const [newExpiresAt, setNewExpiresAt] = useState("");

  // Redemptions Modal
  const [redemptionsModalCode, setRedemptionsModalCode] = useState<GiftCodeItem | null>(null);
  const [redemptions, setRedemptions] = useState<RedemptionItem[]>([]);
  const [redemptionsLoading, setRedemptionsLoading] = useState(false);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadGiftCodes = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getGiftCodes();
      setGiftCodes(data);
    } catch (err: any) {
      console.error("Failed to load gift codes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGiftCodes();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading("create");
      const res = await adminApi.createGiftCode({
        code: newCode,
        reward: newReward,
        maxUses: newMaxUses,
        expiresAt: newExpiresAt ? new Date(newExpiresAt).toISOString() : null,
      });
      setToastMsg(res?.message || `নতুন কোড '${newCode}' তৈরি হয়েছে!`);
      setCreateModalOpen(false);
      setNewCode("");
      setNewReward(25);
      await loadGiftCodes();
    } catch (err: any) {
      alert(err.message || "গিফট কোড তৈরি করা যায়নি");
    } finally {
      setActionLoading(null);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      setActionLoading(id);
      const res = await adminApi.toggleGiftCode(id);
      setToastMsg(res?.message || "স্ট্যাটাস পরিবর্তন হয়েছে");
      await loadGiftCodes();
    } catch (err: any) {
      alert(err.message || "স্ট্যাটাস পরিবর্তন করা যায়নি");
    } finally {
      setActionLoading(null);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`আপনি কি '${code}' গিফট কোডটি মুছে ফেলতে চান?`)) {
      try {
        await adminApi.deleteGiftCode(id);
        setToastMsg(`কোড '${code}' মুছে ফেলা হয়েছে।`);
        await loadGiftCodes();
      } catch (err: any) {
        alert(err.message || "মুছে ফেলা যায়নি");
      } finally {
        setTimeout(() => setToastMsg(null), 3000);
      }
    }
  };

  const openRedemptionsModal = async (g: GiftCodeItem) => {
    setRedemptionsModalCode(g);
    try {
      setRedemptionsLoading(true);
      const data = await adminApi.getGiftCodeRedemptions(g.id);
      setRedemptions(data);
    } catch (err: any) {
      console.error("Failed to load redemptions", err);
    } finally {
      setRedemptionsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">গিফট কোড ও ভাউচার কন্ট্রোল</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            প্রচারমূলক গিফট কোড তৈরি করুন, রিওয়ার্ড নির্ধারণ ও কতজন ইউজার রিডিম করেছে তা দেখুন।
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadGiftCodes}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-white text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#1e5eb3]" : ""}`} />
            <span>রিফ্রেশ</span>
          </button>
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন গিফট কোড তৈরি</span>
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

      {/* Gift Codes Grid */}
      {loading && giftCodes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-bold">গিফট কোড লোড হচ্ছে...</p>
        </div>
      ) : giftCodes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-bold">কোনো গিফট কোড তৈরি করা নেই।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {giftCodes.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition-all ${
                item.isActive ? "border-slate-200 hover:border-emerald-300" : "border-slate-200 opacity-60 bg-slate-50"
              }`}
            >
              <div className="space-y-3">
                {/* Code & Reward Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-mono font-black text-base text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        <span>{item.code}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.code)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          {copiedCode === item.code ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        তৈরি: {new Date(item.createdAt).toLocaleDateString("bn-BD")}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-black text-sm font-sans border border-emerald-200">
                    ৳ {item.reward}
                  </span>
                </div>

                {/* Progress uses */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span className="text-[11px] text-slate-500">ব্যবহার সংখ্যা:</span>
                    <span className="font-bold font-sans">
                      {item.usedCount} / {item.maxUses} জন
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (item.usedCount / Math.max(1, item.maxUses)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Expiry */}
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    মেয়াদ: {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString("bn-BD") : "সীমাহীন"}
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      item.isActive ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {item.isActive ? "সক্রিয়" : "বন্ধ"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => openRedemptionsModal(item)}
                  className="text-xs font-bold text-[#1e5eb3] hover:underline flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>ব্যবহারকারী তালিকা ({item.usedCount})</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={actionLoading === item.id}
                    onClick={() => handleToggle(item.id)}
                    className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                    title={item.isActive ? "কোডটি নিষ্ক্রিয় করুন" : "কোডটি সক্রিয় করুন"}
                  >
                    {item.isActive ? (
                      <ToggleRight className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-400" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.code)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">নতুন গিফট কোড তৈরি করুন</h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">কোডের নাম (Code):</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: EID2026 বা SPECIAL50"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full uppercase font-mono font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">রিওয়ার্ডের পরিমাণ (৳):</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newReward}
                  onChange={(e) => setNewReward(Number(e.target.value))}
                  className="w-full font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">সর্বোচ্চ ব্যবহার লিমিট (জন):</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newMaxUses}
                  onChange={(e) => setNewMaxUses(Number(e.target.value))}
                  className="w-full font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">মেয়াদ শেষ হওয়ার তারিখ (ঐচ্ছিক):</label>
                <input
                  type="date"
                  value={newExpiresAt}
                  onChange={(e) => setNewExpiresAt(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "create"}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50"
                >
                  কোড সক্রিয় করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Redemptions Modal */}
      {redemptionsModalCode && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  কোড: <span className="font-mono text-emerald-600">{redemptionsModalCode.code}</span> (৳{redemptionsModalCode.reward})
                </h3>
                <p className="text-xs text-slate-500">এই কোডটি রিডিমকারী ব্যবহারকারীদের তালিকা</p>
              </div>
              <button
                type="button"
                onClick={() => setRedemptionsModalCode(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
              {redemptionsLoading ? (
                <div className="py-12 text-center text-slate-400 font-bold">লোড হচ্ছে...</div>
              ) : redemptions.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold">
                  এখনো কোনো ইউজার এই কোডটি রিডিম করেননি।
                </div>
              ) : (
                redemptions.map((r) => (
                  <div key={r.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{r.userName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{r.phone}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 font-sans block">+৳ {r.amount}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(r.redeemedAt).toLocaleString("bn-BD")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

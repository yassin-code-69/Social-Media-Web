"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api-client";
import {
  LayoutGrid,
  Save,
  CheckCircle2,
  X,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Clock,
  Check,
} from "lucide-react";

interface FeatureConfig {
  id: string;
  title: string;
  subtitle: string;
  status: "ACTIVE" | "UPCOMING" | "HIDDEN";
  badge?: string;
}

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState<FeatureConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getFeatures();
      setFeatures(data);
    } catch (err: any) {
      console.error("Failed to load features config", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const updateItem = (id: string, updates: Partial<FeatureConfig>) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await adminApi.updateFeatures(features);
      setToastMsg(res?.message || "কুইক অ্যাকশন গ্রিডের ফিচার সফলভাবে হালনাগাদ করা হয়েছে!");
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || "সংরক্ষণ করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-[#1e5eb3]" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              ড্যাশবোর্ড কুইক অ্যাকশন ও ফিচার কন্ট্রোল
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ইউজার ড্যাশবোর্ডের ১৫টি বাটন নিয়ন্ত্রণ করুন: সক্রিয় করুন, &apos;Upcoming&apos; ট্যাগ দিন অথবা সাময়িক লুকিয়ে রাখুন।
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadFeatures}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-white text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#1e5eb3]" : ""}`} />
            <span>রিফ্রেশ</span>
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

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-8 h-8 border-3 border-[#1e5eb3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-bold">ফিচারসমূহ লোড হচ্ছে...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((item, idx) => {
              const isActive = item.status === "ACTIVE";
              const isUpcoming = item.status === "UPCOMING";
              const isHidden = item.status === "HIDDEN";

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-4 border shadow-sm flex flex-col justify-between transition-all ${
                    isHidden
                      ? "border-slate-200 opacity-60 bg-slate-50/80"
                      : isUpcoming
                      ? "border-amber-200 bg-amber-50/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Title and status indicator */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-500">
                            {idx + 1}
                          </span>
                          <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.subtitle}</p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : isUpcoming
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {isActive && <Check className="w-3 h-3" />}
                        {isUpcoming && <Clock className="w-3 h-3" />}
                        {isHidden && <EyeOff className="w-3 h-3" />}
                        {isActive ? "সক্রিয়" : isUpcoming ? "আপকামিং" : "লুকানো"}
                      </span>
                    </div>

                    {/* Status radio buttons */}
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() =>
                          updateItem(item.id, {
                            status: "ACTIVE",
                            badge: item.badge === "Upcoming" ? "" : item.badge,
                          })
                        }
                        className={`py-1.5 rounded-lg transition-all ${
                          isActive
                            ? "bg-white text-emerald-700 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        সক্রিয়
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateItem(item.id, {
                            status: "UPCOMING",
                            badge: item.badge || "Upcoming",
                          })
                        }
                        className={`py-1.5 rounded-lg transition-all ${
                          isUpcoming
                            ? "bg-white text-amber-700 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        আপকামিং
                      </button>
                      <button
                        type="button"
                        onClick={() => updateItem(item.id, { status: "HIDDEN" })}
                        className={`py-1.5 rounded-lg transition-all ${
                          isHidden
                            ? "bg-white text-slate-700 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        লুকান
                      </button>
                    </div>

                    {/* Badge input */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">
                        ব্যাজ ট্যাগ (ঐচ্ছিক):
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: Upcoming, Hot, New, 2X"
                        value={item.badge || ""}
                        onChange={(e) => updateItem(item.id, { badge: e.target.value })}
                        className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1e5eb3]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save Floating Bar */}
          <div className="sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between">
            <div className="text-xs text-slate-600">
              পরিবর্তনগুলো সংরক্ষণ করতে <span className="font-bold text-slate-900">&apos;সংরক্ষণ করুন&apos;</span> বাটনে ক্লিক করুন।
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1e5eb3] hover:bg-[#184a8f] text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সকল পরিবর্তন সংরক্ষণ করুন"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

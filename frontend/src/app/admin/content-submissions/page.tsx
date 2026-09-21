"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api-client";
import {
  PenTool,
  Video,
  CheckCircle2,
  XCircle,
  X,
  Check,
  Eye,
  ExternalLink,
  RefreshCw,
  Clock,
  Coins,
  FileText,
} from "lucide-react";

interface ContentItem {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  type: "ARTICLE" | "VIDEO";
  title: string;
  contentBody?: string;
  mediaUrl?: string;
  wordCount?: number;
  reward: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminFeedback?: string;
  submittedAt: string;
}

export default function AdminContentSubmissionsPage() {
  const [activeTab, setActiveTab] = useState<"ARTICLE" | "VIDEO">("ARTICLE");
  const [submissions, setSubmissions] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Reader / Review Modal
  const [reviewingItem, setReviewingItem] = useState<ContentItem | null>(null);
  const [rewardAmount, setRewardAmount] = useState<number>(50);
  const [feedback, setFeedback] = useState("");

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getContentSubmissions();
      setSubmissions(data);
    } catch (err: any) {
      console.error("Failed to load content submissions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleApprove = async () => {
    if (!reviewingItem) return;
    try {
      setActionLoading(reviewingItem.id);
      const res = await adminApi.approveContentSubmission(reviewingItem.id, {
        reward: rewardAmount,
        feedback: feedback || "চমৎকার কাজ! রিওয়ার্ড ব্যালেন্সে যুক্ত করা হয়েছে।",
      });
      setToastMsg(res?.message || `কন্টেন্ট অনুমোদিত এবং ৳${rewardAmount} ওয়ালেটে ক্রেডিট করা হয়েছে!`);
      setReviewingItem(null);
      await loadSubmissions();
    } catch (err: any) {
      alert(err.message || "অনুমোদন করা যায়নি");
    } finally {
      setActionLoading(null);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("বাতিলের কারণ লিখুন:", "মানসম্মত নয় অথবা কপিরাইট নিয়ম লঙ্ঘন করেছে");
    if (reason === null) return;
    try {
      setActionLoading(id);
      const res = await adminApi.rejectContentSubmission(id, reason);
      setToastMsg(res?.message || "কন্টেন্ট সাবমিশনটি বাতিল করা হয়েছে।");
      if (reviewingItem?.id === id) setReviewingItem(null);
      await loadSubmissions();
    } catch (err: any) {
      alert(err.message || "বাতিল করা যায়নি");
    } finally {
      setActionLoading(null);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const filteredItems = submissions.filter((s) => s.type === activeTab);
  const articleCount = submissions.filter((s) => s.type === "ARTICLE" && s.status === "PENDING").length;
  const videoCount = submissions.filter((s) => s.type === "VIDEO" && s.status === "PENDING").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PenTool className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              কন্টেন্ট রাইটিং ও ভিডিও রিভিউ
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ইউজারদের জমা দেওয়া আর্টিকেল ও প্রমোশনাল ভিডিও যাচাই করে কাস্টম বোনাস রিওয়ার্ড দিন।
          </p>
        </div>
        <button
          type="button"
          onClick={loadSubmissions}
          disabled={loading}
          className="inline-flex items-center gap-1.5 bg-white text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#1e5eb3]" : ""}`} />
          <span>রিফ্রেশ</span>
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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("ARTICLE")}
          className={`pb-3 px-3 text-xs font-bold transition-all relative ${
            activeTab === "ARTICLE"
              ? "text-[#1e5eb3] border-b-2 border-[#1e5eb3]"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            আর্টিকেল সাবমিশন ({submissions.filter((s) => s.type === "ARTICLE").length})
            {articleCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {articleCount}
              </span>
            )}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("VIDEO")}
          className={`pb-3 px-3 text-xs font-bold transition-all relative ${
            activeTab === "VIDEO"
              ? "text-[#1e5eb3] border-b-2 border-[#1e5eb3]"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Video className="w-4 h-4" />
            ভিডিও কন্টেন্ট সাবমিশন ({submissions.filter((s) => s.type === "VIDEO").length})
            {videoCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {videoCount}
              </span>
            )}
          </span>
        </button>
      </div>

      {/* Content Grid */}
      {loading && submissions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-bold">কন্টেন্ট সাবমিশন লোড হচ্ছে...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-bold">কোনো {activeTab === "ARTICLE" ? "আর্টিকেল" : "ভিডিও"} সাবমিশন নেই।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isPending = item.status === "PENDING";
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        {item.type} | {new Date(item.submittedAt).toLocaleDateString("bn-BD")}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-slate-500">
                        লেখক: <span className="font-bold text-slate-800">{item.userName}</span> ({item.phone})
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {item.status === "APPROVED" ? `অনুমোদিত (৳${item.reward})` : item.status === "PENDING" ? "পেন্ডিং" : "বাতিল"}
                    </span>
                  </div>

                  {item.type === "ARTICLE" && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <p className="line-clamp-3">{item.contentBody || "কোনো বডি টেক্সট নেই"}</p>
                      <span className="text-[10px] text-slate-400 block mt-2 font-mono">
                        শব্দ সংখ্যা: {item.wordCount || 0} টি
                      </span>
                    </div>
                  )}

                  {item.type === "VIDEO" && item.mediaUrl && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <a
                        href={item.mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#1e5eb3] font-bold hover:underline flex items-center gap-1.5 break-all"
                      >
                        <span>{item.mediaUrl}</span>
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setReviewingItem(item);
                      setRewardAmount(item.type === "ARTICLE" ? 50 : 100);
                      setFeedback(item.adminFeedback || "");
                    }}
                    className="text-xs font-bold text-[#1e5eb3] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>বিস্তারিত পড়ুন ও রিভিউ করুন</span>
                  </button>

                  {isPending && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={actionLoading === item.id}
                        onClick={() => handleReject(item.id)}
                        className="px-3 py-1 rounded-lg border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-50"
                      >
                        বাতিল
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReviewingItem(item);
                          setRewardAmount(item.type === "ARTICLE" ? 50 : 100);
                        }}
                        className="px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                      >
                        অনুমোদন
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 truncate">
                {reviewingItem.title}
              </h3>
              <button
                type="button"
                onClick={() => setReviewingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">
                  লেখক: <span className="font-bold text-slate-800">{reviewingItem.userName}</span> ({reviewingItem.phone})
                </span>
                <span className="text-slate-500 block">
                  জমা দেওয়ার সময়: {new Date(reviewingItem.submittedAt).toLocaleString("bn-BD")}
                </span>
              </div>

              {reviewingItem.type === "ARTICLE" && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed text-slate-800 max-h-60 overflow-y-auto">
                  {reviewingItem.contentBody}
                </div>
              )}

              {reviewingItem.type === "VIDEO" && reviewingItem.mediaUrl && (
                <div className="p-3 bg-slate-100 rounded-xl">
                  <a
                    href={reviewingItem.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1e5eb3] font-bold hover:underline flex items-center gap-1.5"
                  >
                    <span>ভিডিও ওপেন করুন: {reviewingItem.mediaUrl}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {reviewingItem.status === "PENDING" && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      রিওয়ার্ড টাকা নির্ধারণ করুন (৳):
                    </label>
                    <input
                      type="number"
                      min={5}
                      value={rewardAmount}
                      onChange={(e) => setRewardAmount(Number(e.target.value))}
                      className="w-full font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      অ্যাডমিন মন্তব্য / ফিডব্যাক:
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: অসাধারণ লেখা! নিয়মিত লিখুন।"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {reviewingItem.status === "PENDING" ? (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={actionLoading === reviewingItem.id}
                  onClick={() => handleReject(reviewingItem.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-rose-200 text-rose-700 hover:bg-rose-50"
                >
                  বাতিল করুন
                </button>
                <button
                  type="button"
                  disabled={actionLoading === reviewingItem.id}
                  onClick={handleApprove}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50"
                >
                  অনুমোদন ও ৳{rewardAmount} ক্রেডিট করুন
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setReviewingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700"
                >
                  বন্ধ করুন
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

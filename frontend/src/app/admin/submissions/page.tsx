"use client";

import React, { useState } from "react";
import { useMockStore, TaskSubmission } from "@/lib/mock-store";
import {
  FileCheck,
  Check,
  X,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminSubmissionsPage() {
  const { submissions, approveSubmission, rejectSubmission } = useMockStore();

  const [previewSub, setPreviewSub] = useState<TaskSubmission | null>(null);
  const [rejectingSub, setRejectingSub] = useState<TaskSubmission | null>(null);
  const [reason, setReason] = useState("");

  const handleApprove = (id: string) => {
    approveSubmission(id);
    if (previewSub?.id === id) setPreviewSub(null);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingSub) return;
    rejectSubmission(rejectingSub.id, reason || "স্ক্রিনশট সঠিক নয় বা কাজ সম্পন্ন হয়নি।");
    setRejectingSub(null);
    setReason("");
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-black text-slate-900">
          টাস্ক প্রুফ স্ক্রিনশট রিভিউ কিউ
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          ব্যবহারকারীদের জমা দেওয়া প্রমাণপত্র যাচাই করে রিওয়ার্ড অনুমোদন বা বাতিল করুন
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">স্ক্রিনশট প্রুফ</th>
                <th className="py-3 px-4">ব্যবহারকারী</th>
                <th className="py-3 px-4">টাস্ক</th>
                <th className="py-3 px-4">রিওয়ার্ড</th>
                <th className="py-3 px-4">তারিখ ও সময়</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div
                      onClick={() => setPreviewSub(sub)}
                      className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 cursor-pointer relative group bg-slate-100 flex-shrink-0"
                    >
                      <img
                        src={sub.screenshotUrl}
                        alt="Proof"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {sub.userName}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      ID: {sub.userId}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800">{sub.taskTitle}</span>
                    <span className="block text-[10px] text-slate-500 capitalize">
                      {sub.platform}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-emerald-600 font-sans">
                    ৳ {sub.reward}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-sans">
                    {sub.submittedAt}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        sub.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-700"
                          : sub.status === "PENDING"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {sub.status === "APPROVED" && <CheckCircle2 className="w-3 h-3" />}
                      {sub.status === "PENDING" && <Clock className="w-3 h-3" />}
                      {sub.status === "REJECTED" && <XCircle className="w-3 h-3" />}
                      {sub.status === "APPROVED"
                        ? "অনুমোদিত"
                        : sub.status === "PENDING"
                        ? "অপেক্ষমান"
                        : "বাতিল"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {sub.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApprove(sub.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>অনুমোদন</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectingSub(sub)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>বাতিল</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">নিষ্পন্ন</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {previewSub && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-4 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {previewSub.userName} - {previewSub.taskTitle} (৳ {previewSub.reward})
              </h3>
              <button
                type="button"
                onClick={() => setPreviewSub(null)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="my-3 overflow-hidden rounded-xl border border-slate-200">
              <img
                src={previewSub.screenshotUrl}
                alt="Screenshot Full"
                className="w-full max-h-[60vh] object-contain bg-slate-950"
              />
            </div>
            {previewSub.userNote && (
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg mb-3">
                <span className="font-bold">ইউজার মন্তব্য:</span> {previewSub.userNote}
              </p>
            )}
            {previewSub.status === "PENDING" && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingSub(previewSub);
                    setPreviewSub(null);
                  }}
                  className="bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  বাতিল করুন
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(previewSub.id)}
                  className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  অনুমোদন ও টাকা ক্রেডিট করুন
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingSub && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 mb-1">টাস্ক বাতিলের কারণ</h3>
            <p className="text-xs text-slate-500 mb-3">
              বাতিলের কারণ উল্লেখ করলে ব্যবহারকারী তার হিস্ট্রিতে দেখতে পারবেন।
            </p>
            <form onSubmit={handleConfirmReject} className="flex flex-col gap-3">
              <textarea
                required
                rows={3}
                placeholder="যেমন: স্ক্রিনশটে সাবস্ক্রাইব করা দেখা যাচ্ছে না"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-red-500 text-slate-900"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingSub(null)}
                  className="text-xs font-bold text-slate-500 px-3 py-2 rounded-xl hover:bg-slate-100"
                >
                  ফিরে যান
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow"
                >
                  নিশ্চিত বাতিল করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

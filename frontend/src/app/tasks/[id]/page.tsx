"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore, TaskItem } from "@/lib/mock-store";
import { tasksApi } from "@/lib/api-client";
import {
  ArrowLeft,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  X,
  AlertCircle,
  FileCheck,
  Loader2,
} from "lucide-react";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id as string;
  const { tasks, submitTaskProof } = useMockStore();

  const [task, setTask] = useState<TaskItem | null>(() => {
    return tasks.find((t) => t.id === taskId) || null;
  });
  const [loading, setLoading] = useState<boolean>(!task);
  const [error, setError] = useState<string | null>(null);

  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [userNote, setUserNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Load task from store or fetch live from backend API if direct URL visited
  useEffect(() => {
    const found = tasks.find((t) => t.id === taskId);
    if (found) {
      setTask(found);
      setLoading(false);
      return;
    }

    if (taskId) {
      setLoading(true);
      tasksApi
        .getById(taskId)
        .then((res: any) => {
          const t = res?.data || res;
          if (t && t.id) {
            setTask({
              id: t.id,
              title: t.title,
              platform: (t.platform || "website").toLowerCase() as any,
              reward: Number(t.reward?.amount || (t.rewardMinor ? Number(t.rewardMinor) / 100 : 10)),
              action: t.action || "কাজ করুন",
              description: t.description || "",
              instructions: Array.isArray(t.instructions)
                ? t.instructions
                : ["টাস্কের লিংকে গিয়ে কাজ সম্পন্ন করুন।", "প্রমাণ হিসেবে স্ক্রিনশট সংগ্রহ করুন।", "সঠিক স্ক্রিনশট আপলোড করে সাবমিট করুন।"],
              targetUrl: t.targetUrl || "#",
              requiredPackage: t.requiredPackage || "সকলের জন্য",
              requiresScreenshot: t.requiresScreenshot !== false,
            });
          } else {
            setError("টাস্কটি খুঁজে পাওয়া যায়নি");
          }
        })
        .catch(() => {
          setError("টাস্কটি লোড করা সম্ভব হয়নি");
        })
        .finally(() => setLoading(false));
    }
  }, [taskId, tasks]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setScreenshotPreview(url);
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotPreview || !task) return;

    setSubmitting(true);
    setTimeout(() => {
      submitTaskProof(task.id, screenshotPreview, userNote);
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex flex-col">
      <div className="w-full max-w-lg mx-auto bg-[#eaf5fa] min-h-screen shadow-xl flex flex-col relative border-x border-slate-200/50">
        <Header />

        <main className="flex-1 px-3 pt-3 pb-24 flex flex-col gap-3">
          {/* Back link */}
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>টাস্ক তালিকায় ফিরে যান</span>
          </Link>

          {/* Loading Skeleton */}
          {loading && (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 flex flex-col items-center justify-center text-center my-6 gap-3">
              <Loader2 className="w-8 h-8 text-[#1e5eb3] animate-spin" />
              <p className="text-xs text-slate-500 font-medium">টাস্কের বিবরণ লোড হচ্ছে...</p>
            </div>
          )}

          {/* Error / Not Found View */}
          {!loading && (!task || error) && (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 flex flex-col items-center justify-center text-center my-6 gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                {error || "টাস্কটি খুঁজে পাওয়া যায়নি"}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs">
                টাস্কটির মেয়াদ শেষ হয়ে থাকতে পারে বা সরিয়ে নেওয়া হয়েছে। অন্যান্য টাস্কগুলো দেখুন।
              </p>
              <Link
                href="/tasks"
                className="mt-2 bg-[#1e5eb3] text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xs"
              >
                সব টাস্ক দেখুন
              </Link>
            </div>
          )}

          {/* Task Detail Main View */}
          {!loading && task && (
            <>
              {/* Task Header Card */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {task.platform} টাস্ক
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-0.5">
                      {task.title}
                    </h2>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 font-extrabold text-sm px-3 py-1 rounded-xl font-sans flex-shrink-0">
                    ৳ {task.reward}
                  </div>
                </div>
                {task.description && (
                  <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                    {task.description}
                  </p>
                )}

                {/* External Target Link Button */}
                <a
                  href={task.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0284c7] font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>টাস্ক লিংকে যান</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Instructions List */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col">
                <h3 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#1e5eb3]" />
                  <span>টাস্ক সম্পন্ন করার নিয়মাবলী:</span>
                </h3>
                <div className="flex flex-col gap-2 text-xs text-slate-600">
                  {task.instructions && task.instructions.length > 0 ? (
                    task.instructions.map((inst, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{inst}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">টাস্কের নিয়ম অনুসরণ করে সঠিক প্রুফ প্রদান করুন।</p>
                  )}
                </div>
              </div>

              {/* Screenshot Proof Submission Form */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col">
                <h3 className="text-xs font-bold text-slate-900 mb-2">
                  প্রমাণপত্র (স্ক্রিনশট) জমা দিন
                </h3>

                {submitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center flex flex-col items-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-2" />
                    <h4 className="text-sm font-bold text-emerald-900">
                      টাস্ক প্রুফ সফলভাবে জমা হয়েছে!
                    </h4>
                    <p className="text-xs text-emerald-700 mt-1">
                      অ্যাডমিন এটি পর্যালোচনা করার পর আপনার ওয়ালেটে ৳ {task.reward} যুক্ত করা হবে।
                    </p>
                    <Link
                      href="/tasks"
                      className="mt-4 bg-[#1e5eb3] text-white text-xs font-bold py-2 px-4 rounded-xl inline-block shadow-sm"
                    >
                      আরো টাস্ক দেখুন
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitProof} className="flex flex-col gap-3">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-slate-200 hover:border-[#1e5eb3] rounded-xl p-3 text-center transition-colors bg-slate-50 relative">
                      {screenshotPreview ? (
                        <div className="relative group">
                          <img
                            src={screenshotPreview}
                            alt="Screenshot Preview"
                            className="w-full h-44 object-cover rounded-lg border border-slate-200 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setScreenshotPreview(null)}
                            className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center py-6">
                          <UploadCloud className="w-8 h-8 text-slate-400 mb-1" />
                          <span className="text-xs font-bold text-slate-700">
                            স্ক্রিনশট নির্বাচন করুন
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            PNG, JPG বা WEBP (সর্বোচ্চ ৫ MB)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* User Note */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        অতিরিক্ত মন্তব্য (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: সঠিকভাবে কাজ সম্পন্ন করেছি"
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#1e5eb3] focus:bg-white"
                      />
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={submitting || !screenshotPreview}
                      className="w-full mt-1 bg-[#00a86b] hover:bg-[#059669] text-white font-bold text-xs py-2.5 rounded-xl shadow-md active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
                    >
                      {submitting ? "জমা হচ্ছে..." : "প্রমাণ জমা দিন"}
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

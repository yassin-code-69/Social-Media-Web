"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";
import {
  Flame,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function TasksPage() {
  const { tasks, profile } = useMockStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "সব কাজ" },
    { id: "youtube", label: "YouTube" },
    { id: "facebook", label: "Facebook" },
    { id: "tiktok", label: "TikTok" },
    { id: "website", label: "Website" },
    { id: "video", label: "Video" },
    { id: "captcha", label: "Captcha" },
  ];

  const filteredTasks =
    selectedCategory === "all"
      ? tasks
      : tasks.filter((t) => t.platform === selectedCategory);

  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex flex-col">
      <div className="w-full max-w-lg mx-auto bg-[#eaf5fa] min-h-screen shadow-xl flex flex-col relative border-x border-slate-200/50">
        <Header />

        <main className="flex-1 px-3 pt-3 pb-24 flex flex-col gap-3">
          {/* Daily Task Limit Header */}
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">
                  আজকের টাস্ক লিমিট
                </span>
                <span className="text-[11px] text-slate-500">
                  সম্পন্ন: {profile.completedTasksCount} / ২০টি
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {profile.packageName} সুবিধা
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#1e5eb3] text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Task Feed */}
          <div className="flex flex-col gap-2.5 mt-1">
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400">
                এই ক্যাটাগরিতে বর্তমানে কোনো কাজ নেই।
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center justify-between gap-3 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-700 font-bold uppercase text-xs">
                      {task.platform.slice(0, 2)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug truncate">
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">
                        {task.action}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="bg-sky-50 text-[#0284c7] font-bold text-[11px] px-2 py-0.5 rounded-md font-sans">
                          ৳ {task.reward}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {task.requiredPackage}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/tasks/${task.id}`}
                    className="flex-shrink-0 bg-[#1e5eb3] hover:bg-[#154286] text-white text-xs font-semibold py-2 px-3.5 rounded-xl flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                  >
                    <span>কাজ করুন</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

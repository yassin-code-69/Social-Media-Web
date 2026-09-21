"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ArrowRight, Globe, Youtube, Facebook, Send, Instagram, CheckCircle2, Clock } from "lucide-react";
import { useMockStore, TaskItem } from "@/lib/mock-store";
import { tasksApi } from "@/lib/api-client";

export function PopularTasks() {
  const { tasks: storeTasks, submissions } = useMockStore();
  const [liveTasks, setLiveTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch live tasks from database on mount & sync with store
  useEffect(() => {
    let isMounted = true;
    if (storeTasks && storeTasks.length > 0) {
      setLiveTasks(storeTasks);
    } else {
      setLoading(true);
      tasksApi
        .getAll()
        .then((data: any) => {
          if (!isMounted) return;
          const list = Array.isArray(data) ? data : data?.tasks || [];
          const mapped: TaskItem[] = list.map((t: any) => ({
            id: t.id,
            title: t.title,
            platform: (t.platform || "website").toLowerCase() as any,
            reward: Number(t.reward?.amount || (t.rewardMinor ? Number(t.rewardMinor) / 100 : 10)),
            action: t.action || "কাজ করুন",
            description: t.description || "",
            instructions: Array.isArray(t.instructions) ? t.instructions : ["টাস্ক সম্পন্ন করে স্ক্রিনশট জমা দিন।"],
            targetUrl: t.targetUrl || "#",
            requiredPackage: t.requiredPackage || "সকলের জন্য",
            requiresScreenshot: t.requiresScreenshot !== false,
          }));
          setLiveTasks(mapped);
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [storeTasks]);

  const getPlatformMeta = (platform: string) => {
    const p = (platform || "").toLowerCase();
    if (p.includes("youtube")) {
      return {
        bg: "bg-[#ef4444]",
        icon: <Youtube className="w-5 h-5 text-white" />,
      };
    }
    if (p.includes("facebook") || p.includes("fb")) {
      return {
        bg: "bg-[#1877f2]",
        icon: <Facebook className="w-5 h-5 text-white" />,
      };
    }
    if (p.includes("tiktok")) {
      return {
        bg: "bg-[#000000]",
        icon: (
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.76 1.35-.01 2.61-.84 3.11-2.08.31-.69.41-1.47.4-2.23.03-4.81.01-9.61.01-14.42z" />
          </svg>
        ),
      };
    }
    if (p.includes("telegram")) {
      return {
        bg: "bg-[#0ea5e9]",
        icon: <Send className="w-5 h-5 text-white" />,
      };
    }
    if (p.includes("instagram")) {
      return {
        bg: "bg-gradient-to-tr from-[#f59e0b] via-[#ec4899] to-[#8b5cf6]",
        icon: <Instagram className="w-5 h-5 text-white" />,
      };
    }
    return {
      bg: "bg-[#0284c7]",
      icon: <Globe className="w-5 h-5 text-white" />,
    };
  };

  // Popular sorting: highest rewards first, max 4 items
  const tasksToDisplay = [...liveTasks]
    .sort((a, b) => (b.reward || 0) - (a.reward || 0))
    .slice(0, 4);

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-500 shadow-2xs">
            <Flame className="w-4 h-4 fill-red-500" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            আজকের জনপ্রিয় টাস্ক
          </h3>
        </div>

        <Link
          href="/tasks"
          className="text-xs font-semibold text-[#1e5eb3] hover:text-[#144280] inline-flex items-center gap-1 transition-colors group"
        >
          <span>সব টাস্ক দেখুন</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Task Cards: 4 columns or responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {loading && tasksToDisplay.length === 0 ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-3 border border-slate-100 flex flex-col items-center animate-pulse min-h-[160px]"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-200 mb-2.5" />
              <div className="w-3/4 h-3 bg-slate-200 rounded mb-1.5" />
              <div className="w-1/2 h-2.5 bg-slate-100 rounded mb-3" />
              <div className="w-12 h-4 bg-slate-200 rounded-full mb-3" />
              <div className="w-full h-7 bg-slate-200 rounded-lg" />
            </div>
          ))
        ) : tasksToDisplay.length === 0 ? (
          <div className="col-span-2 sm:col-span-4 bg-white rounded-2xl p-6 text-center text-slate-400 text-xs border border-slate-100">
            বর্তমানে কোনো সক্রিয় টাস্ক নেই। নতুন টাস্ক যোগ করা হলে এখানে প্রদর্শিত হবে।
          </div>
        ) : (
          tasksToDisplay.map((task) => {
            const meta = getPlatformMeta(task.platform);
            const userSub = (submissions || []).find((s) => s.taskId === task.id);
            const isApproved = userSub?.status === "APPROVED";
            const isPending = userSub?.status === "PENDING";

            return (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                title={task.title}
                className="bg-white rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center justify-between hover:shadow-md hover:border-sky-200 transition-all group relative overflow-hidden"
              >
                {/* Platform Icon */}
                <div
                  className={`w-11 h-11 rounded-xl ${meta.bg} flex items-center justify-center shadow-xs mb-2 group-hover:scale-105 transition-transform`}
                >
                  {meta.icon}
                </div>

                {/* Title & Action */}
                <div className="flex flex-col mb-2 w-full min-h-[36px]">
                  <span className="text-xs font-bold text-slate-800 leading-tight line-clamp-2" title={task.title}>
                    {task.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
                    {task.action || "টাস্ক সম্পন্ন করুন"}
                  </span>
                </div>

                {/* Dynamic Status / Reward Badge */}
                <div className="mb-2.5">
                  {isApproved ? (
                    <div className="bg-emerald-50 text-emerald-600 font-bold text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>অনুমোদিত</span>
                    </div>
                  ) : isPending ? (
                    <div className="bg-amber-50 text-amber-600 font-bold text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>পেন্ডিং</span>
                    </div>
                  ) : (
                    <div className="bg-[#e0f2fe] text-[#0284c7] font-bold text-xs px-2.5 py-0.5 rounded-full">
                      ৳ {task.reward}
                    </div>
                  )}
                </div>

                {/* Dynamic Action Button */}
                {isApproved ? (
                  <span className="w-full bg-emerald-600 text-white font-semibold text-xs py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>সম্পন্ন</span>
                  </span>
                ) : isPending ? (
                  <span className="w-full bg-amber-500 text-white font-semibold text-xs py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 shadow-2xs">
                    <Clock className="w-3 h-3" />
                    <span>রিভিউ হচ্ছে</span>
                  </span>
                ) : (
                  <span className="w-full bg-[#1e5eb3] group-hover:bg-[#144280] text-white font-semibold text-xs py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 active:scale-95 transition-all shadow-sm">
                    <span>কাজ করুন</span>
                    <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                  </span>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

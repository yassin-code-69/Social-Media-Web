"use client";

import React from "react";
import { Flame, ArrowRight, Globe } from "lucide-react";

export function PopularTasks() {
  const tasks = [
    {
      id: "yt-1",
      platform: "youtube",
      title: "YouTube ভিডিও",
      action: "২ মিনিট দেখুন",
      reward: "৳ 10",
      iconBg: "bg-[#ef4444]",
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      id: "fb-1",
      platform: "facebook",
      title: "Facebook পেজ",
      action: "লাইক ও ফলো",
      reward: "৳ 8",
      iconBg: "bg-[#1877f2]",
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: "tt-1",
      platform: "tiktok",
      title: "TikTok ভিডিও",
      action: "দেখুন ও লাইক দিন",
      reward: "৳ 12",
      iconBg: "bg-[#000000]",
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.76 1.35-.01 2.61-.84 3.11-2.08.31-.69.41-1.47.4-2.23.03-4.81.01-9.61.01-14.42z" />
        </svg>
      ),
    },
    {
      id: "web-1",
      platform: "web",
      title: "ওয়েবসাইট ভিজিট",
      action: "১ মিনিট ভিজিট",
      reward: "৳ 5",
      iconBg: "bg-[#0284c7]",
      icon: <Globe className="w-5 h-5 text-white" />,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-500">
            <Flame className="w-4 h-4 fill-red-500" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            আজকের জনপ্রিয় টাস্ক
          </h3>
        </div>

        <button
          type="button"
          className="text-xs font-semibold text-[#1e5eb3] hover:text-[#144280] inline-flex items-center gap-1 transition-colors"
        >
          <span>সব টাস্ক দেখুন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Task Cards: 4 columns or horizontally scrollable on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center justify-between hover:shadow-md transition-all group"
          >
            {/* Platform Icon */}
            <div
              className={`w-11 h-11 rounded-xl ${task.iconBg} flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform`}
            >
              {task.icon}
            </div>

            {/* Title & Short instruction */}
            <div className="flex flex-col mb-2 min-h-[38px]">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {task.title}
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                {task.action}
              </span>
            </div>

            {/* Reward Badge */}
            <div className="bg-[#e0f2fe] text-[#0284c7] font-bold text-xs px-2.5 py-0.5 rounded-full mb-2.5">
              {task.reward}
            </div>

            {/* Action CTA Button */}
            <button
              type="button"
              className="w-full bg-[#1e5eb3] hover:bg-[#144280] text-white font-semibold text-xs py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 active:scale-95 transition-all shadow-sm"
            >
              <span>কাজ করুন</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

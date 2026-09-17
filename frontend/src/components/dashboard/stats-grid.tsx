"use client";

import React from "react";
import { CheckSquare, Coins, Users, Star } from "lucide-react";

export function StatsGrid() {
  const stats = [
    {
      id: "tasks",
      icon: CheckSquare,
      iconBg: "bg-[#4f46e5] text-white",
      value: "12",
      label: "সম্পন্ন কাজ",
    },
    {
      id: "earnings",
      icon: Coins,
      iconBg: "bg-[#4338ca] text-white",
      value: "৳ 320",
      label: "মোট আয়",
    },
    {
      id: "referrals",
      icon: Users,
      iconBg: "bg-[#059669] text-white",
      value: "8",
      label: "মোট রেফারেল",
    },
    {
      id: "package",
      icon: Star,
      iconBg: "bg-[#f59e0b] text-white",
      value: "Gold",
      label: "আপনার প্যাকেজ",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
      {stats.map((item) => {
        const IconComponent = item.icon;
        return (
          <div
            key={item.id}
            className="bg-white rounded-xl p-2.5 shadow-[0_2px_6px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-2.5 transition-all hover:shadow-md"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${item.iconBg}`}
            >
              <IconComponent className="w-5 h-5" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight font-sans truncate">
                {item.value}
              </span>
              <span className="text-[11px] font-medium text-slate-500 leading-tight truncate">
                {item.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";
import { Bell, CheckCheck, CheckCircle2, Wallet, Users, Info } from "lucide-react";

export default function NotificationsPage() {
  const { notifications } = useMockStore();
  const [list, setList] = useState(notifications);

  const handleMarkAllRead = () => {
    setList(list.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setList(list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex flex-col">
      <div className="w-full max-w-lg mx-auto bg-[#eaf5fa] min-h-screen shadow-xl flex flex-col relative border-x border-slate-200/50">
        <Header />

        <main className="flex-1 px-3 pt-3 pb-24 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[#1e5eb3]" />
              <span>বিজ্ঞপ্তি (Notifications)</span>
            </h2>
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-xs font-semibold text-[#1e5eb3] hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>সব পড়া হয়েছে</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {list.map((n) => (
              <div
                key={n.id}
                onClick={() => toggleRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  n.read
                    ? "bg-white border-slate-100 opacity-80"
                    : "bg-white border-sky-200 shadow-sm ring-1 ring-sky-300/30"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    n.type === "TASK"
                      ? "bg-emerald-50 text-emerald-600"
                      : n.type === "FINANCE"
                      ? "bg-sky-50 text-sky-600"
                      : n.type === "REFERRAL"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-purple-50 text-purple-600"
                  }`}
                >
                  {n.type === "TASK" && <CheckCircle2 className="w-4 h-4" />}
                  {n.type === "FINANCE" && <Wallet className="w-4 h-4" />}
                  {n.type === "REFERRAL" && <Users className="w-4 h-4" />}
                  {n.type === "SYSTEM" && <Info className="w-4 h-4" />}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#1e5eb3] flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[9px] text-slate-400 mt-1 font-sans">
                    {n.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

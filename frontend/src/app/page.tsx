"use client";

import React from "react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ProfileWalletCard } from "@/components/dashboard/profile-wallet-card";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { PromoHeroBanner } from "@/components/dashboard/promo-hero-banner";
import { QuickActionGrid } from "@/components/dashboard/quick-action-grid";
import { PopularTasks } from "@/components/dashboard/popular-tasks";
import { PromoCards } from "@/components/dashboard/promo-cards";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex flex-col">
      {/* Mobile/App Frame Container */}
      <div className="w-full max-w-lg mx-auto bg-[#eaf5fa] min-h-screen shadow-xl flex flex-col relative border-x border-slate-200/50">
        {/* Top Header */}
        <Header />

        {/* Dashboard Main Content Area */}
        <main className="flex-1 px-2.5 sm:px-3 pt-3 pb-24 flex flex-col gap-3 overflow-y-auto">
          {/* 1. Profile & Wallet Section */}
          <section aria-label="Profile and Wallet">
            <ProfileWalletCard />
          </section>

          {/* 2. Key Stats (4 Cards) */}
          <section aria-label="User Statistics">
            <StatsGrid />
          </section>

          {/* 3. Hero Promotional Banner */}
          <section aria-label="Promotional Banner">
            <PromoHeroBanner />
          </section>

          {/* 4. Quick Action Grid (15 items) */}
          <section aria-label="Quick Actions">
            <QuickActionGrid />
          </section>

          {/* 5. Today's Popular Tasks */}
          <section aria-label="Popular Tasks">
            <PopularTasks />
          </section>

          {/* 6. Promotional Bonus & Referral Dual Cards */}
          <section aria-label="Special Offers">
            <PromoCards />
          </section>
        </main>

        {/* 7. Sticky Bottom Navigation Bar (7 Tabs) */}
        <BottomNav />
      </div>
    </div>
  );
}

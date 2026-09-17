"use client";

import React, { useState } from "react";
import { useMockStore, TaskItem } from "@/lib/mock-store";
import {
  CheckSquare,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  ExternalLink,
  Youtube,
  Facebook,
  Globe,
  Video,
  FileCheck,
  Search,
  Filter,
} from "lucide-react";

export default function AdminTasksPage() {
  const { tasks, createTask, updateTask, deleteTask } = useMockStore();
  const [platformFilter, setPlatformFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<TaskItem["platform"]>("youtube");
  const [reward, setReward] = useState<number>(10);
  const [action, setAction] = useState("");
  const [description, setDescription] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [requiredPackage, setRequiredPackage] = useState("ফ্রি / যেকোনো");
  const [requiresScreenshot, setRequiresScreenshot] = useState(true);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle("");
    setPlatform("youtube");
    setReward(10);
    setAction("ভিডিও দেখুন ও লাইক দিন");
    setDescription("ভিডিওটি দেখে চ্যানেল সাবস্ক্রাইব করুন।");
    setInstructionsText("১. লিংকে ক্লিক করে ভিডিওটি দেখুন।\n২. লাইক ও সাবস্ক্রাইব করুন।\n৩. প্রুফ স্ক্রিনশট আপলোড করুন।");
    setTargetUrl("https://youtube.com");
    setRequiredPackage("ফ্রি / যেকোনো");
    setRequiresScreenshot(true);
    setModalOpen(true);
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setTitle(task.title);
    setPlatform(task.platform);
    setReward(task.reward);
    setAction(task.action);
    setDescription(task.description);
    setInstructionsText(task.instructions.join("\n"));
    setTargetUrl(task.targetUrl);
    setRequiredPackage(task.requiredPackage);
    setRequiresScreenshot(task.requiresScreenshot);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const instructionsList = instructionsText
      .split("\n")
      .map((i) => i.trim())
      .filter(Boolean);

    if (editingTask) {
      updateTask({
        ...editingTask,
        title,
        platform,
        reward,
        action,
        description,
        instructions: instructionsList,
        targetUrl,
        requiredPackage,
        requiresScreenshot,
      });
      setToastMsg(`টাস্ক "${title}" সফলভাবে আপডেট করা হয়েছে!`);
    } else {
      createTask({
        title,
        platform,
        reward,
        action,
        description,
        instructions: instructionsList,
        targetUrl,
        requiredPackage,
        requiresScreenshot,
      });
      setToastMsg(`নতুন টাস্ক "${title}" যোগ করা হয়েছে!`);
    }

    setModalOpen(false);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleDelete = (task: TaskItem) => {
    if (confirm(`আপনি কি "${task.title}" টাস্কটি মুছে ফেলতে চান?`)) {
      deleteTask(task.id);
      setToastMsg(`টাস্কটি মুছে ফেলা হয়েছে।`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (platformFilter !== "ALL" && t.platform !== platformFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.platform.toLowerCase().includes(q);
    }
    return true;
  });

  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case "youtube":
        return <Youtube className="w-4 h-4 text-red-600" />;
      case "facebook":
        return <Facebook className="w-4 h-4 text-blue-600" />;
      case "video":
        return <Video className="w-4 h-4 text-purple-600" />;
      case "website":
        return <Globe className="w-4 h-4 text-emerald-600" />;
      default:
        return <CheckSquare className="w-4 h-4 text-[#1e5eb3]" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">টাস্ক ও আর্নিং ক্যাম্পেইন পরিচালনা</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ইউজারদের জন্য কাজের তালিকা তৈরি, রিওয়ার্ড নির্ধারণ ও নির্দেশনা আপডেট করুন।
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e5eb3] hover:bg-[#184a8f] text-white text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন টাস্ক তৈরি করুন</span>
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

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: "ALL", label: `সকল টাস্ক (${tasks.length})` },
            { id: "youtube", label: "YouTube" },
            { id: "facebook", label: "Facebook" },
            { id: "tiktok", label: "TikTok" },
            { id: "website", label: "Website" },
            { id: "video", label: "Video" },
            { id: "captcha", label: "Captcha" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPlatformFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                platformFilter === tab.id
                  ? "bg-white text-[#1e5eb3] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="টাস্কের নাম বা প্ল্যাটফর্ম খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
          />
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header: Platform & Reward */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0">
                    {getPlatformIcon(task.platform)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{task.title}</h3>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                      {task.platform}
                    </span>
                  </div>
                </div>

                <span className="text-sm font-bold text-emerald-600 font-inter bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  +৳{task.reward}
                </span>
              </div>

              {/* Action summary */}
              <p className="text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {task.action}
              </p>

              {/* Requirements */}
              <div className="space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span>প্রয়োজনীয় স্তর:</span>
                  <span className="font-bold text-slate-700">{task.requiredPackage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>স্ক্রিনশট প্রুফ:</span>
                  <span className={`font-bold ${task.requiresScreenshot ? "text-amber-600" : "text-slate-400"}`}>
                    {task.requiresScreenshot ? "বাধ্যতামূলক" : "প্রয়োজন নেই"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => openEditModal(task)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>সম্পাদনা</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(task)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>মুছুন</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Task Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingTask ? `টাস্ক সম্পাদনা (${editingTask.title})` : "নতুন টাস্ক তৈরি"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">টাস্কের শিরোনাম:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: YouTube ভিডিও দেখুন ও সাবস্ক্রাইব করুন"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">প্ল্যাটফর্ম:</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="facebook">Facebook</option>
                    <option value="tiktok">TikTok</option>
                    <option value="website">Website</option>
                    <option value="video">Video Review</option>
                    <option value="captcha">Captcha</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">রিওয়ার্ড (৳):</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={reward}
                    onChange={(e) => setReward(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">সংক্ষিপ্ত অ্যাকশন বর্ণনা:</label>
                <input
                  type="text"
                  required
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="যেমন: ২ মিনিট দেখুন ও সাবস্ক্রাইব করুন"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">টার্গেট লিংক (URL):</label>
                <input
                  type="text"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ধাপে ধাপে নির্দেশনা (প্রতি লাইনে একটি):
                </label>
                <textarea
                  rows={3}
                  required
                  value={instructionsText}
                  onChange={(e) => setInstructionsText(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="screenCheck"
                  checked={requiresScreenshot}
                  onChange={(e) => setRequiresScreenshot(e.target.checked)}
                  className="rounded text-[#1e5eb3]"
                />
                <label htmlFor="screenCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  কাজ সম্পন্ন করার প্রমাণ হিসেবে স্ক্রিনশট আবশ্যক
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl text-xs font-bold text-white bg-[#1e5eb3] hover:bg-[#184a8f] shadow"
                >
                  {editingTask ? "পরিবর্তন সংরক্ষণ করুন" : "টাস্ক যোগ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

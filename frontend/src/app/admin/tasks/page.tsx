"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api-client";
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
  RefreshCw,
} from "lucide-react";

interface AdminTaskItem {
  id: string;
  title: string;
  platform: string;
  reward: number;
  action: string;
  description: string;
  instructions: string[];
  targetUrl: string;
  requiredPackage: string;
  requiresScreenshot: boolean;
  dailyLimit?: number;
  status: string;
}

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<AdminTaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<AdminTaskItem | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<string>("youtube");
  const [reward, setReward] = useState<number>(10);
  const [action, setAction] = useState("");
  const [description, setDescription] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [requiredPackage, setRequiredPackage] = useState("ফ্রি / যেকোনো");
  const [requiresScreenshot, setRequiresScreenshot] = useState(true);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getTasks();
      setTasks(data);
    } catch (err: any) {
      console.error("Failed to load tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

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

  const openEditModal = (task: AdminTaskItem) => {
    setEditingTask(task);
    setTitle(task.title);
    setPlatform(task.platform.toLowerCase());
    setReward(task.reward);
    setAction(task.action);
    setDescription(task.description);
    setInstructionsText((task.instructions || []).join("\n"));
    setTargetUrl(task.targetUrl);
    setRequiredPackage(task.requiredPackage);
    setRequiresScreenshot(task.requiresScreenshot);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const instructionsList = instructionsText
      .split("\n")
      .map((i) => i.trim())
      .filter(Boolean);

    try {
      setActionLoading("form");
      if (editingTask) {
        await adminApi.updateTask(editingTask.id, {
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
        await adminApi.createTask({
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
      await loadTasks();
    } catch (err: any) {
      alert(err.message || "টাস্ক সংরক্ষণ করতে সমস্যা হয়েছে");
    } finally {
      setActionLoading(null);
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  const handleDelete = async (task: AdminTaskItem) => {
    if (confirm(`আপনি কি "${task.title}" টাস্কটি মুছে ফেলতে চান?`)) {
      try {
        await adminApi.deleteTask(task.id);
        setToastMsg(`টাস্কটি মুছে ফেলা হয়েছে।`);
        await loadTasks();
      } catch (err: any) {
        alert(err.message || "টাস্ক মুছতে সমস্যা হয়েছে");
      } finally {
        setTimeout(() => setToastMsg(null), 3000);
      }
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (platformFilter !== "ALL" && t.platform?.toUpperCase() !== platformFilter.toUpperCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.platform.toLowerCase().includes(q);
    }
    return true;
  });

  const getPlatformIcon = (plat: string) => {
    switch (plat?.toLowerCase()) {
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
            ইউজারদের জন্য কাজের তালিকা তৈরি, রিওয়ার্ড নির্ধারণ ও নির্দেশনা ডাটাবেজে আপডেট করুন।
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadTasks}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-white text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#1e5eb3]" : ""}`} />
            <span>রিফ্রেশ</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1e5eb3] hover:bg-[#184a8f] text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন টাস্ক তৈরি</span>
          </button>
        </div>
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

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: "ALL", label: `সব টাস্ক (${tasks.length})` },
            { id: "YOUTUBE", label: "YouTube" },
            { id: "FACEBOOK", label: "Facebook" },
            { id: "WEBSITE", label: "Website" },
            { id: "VIDEO", label: "Video" },
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
            placeholder="টাস্কের নাম দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
          />
        </div>
      </div>

      {/* Tasks Grid */}
      {loading && tasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-8 h-8 border-3 border-[#1e5eb3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-bold">টাস্ক লোড হচ্ছে...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-bold">কোনো টাস্ক পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {getPlatformIcon(task.platform)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        {task.platform}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{task.title}</h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs font-sans border border-emerald-200">
                    ৳ {task.reward}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>

                {/* Instructions preview */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    নির্দেশনা:
                  </span>
                  {(task.instructions || []).slice(0, 2).map((ins, idx) => (
                    <p key={idx} className="text-[11px] text-slate-600 line-clamp-1">
                      {ins}
                    </p>
                  ))}
                </div>

                {/* Meta details */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>প্যাকেজ: <span className="font-semibold text-slate-800">{task.requiredPackage}</span></span>
                  <span>{task.requiresScreenshot ? "📸 প্রুফ আবশ্যক" : "সরাসরি লিঙ্ক"}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={task.targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[#1e5eb3] hover:underline flex items-center gap-1"
                >
                  লিঙ্ক দেখুন <ExternalLink className="w-3 h-3" />
                </a>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(task)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-[#1e5eb3] hover:bg-slate-100 transition-colors"
                    title="সম্পাদনা"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(task)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                    title="মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingTask ? "টাস্ক সম্পাদনা করুন" : "নতুন টাস্ক তৈরি করুন"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">টাস্কের শিরোনাম:</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ইউটিউব চ্যানেল সাবস্ক্রাইব করুন"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">প্ল্যাটফর্ম:</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="facebook">Facebook</option>
                    <option value="tiktok">TikTok</option>
                    <option value="website">Website</option>
                    <option value="video">Video</option>
                    <option value="content">Content</option>
                    <option value="captcha">Captcha</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">রিওয়ার্ড পরিমাণ (৳):</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={reward}
                    onChange={(e) => setReward(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">অ্যাকশন লেবেল:</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: চ্যানেল সাবস্ক্রাইব করুন"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">টার্গেট ইউআরএল / লিঙ্ক:</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">সংক্ষিপ্ত বিবরণ:</label>
                <textarea
                  rows={2}
                  placeholder="টাস্কের সাধারণ বিবরণ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  নির্দেশনা (প্রতি লাইনে একটি করে পয়েন্ট লিখুন):
                </label>
                <textarea
                  rows={3}
                  value={instructionsText}
                  onChange={(e) => setInstructionsText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">প্রয়োজনীয় প্যাকেজ:</label>
                  <input
                    type="text"
                    value={requiredPackage}
                    onChange={(e) => setRequiredPackage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e5eb3]"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={requiresScreenshot}
                      onChange={(e) => setRequiresScreenshot(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1e5eb3]"
                    />
                    <span>প্রুফ স্ক্রিনশট বাধ্যতামূলক</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "form"}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1e5eb3] hover:bg-[#184a8f] text-white shadow-sm disabled:opacity-50"
                >
                  {editingTask ? "আপডেট সংরক্ষণ করুন" : "টাস্ক যোগ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

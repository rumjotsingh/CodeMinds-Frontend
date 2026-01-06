'use client'

import React, { useState } from "react";
import ProblemsManager from "../../../Component/ProblemsManager";
// import ContestsManager from "./ContestsManager"; // For future feature
import AnnouncementsManager from "../../../Component/AnnouncementsManager";
import ContestManager from '../../../Component/ContestManager';


export default function AdminPanel() {
  const [tab, setTab] = useState("problems");

  // Get tab header info
  const getTabInfo = () => {
    switch(tab) {
      case "problems":
        return { title: "Problems Management", subtitle: "Create, edit, and organize coding problems", icon: "💻" };
      case "contests":
        return { title: "Contests Management", subtitle: "Manage coding competitions and challenges", icon: "🏆" };
      case "announcements":
        return { title: "Announcements", subtitle: "Create and manage platform announcements", icon: "📢" };
      default:
        return { title: "Admin Panel", subtitle: "Welcome to the admin dashboard", icon: "⚙️" };
    }
  };
  const tabInfo = getTabInfo();

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-6 border-b border-[#303030]">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold mb-1">Admin Panel</h1>
            <p className="text-sm text-[#eff1f6bf]">{tabInfo.subtitle}</p>
          </div>
          
          {/* Horizontal Tabs - LeetCode Style */}
          <nav className="flex gap-0 border-b border-[#303030] -mb-px">
            <button
              onClick={() => setTab("problems")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                tab === "problems"
                  ? "border-[#00b8a3] text-[#eff1f6]"
                  : "border-transparent text-[#eff1f6bf] hover:text-[#eff1f6]"
              }`}
            >
              Problems
            </button>
            <button
              onClick={() => setTab("contests")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                tab === "contests"
                  ? "border-[#00b8a3] text-[#eff1f6]"
                  : "border-transparent text-[#eff1f6bf] hover:text-[#eff1f6]"
              }`}
            >
              Contests
            </button>
            <button
              onClick={() => setTab("announcements")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                tab === "announcements"
                  ? "border-[#00b8a3] text-[#eff1f6]"
                  : "border-transparent text-[#eff1f6bf] hover:text-[#eff1f6]"
              }`}
            >
              Announcements
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="py-6">
          {tab === "problems" && <ProblemsManager />}
          {tab === "contests" && <ContestManager />}
          {tab === "announcements" && <AnnouncementsManager />}
        </div>
      </div>
    </div>
  );
}

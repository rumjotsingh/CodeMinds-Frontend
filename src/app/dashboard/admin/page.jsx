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

  const currentTab = getTabInfo();

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col  scrollbar-hide">
      {/* Enhanced Header with Tab Navigation */}
      <header className="bg-white border-b border-[#e3e3e3] shadow-sm flex-shrink-0">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-[#e3e3e3]">
                <span className="text-2xl">{currentTab.icon}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black">{currentTab.title}</h1>
                <p className="text-gray-600 mt-1">{currentTab.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#e3e3e3]">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Admin Panel</p>
                <p className="text-xs text-gray-500">Management Dashboard</p>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <nav className="flex space-x-2">
            <button
              onClick={() => setTab("problems")}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all border ${
                tab === "problems" 
                  ? "bg-black text-white shadow-lg border-[#e3e3e3]" 
                  : "text-gray-700 hover:bg-gray-50 border-[#e3e3e3] hover:shadow-sm"
              }`}
            >
              <span className="mr-3 text-lg">💻</span>
              <span>Problems</span>
            </button>
            <button
              onClick={() => setTab("contests")}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all border ${
                tab === "contests" 
                  ? "bg-black text-white shadow-lg border-[#e3e3e3]" 
                  : "text-gray-700 hover:bg-gray-50 border-[#e3e3e3] hover:shadow-sm"
              }`}
            >
              <span className="mr-3 text-lg">🏆</span>
              <span>Contests</span>
            </button>
            <button
              onClick={() => setTab("announcements")}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all border ${
                tab === "announcements" 
                  ? "bg-black text-white shadow-lg border-[#e3e3e3]" 
                  : "text-gray-700 hover:bg-gray-50 border-[#e3e3e3] hover:shadow-sm"
              }`}
            >
              <span className="mr-3 text-lg">📢</span>
              <span>Announcements</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Content Area - Fixed Height, Scrollable Content */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <div className="h-full overflow-auto p-8">
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e3e3e3] min-h-[600px] p-8 w-full">
              {tab === "problems" && <ProblemsManager />}
              {tab === "contests" && <ContestManager />}
              {tab === "announcements" && <AnnouncementsManager />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      {/* Header with Tab Navigation - Responsive */}
      <header className="bg-card border-b border-border shadow-sm flex-shrink-0">
        <div className="px-4 py-4 md:px-8 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center border border-border">
                <span className="text-2xl">{tabInfo.icon}</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight">{tabInfo.title}</h1>
                <p className="text-muted-foreground text-sm md:text-base">{tabInfo.subtitle}</p>
              </div>
            </div>
            
          </div>
          {/* Tab Navigation - Mobile Scrollable, Desktop Inline */}
          <nav className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setTab("problems")}
              className={`flex items-center px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all border whitespace-nowrap ${
                tab === "problems"
                  ? "bg-primary text-primary-foreground shadow-lg border-border"
                  : "text-foreground hover:bg-muted border-border hover:shadow-sm"
              }`}
            >
              <span className="mr-2 md:mr-3 text-lg">💻</span>
              <span>Problems</span>
            </button>
            <button
              onClick={() => setTab("contests")}
              className={`flex items-center px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all border whitespace-nowrap ${
                tab === "contests"
                  ? "bg-primary text-primary-foreground shadow-lg border-border"
                  : "text-foreground hover:bg-muted border-border hover:shadow-sm"
              }`}
            >
              <span className="mr-2 md:mr-3 text-lg">🏆</span>
              <span>Contests</span>
            </button>
            <button
              onClick={() => setTab("announcements")}
              className={`flex items-center px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all border whitespace-nowrap ${
                tab === "announcements"
                  ? "bg-primary text-primary-foreground shadow-lg border-border"
                  : "text-foreground hover:bg-muted border-border hover:shadow-sm"
              }`}
            >
              <span className="mr-2 md:mr-3 text-lg">📢</span>
              <span>Announcements</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Content Area - Responsive, Scrollable */}
      <main className="flex-1 bg-muted overflow-hidden">
        <div className="h-full overflow-auto p-2 md:p-4">
          <div className="w-full">
            <div className="bg-card rounded-[8px] min-h-[400px] md:min-h-[600px] p-1.5  w-full text-foreground">
              {tab === "problems" && <ProblemsManager />}
              {tab === "contests" && <ContestManager />}
              {tab === "announcements" && <AnnouncementsManager />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

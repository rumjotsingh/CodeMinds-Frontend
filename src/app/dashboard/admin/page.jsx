'use client'

import React, { useState } from "react";
import ProblemsManager from "../../../Component/ProblemsManager";
// import ContestsManager from "./ContestsManager"; // For future feature
import AnnouncementsManager from "../../../Component/AnnouncementsManager";
import ContestManager from '../../../Component/ContestManager';


export default function AdminPanel() {
  const [tab, setTab] = useState("problems");

  // Sidebar button common styles
  const baseButtonClasses = "block w-full text-left px-4 py-2 rounded-md transition-colors duration-150";
  const activeButtonClasses = "bg-blue-600 text-white font-semibold shadow-md";
  const inactiveButtonClasses = "text-gray-700 hover:bg-gray-200";

  // Helper for rendering sidebar button
  function SidebarButton({ id, children }) {
    const isActive = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        className={`${baseButtonClasses} ${isActive ? activeButtonClasses : inactiveButtonClasses}`}
        aria-current={isActive ? "page" : undefined}
        type="button"
      >
        {children}
      </button>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 select-none">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <SidebarButton id="problems">Problems</SidebarButton>
          <SidebarButton id="contests">Contests</SidebarButton>
          <SidebarButton id="announcements">Announcements</SidebarButton>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto min-w-0">
        {tab === "problems" && <ProblemsManager />}
        {tab === "announcements" && <AnnouncementsManager />}
         {tab === "contests" && <ContestManager />}
      </main>
    </div>
  );
}

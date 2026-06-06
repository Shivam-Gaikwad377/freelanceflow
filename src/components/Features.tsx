"use client";
import React from "react";
import { useState } from "react";

type Tabid = "clients" | "projects" | "invoicing";

interface Tab {
  id: Tabid;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: "clients", label: "Client Management", icon: "person" },
  { id: "projects", label: "Project Tracking", icon: "task_alt" },
  { id: "invoicing", label: "Smart Invoicing", icon: "receipt_long" },
];

function ClientsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
      <div className="space-y-md">
        <h3 className="font-headline-md text-headline-md text-on-surface">
          Centralize your client relationships
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Organize all client info in one place. Keep track of contacts,
          communication history, and important documents without hunting through
          emails.
        </p>
        <ul className="space-y-sm">
          {["Unified contact database", "Communication timeline"].map(
            (item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-on-surface font-body-md"
              >
                <span className="material-symbols-outlined text-primary">
                  check
                </span>
                {item}
              </li>
            )
          )}
        </ul>
      </div>

      {/* Mockup */}
      <div className="bg-gradient-to-br from-surface-container-high to-surface-container rounded-xl border border-outline-variant/30 h-64 md:h-80 flex items-center justify-center">
        <div className="w-4/5 h-3/5 bg-white/50 rounded-lg border border-outline-variant/20 shadow-sm p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20" />
            <div className="space-y-2">
              <div className="w-32 h-3 bg-on-surface/10 rounded" />
              <div className="w-24 h-2 bg-on-surface/5 rounded" />
            </div>
          </div>
          <div className="w-full h-2 bg-on-surface/5 rounded" />
          <div className="w-full h-2 bg-on-surface/5 rounded" />
        </div>
      </div>
    </div>
  );
}

function ProjectsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
      <div className="space-y-md">
        <h3 className="font-headline-md text-headline-md text-on-surface">
          Stay ahead of every deadline
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Keep milestones and deadlines on track. Visualize your pipeline,
          manage tasks, and ensure you never miss a deliverable again.
        </p>
        <ul className="space-y-sm">
          {["Kanban & List views", "Milestone tracking"].map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-on-surface font-body-md"
            >
              <span className="material-symbols-outlined text-secondary">
                check
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Mockup */}
      <div className="bg-gradient-to-br from-secondary-container/20 to-surface-container rounded-xl border border-outline-variant/30 h-64 md:h-80 flex items-center justify-center">
        <div className="w-4/5 h-3/5 bg-white/50 rounded-lg border border-outline-variant/20 shadow-sm p-4 flex gap-3">
          <div className="w-1/3 bg-secondary/10 rounded-md" />
          <div className="w-1/3 bg-secondary/10 rounded-md" />
          <div className="w-1/3 bg-secondary/10 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function InvoicingPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
      <div className="space-y-md">
        <h3 className="font-headline-md text-headline-md text-on-surface">
          Automated billing for solo pros
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Get paid faster with automated billing. Create professional invoices,
          track payment status, and send automated reminders effortlessly.
        </p>
        <ul className="space-y-sm">
          {["One-click invoice generation", "Automated payment follow-ups"].map(
            (item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-on-surface font-body-md"
              >
                <span className="material-symbols-outlined text-tertiary">
                  check
                </span>
                {item}
              </li>
            )
          )}
        </ul>
      </div>

      {/* Mockup */}
      <div className="bg-gradient-to-br from-tertiary-container/10 to-surface-container rounded-xl border border-outline-variant/30 h-64 md:h-80 flex items-center justify-center">
        <div className="w-3/5 h-4/5 bg-white/50 rounded-lg border border-outline-variant/20 shadow-sm p-6 space-y-4">
          <div className="flex justify-between">
            <div className="w-12 h-12 rounded bg-tertiary/20" />
            <div className="w-16 h-4 bg-tertiary/10 rounded" />
          </div>
          <div className="space-y-2">
            <div className="w-full h-2 bg-on-surface/5 rounded" />
            <div className="w-full h-2 bg-on-surface/5 rounded" />
          </div>
          <div className="pt-4 border-t border-outline-variant/20">
            <div className="w-20 h-4 bg-on-surface/20 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
const PANELS: Record<Tabid, React.ReactNode> = {
  clients: <ClientsPanel />,
  projects: <ProjectsPanel />,
  invoicing: <InvoicingPanel />,
};
const Features = () => {
  const [activeTab, setActiveTab] = useState<Tabid>("clients");
  const [isVisible, setIsVisible] = useState(true);
  const handleTabClick = (tabId: Tabid) => {
    if (tabId === activeTab) return;
    setIsVisible(false); // 1. fade out first
    setTimeout(() => {
      setActiveTab(tabId); // 2. swap content mid-fade
      setIsVisible(true); // 3. fade back in
    }, 150); // ← delay goes HERE, as 2nd arg to setTimeout
  };

  return (
    <>
      <section
        className="py-xxl px-gutter max-w-container-max mx-auto w-full"
        id="features"
      >
        {/* Heading */}
        <div className="text-center mb-xl max-w-2xl mx-auto ">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">
            Everything you need to run your freelance business
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Simple, powerful tools designed specifically for solo professionals
            to manage their entire workflow.
          </p>
        </div>

        {/* Card */}
        <div className=" max-w-5xl mx-auto bg-surface-container-low rounded-2xl p-md md:p-lg border border-outline-variant/30 shadow-sm">
          {/* Tab Bar */}
          <div
            className="flex flex-wrap justify-center gap-2 mb-lg border-b border-outline-variant/20 pb-4"
            role="tablist"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`
                flex items-center gap-2 px-6 py-3 rounded-full
                font-label-md text-label-md transition-all duration-200
                ${
                  activeTab === tab.id
                    ? "bg-primary text-on-primary shadow-md"
                    : "text-on-surface-variant hover:bg-surface-variant/50"
                }
              `}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div
            className={`relative min-h-[400px] transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {PANELS[activeTab]}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;

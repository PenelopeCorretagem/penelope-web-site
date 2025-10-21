import React from "react";
import { usePropertyTabsViewModel } from "./usePropertyTabsViewModel.js";
import { HeadingView } from "@shared/components/ui/Heading/HeadingView.jsx";
import { Heading } from "lucide-react";

export function PropertyTabsView({ tabs, anchors }) {
  const { activeTab, handleTabClick } = usePropertyTabsViewModel(anchors);

  return (
    <nav className="border-b border-gray-200 bg-brand-white-secondary">
      <div className="mx-auto px-22">
        <ul className="flex justify-start gap-8 py-6 text-lg font-medium min-h-[72px] pl-2">
          {tabs.map((tab, idx) => (
            <li
              key={tab}
              className={`uppercase ${
                activeTab === anchors[idx] ? 'text-brand-pink' : 'text-brand-black'
              }`}
            >
              <HeadingView level={4}
                as="a"
                href={`#${anchors[idx]}`}
                className="hover:text-brand-pink focus:text-brand-pink transition-colors cursor-pointer font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick(anchors[idx]);
                }}
              >
                {tab}
              </HeadingView>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

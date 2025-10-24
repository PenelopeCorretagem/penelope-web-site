import React from "react";
import { usePropertyTabsViewModel } from "./usePropertyTabsViewModel.js";
import { HeadingView } from "@shared/components/ui/Heading/HeadingView.jsx";
import { Heading } from "lucide-react";

export function PropertyTabsView({ tabs, anchors }) {
  const { activeTab, handleTabClick } = usePropertyTabsViewModel(anchors);

  const handleSmoothScroll = (anchor) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      handleTabClick(anchor);
    }
  };

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
              <a
                href={`#${anchors[idx]}`}
                className="hover:text-brand-pink focus:text-brand-pink transition-colors cursor-pointer font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll(anchors[idx]);
                }}
              >
                <HeadingView level={4}>
                  {tab}
                </HeadingView>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

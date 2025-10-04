import React from "react";

export function PropertyTabs({ tabs }) {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <ul className="flex justify-center gap-8 py-3 text-sm font-semibold">
        {tabs.map((tab) => (
          <li
            key={tab}
            className="text-gray-500"
          >
            {tab}
          </li>
        ))}
      </ul>
    </nav>
  );
}

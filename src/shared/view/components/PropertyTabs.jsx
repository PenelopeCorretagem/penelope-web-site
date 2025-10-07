import React, { useState, useEffect } from "react";

export function PropertyTabs({ tabs, anchors }) {
  const [activeTab, setActiveTab] = useState(anchors[0]);

  // Detecta qual seção está visível no viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    // Observa todas as seções
    anchors.forEach((anchor) => {
      const element = document.getElementById(anchor);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [anchors]);

  const handleTabClick = (anchor) => {
    setActiveTab(anchor);
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
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
                className="hover:text-brand-pink focus:text-brand-pink transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick(anchors[idx]);
                  const element = document.getElementById(anchors[idx]);
                  if (element) {
                    const elementPosition = element.offsetTop;
                    window.scrollTo({
                      top: elementPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                {tab}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

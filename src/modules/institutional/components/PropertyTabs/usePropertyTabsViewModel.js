import { useState, useEffect } from "react";

export function usePropertyTabsViewModel(anchors) {
  const [activeTab, setActiveTab] = useState(anchors[0]);

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

    anchors.forEach((anchor) => {
      const element = document.getElementById(anchor);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [anchors]);

  const handleTabClick = (anchor) => {
    setActiveTab(anchor);
    const element = document.getElementById(anchor);
    if (element) {
      const headerOffset = 80; // ajuste conforme a altura do seu header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth'
      });
    }
  };

  return {
    activeTab,
    handleTabClick,
  };
}

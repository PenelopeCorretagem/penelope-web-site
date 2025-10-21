import { useState, useEffect } from "react";

export function usePropertyTabsViewModel(anchors) {
  const [activeTab, setActiveTab] = useState(anchors[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log("Observando elemento:", entry.target.id, "Está visível:", entry.isIntersecting);
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { threshold: 0.3 } // Ajustado para detectar com 30% de visibilidade
    );

    const timeoutId = setTimeout(() => {
      anchors.forEach((anchor) => {
        const element = document.getElementById(anchor);
        if (element) {
          console.log("Adicionando observador para:", anchor);
          observer.observe(element);
        } else {
          console.warn("Elemento não encontrado para o ID:", anchor);
        }
      });
    }, 100); // Aguarda 100ms para garantir que os elementos sejam renderizados

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [anchors]);

  const handleTabClick = (anchor) => {
    console.log("Clicou na aba:", anchor);
    setActiveTab(anchor);
    const element = document.getElementById(anchor);
    if (element) {
      const header = document.querySelector("header");
      const headerOffset = header ? header.offsetHeight : 80; // Calcula dinamicamente a altura do header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      console.log("Scroll para posição:", elementPosition - headerOffset);
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: "smooth",
      });
    } else {
      console.warn("Elemento não encontrado para o clique na aba:", anchor);
    }
  };

  return {
    activeTab,
    handleTabClick,
  };
}

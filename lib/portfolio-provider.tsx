"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import initialData from "@/data/portfolio.json";

export type PortfolioData = typeof initialData;

interface PortfolioContextType {
  data: PortfolioData;
  profile: PortfolioData["profile"];
  experience: PortfolioData["experience"];
  skills: PortfolioData["skills"];
  projects: PortfolioData["projects"];
  blogs: PortfolioData["blogs"];
  refresh: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: initialData,
  profile: initialData.profile,
  experience: initialData.experience,
  skills: initialData.skills,
  projects: initialData.projects,
  blogs: initialData.blogs,
  refresh: async () => {},
});

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(initialData);

  const refresh = async () => {
    try {
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json && json.profile) {
          setData(json);
        }
      }
    } catch (e) {
      console.warn("Could not fetch portfolio updates:", e);
    }
  };

  useEffect(() => {
    refresh();
    try {
      if (typeof window !== "undefined") {
        if (window.location.pathname.startsWith("/blog")) {
          sessionStorage.setItem("portfolio_intro_seen", "true");
          sessionStorage.setItem("portfolio_visited", "true");
          localStorage.setItem("portfolio_intro_seen", "true");
        }
      }
    } catch {}
    const handleFocus = () => refresh();
    window.addEventListener("focus", handleFocus);
    const interval = setInterval(refresh, 4000);
    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        data,
        profile: data.profile || initialData.profile,
        experience: data.experience || initialData.experience,
        skills: data.skills || initialData.skills,
        projects: data.projects || initialData.projects,
        blogs: data.blogs || initialData.blogs,
        refresh,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}

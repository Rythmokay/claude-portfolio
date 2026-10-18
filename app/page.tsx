"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { BlogFeatured } from "@/components/BlogFeatured";
import { Contact } from "@/components/Contact";

const IntroAnimation = dynamic(
  () => import("@/components/IntroAnimation").then((m) => m.IntroAnimation),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <IntroAnimation />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <BlogFeatured />
        <Contact />
      </main>
    </>
  );
}


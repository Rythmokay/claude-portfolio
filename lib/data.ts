export const profile = {
  name: "Rythm Jagga",
  initial: "R",
  cv: "/Rythm_CV.pdf",
  role: "Full Stack Software Engineer",
  location: "Delhi, India",
  email: "rythm.meta@gmail.com",
  tagline:
    "Software Developer building MVC-based Java & Spring Boot web applications, RESTful web services, and production Android & web apps — from early-stage startups to full-scale systems.",
  availability: "Open to full-time roles and select freelance work",
  currently: "Full Stack Software Engineer at Concept Kart",
  socials: {
    github: "https://github.com/Rythmokay/",
    linkedin: "https://linkedin.com/in/rythmjagga/",
  },
  about: [
    "Software Developer pursuing B.Tech in AI & Data Science from Guru Gobind Singh Indraprastha University (2022–2026, CGPA 7.4), with hands-on experience building MVC-based Java and Spring Boot web applications, RESTful web services, and microservice-style back ends, alongside production Android and web apps.",
    "Strong grounding in Java, object-oriented design and service-oriented architecture, with experience across the full development life cycle: requirements, technical design, testing, and delivery. Joined a start-up as the second engineer on its founding tech team and went on to mentor incoming engineers as the team grew.",
    "Communicates clearly with senior developers, founders and clients. Placed 3rd at Hackunicorn Hackathon for building an AI-powered catering web application, and have delivered 3+ freelance client platforms including the Moksh Foundation NGO site and startup dashboards.",
  ],
  stats: [
    { value: "3+", label: "Professional roles" },
    { value: "6+", label: "Projects shipped" },
    { value: "3+", label: "Freelance clients" },
  ],
};

export const experience = [
  {
    period: "May 2026 — Present",
    role: "Full Stack Software Engineer",
    company: "Concept Kart Private Limited",
    summary:
      "Joined as the second engineer on the founding tech team of a start-up; built the company's e-commerce systems from the ground up.",
    points: [
      "Built native Android app MyAudiocular (Kotlin, MVVM) and web platform myaudiocular.com (Next.js) from scratch.",
      "Integrated secure REST APIs / web services for real-time inventory synchronization, media playback, and checkout flows across mobile and web.",
      "Guided and mentored incoming engineers on codebase architecture and delivery practices as the team grew, working closely with the senior developer.",
    ],
  },
  {
    period: "Feb 2026 — May 2026",
    role: "Full Stack Developer (Android & Web)",
    company: "Picturetime Digiplex Pvt. Ltd.",
    summary:
      "Engineered cinema ticket booking workflows with interactive seat selection and row-based mapping for web and mobile platforms.",
    points: [
      "Built cinema ticket booking workflows with interactive seat selection and row-based mapping for picturetime.in and mobile app.",
      "Developed a Next.js administrative portal with event management, category-based filtering, and automated Excel data export.",
      "Verified booking and API flows with Postman for comprehensive API testing.",
    ],
  },
  {
    period: "Aug 2025 — Oct 2025",
    role: "Generative AI Intern",
    company: "Knowledge Excel Private Limited",
    summary:
      "Built Python backend microservices for LLM-driven conversational workflows using LangChain and LangGraph.",
    points: [
      "Built Python backend microservices for LLM-driven conversational workflows using LangChain and LangGraph.",
      "Developed Retrieval-Augmented Generation (RAG) pipelines using Chroma vector database and embedding search, with Pydantic validation.",
    ],
  },
];

export const skillGroups = [
  {
    title: "Java & Back End",
    items: [
      "Java",
      "Spring MVC",
      "Spring Boot",
      "RESTful Web Services",
      "Microservices",
      "Maven",
      "Gradle",
    ],
  },
  {
    title: "Front End",
    items: ["Next.js", "React", "JavaScript (ES6+)", "TypeScript"],
  },
  {
    title: "Mobile",
    items: ["Android", "Kotlin", "Jetpack Compose", "XML Views"],
  },
  {
    title: "Databases & Tooling",
    items: [
      "PostgreSQL",
      "MongoDB",
      "Firebase",
      "Git",
      "GitHub",
      "Docker",
      "AWS",
      "Postman",
    ],
  },
];

export const projects = [
  {
    title: "AI Influencer Management Portal",
    blurb:
      "A portal for the marketing team to manage influencer data with a dashboard tracking product return status, barter vs. paid collaborations, and total spend per influencer. Features AI-based detection of whether a YouTuber has published a review video.",
    tags: ["Next.js", "AI", "Dashboard"],
    live: "https://marketing.conceptkart.co.in",
    repo: "#",
  },
  {
    title: "Asset Allocation & HRMS Portal",
    blurb:
      "Built an asset allocation portal and project management portal, integrated into a Human Resource Management System with role-based dashboards, employee records, activity logs, and automated reminders for birthdays and company events.",
    tags: ["Next.js", "HRMS", "Role-based Access"],
    live: "https://hrms.conceptkart.co.in",
    repo: "#",
  },
  {
    title: "Leo: In-Store Product Assistant",
    blurb:
      "A chatbot for Concept Kart's offline store where customers search products, ask for specifications, check real-time stock availability, and compare products side by side.",
    tags: ["AI", "Chatbot", "Real-time"],
    live: "https://leo.conceptkart.co.in",
    repo: "#",
  },
  {
    title: "Hackunicorn AI Catering App",
    blurb:
      "An AI-powered catering web application that placed 3rd at the Hackunicorn Hackathon (2023). Built to streamline catering operations using intelligent automation.",
    tags: ["AI", "Hackathon", "Web App"],
    live: "#",
    repo: "#",
  },
];

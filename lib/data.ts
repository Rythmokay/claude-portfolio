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

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  featured?: boolean;
  content: {
    intro: string[];
    sections: {
      heading: string;
      paragraphs: string[];
      code?: {
        language: string;
        snippet: string;
        caption?: string;
      };
      quote?: string;
    }[];
    conclusion: string;
  };
}

export const blogs: BlogPost[] = [
  {
    slug: "writing-software-like-prose",
    title: "Writing Software Like Prose: The Architecture of Empathy",
    subtitle:
      "Why the most resilient distributed systems are built not on clever syntax, but on lucid prose and clear domain boundaries.",
    date: "October 18, 2026",
    readTime: "5 min read",
    tags: ["Architecture", "Clean Code", "Spring Boot", "System Design"],
    featured: true,
    excerpt:
      "Code is read twenty times more often than it is written. When we treat APIs, domain boundaries, and service layers as narrative chapters rather than mechanical instructions, systems become simpler to scale, debug, and mentor.",
    content: {
      intro: [
        "In his seminal 1984 paper on Literate Programming, Donald Knuth proposed a radical shift in perspective: instead of imagining that our main task is instructing a computer what to do, we should concentrate on explaining to human beings what we want a computer to do.",
        "Over four decades later, in an era dominated by sprawling microservices, distributed queues, and autonomous deployment pipelines, Knuth's premise feels more urgent than ever. Code is read twenty times more frequently than it is authored. Every cryptic variable, every tangled ternary expression, and every leaky domain abstraction extracts an invisible tax from the next engineer who opens the repository at 2 AM.",
      ],
      sections: [
        {
          heading: "1. The Grammar of Domain Boundaries",
          paragraphs: [
            "In literature, syntax exists to serve clarity. The same applies to enterprise software architecture. When designing MVC backends in Java and Spring Boot, we are not merely assembling controllers and data repositories; we are authoring a domain vocabulary.",
            "Consider a billing workflow. A procedural mindset dumps status updates, tax calculations, and database calls into a single eight-hundred-line service method. A narrative mindset, conversely, speaks in active, immutable sentences. The domain model reads like a story:",
          ],
          code: {
            language: "java",
            caption: "Expressive domain modeling with fluent intent in Spring Boot",
            snippet: `@Transactional
public OrderReceipt finalizeCheckout(CheckoutCommand command) {
    CustomerAccount customer = accounts.requireActive(command.customerId());
    ShoppingCart cart = carts.findPending(command.cartId());

    PaymentAuthorization payment = paymentGateway.authorize(
        customer.billingProfile(),
        cart.calculateTotal()
    );

    Order order = Order.createFrom(cart)
        .attachPayment(payment)
        .assignTrackingNumber(inventory.allocateStock(cart.items()));

    orders.save(order);
    eventPublisher.publish(new OrderCompletedEvent(order.id()));

    return OrderReceipt.from(order);
}`,
          },
          paragraphs: [
            "Notice how the code above does not require inline comments. The method names are active verbs; the domain models are distinct nouns. An incoming developer or a product lead can follow the logical flow without needing to decrypt the underlying database schema.",
          ],
        },
        {
          heading: "2. Cohesion over Cleverness",
          quote:
            "Clever code is a flex for the author; clear code is a gift to the team.",
          paragraphs: [
            "Early in my engineering journey, joining a startup as the second engineer taught me an irreplaceable lesson: clever abstractions often turn into technical debt. When you mentor incoming engineers and watch them interact with your codebase for the first time, you quickly discover that unvarnished simplicity beats hyper-generic metaprogramming every single time.",
            "A well-structured service should feel like a book chapter: it establishes its context, introduces its actors, carries out a single cohesive responsibility, and cleanly exits.",
          ],
        },
        {
          heading: "3. Interfaces as Contracts of Dialogue",
          paragraphs: [
            "Whether you are shipping a RESTful web service for web clients or exposing endpoints to an Android Kotlin application, API design is fundamentally an act of communication. Predictable error responses, idempotent mutations, and strict schemas are the punctuation marks of modern engineering.",
            "When our systems communicate with precision and grace, the software doesn't just run better — it allows the humans building it to move faster and build with confidence.",
          ],
        },
      ],
      conclusion:
        "Building software like prose isn't about writing essays inside source files. It is about respecting the cognitive load of everyone who will touch your work tomorrow. When you prioritize clarity, empathy, and deliberate architecture, the software inevitably stands the test of time.",
    },
  },
];


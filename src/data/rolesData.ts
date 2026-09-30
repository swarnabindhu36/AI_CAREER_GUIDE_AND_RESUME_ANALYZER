import { CareerIntelligence, CareerRoadmap, UserCareerProfile, ATSAnalysis } from '../types';

export interface PredefinedRole {
  id: string;
  title: string;
  industry: string;
  demandIndex: 'Very High' | 'High' | 'Growing';
  medianSalary: string;
  salaryRange: { min: string; median: string; max: string; currency: string };
  essentialSkills: string[];
  recommendedTools: string[];
  description: string;
  sampleResume: string;
  sampleJobDescription: string;
  sampleProfile: UserCareerProfile;
}

export const PREDEFINED_ROLES: PredefinedRole[] = [
  {
    id: 'fullstack-engineer',
    title: 'Full Stack Software Engineer',
    industry: 'Cloud & Web Platforms',
    demandIndex: 'Very High',
    medianSalary: '$135,000',
    salaryRange: { min: '$105,000', median: '$135,000', max: '$180,000', currency: 'USD' },
    essentialSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'RESTful APIs', 'Docker', 'System Design'],
    recommendedTools: ['Git', 'Vite', 'Tailwind CSS', 'Redis', 'AWS / GCP', 'Jest', 'CI/CD'],
    description: 'Designs and builds modern full-stack web applications with high performance, secure APIs, and responsive design systems.',
    sampleProfile: {
      fullName: 'Alex Chen',
      currentRole: 'Junior Frontend Developer',
      targetRole: 'Full Stack Software Engineer',
      yearsExperience: 2,
      weeklyHours: 15,
      currentSkills: ['JavaScript', 'React', 'HTML/CSS', 'Basic Node.js', 'Git'],
      targetCompanies: 'Vercel, Stripe, Figma, Datadog',
      resumeText: `ALEX CHEN
San Francisco, CA · alex.chen@example.com · github.com/alexchen · linkedin.com/in/alexchen

PROFESSIONAL SUMMARY
Frontend developer with 2 years of experience building modern React web interfaces. Seeking to transition into a Full-Stack Engineer role with expertise in TypeScript, distributed backend services, and scalable database architecture.

WORK EXPERIENCE
Junior Frontend Developer | CloudPeak Solutions | 2023 - Present
• Built customer-facing dashboard features using React, Vite, and Tailwind CSS for 45,000 monthly active users.
• Worked on improving site performance and reduced bundle size by 28% through code splitting and tree shaking.
• Collaborated with backend developers to integrate REST APIs and handle error states gracefully.
• Wrote unit tests in Vitest covering 75% of critical user authentication flows.

Software Engineering Intern | NextWave Tech | 2022 - 2023
• Developed internal tools for customer support agents using JavaScript and Express.
• Fixed UI bugs and responsive design inconsistencies across desktop and mobile browsers.
• Participated in daily agile standups and bi-weekly sprint reviews.

PROJECTS
DevPulse - Real-time Collaborative Task Board
• Created full-stack Kanban application using React, Express, PostgreSQL, and WebSockets.
• Implemented drag-and-drop task reordering with optimistic UI updates.

EDUCATION
B.S. in Computer Science | University of California, Davis | 2019 - 2023

SKILLS
Languages: JavaScript (ES6+), TypeScript, SQL, HTML5, CSS3
Frameworks & Libraries: React, Node.js, Express, Tailwind CSS, Jest
Tools: Git, Docker, Postman, Linux, PostgreSQL`,
      targetJobDescription: `We are looking for a Full Stack Software Engineer to join our core product team.
Responsibilities:
- Build high-throughput REST and GraphQL APIs using Node.js and TypeScript.
- Architect relational database schemas in PostgreSQL with connection pooling and query optimization.
- Develop interactive, resilient frontend applications using React and Tailwind CSS.
- Containerize services with Docker and manage deployment pipelines with GitHub Actions.
- Collaborate across cross-functional teams to design robust distributed systems.

Requirements:
- 2+ years of experience with TypeScript / JavaScript in production.
- Strong proficiency with React, Node.js, and relational databases (PostgreSQL / MySQL).
- Solid grasp of REST API architecture, caching (Redis), and asynchronous queuing.
- Experience with Docker, CI/CD pipelines, and cloud environments (AWS / GCP).
- Excellent communication and systematic problem-solving skills.`
    },
    sampleResume: `ALEX CHEN\nSan Francisco, CA · alex.chen@example.com · github.com/alexchen\n\nFrontend developer with 2 years of experience...`,
    sampleJobDescription: `Full Stack Engineer job description with Node.js, TypeScript, PostgreSQL, and React requirements.`
  },
  {
    id: 'data-scientist-ml',
    title: 'Data Scientist & ML Engineer',
    industry: 'Applied AI & Analytics',
    demandIndex: 'Very High',
    medianSalary: '$148,000',
    salaryRange: { min: '$115,000', median: '$148,000', max: '$195,000', currency: 'USD' },
    essentialSkills: ['Python', 'SQL', 'PyTorch / TensorFlow', 'Scikit-learn', 'Feature Engineering', 'Statistical Modeling', 'LLM Prompt Engineering'],
    recommendedTools: ['Pandas', 'NumPy', 'MLflow', 'Docker', 'PostgreSQL', 'Jupyter', 'Weights & Biases'],
    description: 'Develops predictive machine learning models, statistical pipelines, and generative AI integrations to unlock deep business insights.',
    sampleProfile: {
      fullName: 'Priya Sharma',
      currentRole: 'Business Data Analyst',
      targetRole: 'Data Scientist & ML Engineer',
      yearsExperience: 2,
      weeklyHours: 20,
      currentSkills: ['Python', 'SQL', 'Tableau', 'Pandas', 'Basic Machine Learning', 'Excel'],
      targetCompanies: 'Anthropic, Scale AI, Snowflake, DoorDash',
      resumeText: `PRIYA SHARMA
New York, NY · priya.sharma@example.com · github.com/priyadata · linkedin.com/in/priyasharma

SUMMARY
Analytical data practitioner with 2 years analyzing consumer behavior datasets. Proficient in Python, SQL, and predictive modeling with a strong background in probability, statistics, and machine learning pipeline development.

EXPERIENCE
Data Analyst | Meridian Retail Analytics | 2023 - Present
• Designed SQL ETL scripts querying 12M+ transactional records daily across Snowflake data warehouse.
• Built customer churn prediction model using Python (Scikit-Learn, XGBoost) achieving 82% ROC-AUC.
• Automated weekly executive reporting dashboards in Tableau, saving 6 analyst hours weekly.
• Conducted A/B tests on promotional landing pages, measuring statistically significant 4.2% lift in conversion.

Junior Analyst | FinVantage Research | 2022 - 2023
• Cleaned and normalized messy financial market datasets with Pandas and NumPy.
• Formulated exploratory data visualizations highlighting trend anomalies for portfolio managers.

PROJECTS
Customer Sentiment & Topic Analyzer
• Fine-tuned Hugging Face transformer model to classify 50k customer support tickets with 91% F1-score.
• Deployed FastAPI inference endpoint containerized with Docker on Google Cloud Run.

EDUCATION
B.S. in Applied Mathematics & Statistics | New York University | 2018 - 2022

SKILLS
Languages: Python, SQL, R
Libraries: Pandas, NumPy, Scikit-learn, PyTorch, Matplotlib, Seaborn
Databases & Cloud: Snowflake, PostgreSQL, Google Cloud Platform, Docker`,
      targetJobDescription: `Seeking a Data Scientist & Machine Learning Engineer to build algorithmic models and production inference pipelines.
Key Qualifications:
- Proficiency in Python, SQL, and modern machine learning frameworks (PyTorch, Scikit-learn).
- Proven experience deploying models via REST endpoints (FastAPI / Flask) and Docker.
- Strong knowledge of supervised/unsupervised learning, hypothesis testing, and feature store architectures.
- Experience with LLM integrations, embeddings, and prompt optimization is a major plus.`
    },
    sampleResume: `PRIYA SHARMA\nNew York, NY · priya.sharma@example.com...`,
    sampleJobDescription: `Data Scientist & ML Engineer job description.`
  },
  {
    id: 'product-manager',
    title: 'Associate Product Manager',
    industry: 'B2B & Consumer Tech',
    demandIndex: 'High',
    medianSalary: '$128,000',
    salaryRange: { min: '$95,000', median: '$128,000', max: '$165,000', currency: 'USD' },
    essentialSkills: ['Product Strategy', 'User Research', 'Agile / Scrum', 'Data-Informed Prioritization', 'Wireframing', 'PRD Writing', 'A/B Testing'],
    recommendedTools: ['Figma', 'Linear / Jira', 'Mixpanel', 'Notion', 'Amplitude', 'SQL'],
    description: 'Leads cross-functional discovery, defines product requirements, and aligns engineering, design, and business goals to deliver user value.',
    sampleProfile: {
      fullName: 'Marcus Vance',
      currentRole: 'Technical Project Coordinator',
      targetRole: 'Associate Product Manager',
      yearsExperience: 3,
      weeklyHours: 12,
      currentSkills: ['Project Management', 'Jira', 'User Interviews', 'SQL Basics', 'Stakeholder Management'],
      targetCompanies: 'Atlassian, Notion, Miro, Airbnb',
      resumeText: `MARCUS VANCE
Austin, TX · marcus.vance@example.com · linkedin.com/in/marcusvance

SUMMARY
User-centric product thinker with 3 years leading engineering project cycles, sprint planning, and user feedback synthesis. Looking to drive product discovery and roadmaps as an Associate Product Manager.

EXPERIENCE
Technical Project Coordinator | Apex Enterprise Apps | 2022 - Present
• Spearheaded 14 two-week sprint cycles for 8-engineer team, reducing milestone slip rate from 22% to 4%.
• Authored 18 comprehensive Product Requirement Documents (PRDs) detailing user personas and acceptance criteria.
• Conducted 30+ qualitative customer discovery interviews to identify friction in onboarding workflow.
• Partnered with design lead to prototype onboarding redesign, yielding 16% increase in 14-day user activation.

Operations Associate | Horizon SaaS | 2021 - 2022
• Monitored support ticket volume and synthesized top 5 feature requests for product leadership.
• Tracked cohort retention curves in Mixpanel to evaluate feature adoption rates.

EDUCATION
B.A. in Economics & Communication | University of Texas at Austin | 2017 - 2021

SKILLS
Product: Product Discovery, User Research, User Stories, Roadmapping, PRD Writing, Usability Testing
Methodologies: Agile, Scrum, Kanban
Tools: Jira, Linear, Figma, Amplitude, Notion, SQL`,
      targetJobDescription: `We are hiring an Associate Product Manager to shape the future of our enterprise collaboration suite.
Role Requirements:
- Translate customer problems into crisp Product Requirement Documents (PRDs) with clear metrics.
- Prioritize feature backlog using data analytics and qualitative customer feedback.
- Collaborate daily with software engineers and product designers in an agile environment.
- Formulate hypotheses and design A/B experiments to maximize user activation and retention.`
    },
    sampleResume: `MARCUS VANCE\nAustin, TX · marcus.vance@example.com...`,
    sampleJobDescription: `Associate Product Manager job description.`
  }
];

export const FALLBACK_CAREER_ANALYSIS: CareerIntelligence = {
  targetRole: 'Full Stack Software Engineer',
  matchScore: 78,
  marketDemand: 'Very High',
  salaryRange: {
    min: '$105,000',
    median: '$135,000',
    max: '$180,000',
    currency: 'USD'
  },
  executiveSummary: 'Your strong foundation in modern React and frontend architecture positions you well for a full-stack transition. The primary gap lies in backend systems depth (PostgreSQL schema optimization, connection pooling, and Dockerized microservices). Closing these gaps will elevate you into top-tier compensation brackets.',
  coreStrengths: [
    'Component-driven frontend architecture with React & TypeScript',
    'Proven production impact (28% bundle reduction for 45k users)',
    'Strong testing mindset with automated unit test coverage',
    'Clean git workflow and agile cross-functional collaboration'
  ],
  prioritySkillGaps: [
    {
      skill: 'PostgreSQL & Database Design',
      category: 'Technical',
      currentLevel: 'Beginner',
      targetLevel: 'Proficient',
      urgency: 'Critical',
      estimatedHoursToLearn: 18,
      recommendedResource: 'The Art of PostgreSQL & Official PostgreSQL Docs'
    },
    {
      skill: 'Docker Containerization & CI/CD',
      category: 'Tooling',
      currentLevel: 'None',
      targetLevel: 'Intermediate',
      urgency: 'High',
      estimatedHoursToLearn: 12,
      recommendedResource: 'Docker Deep Dive & GitHub Actions Workflow Mastery'
    },
    {
      skill: 'Distributed Systems & Caching (Redis)',
      category: 'Domain',
      currentLevel: 'Beginner',
      targetLevel: 'Intermediate',
      urgency: 'High',
      estimatedHoursToLearn: 10,
      recommendedResource: 'Redis University & System Design Primer'
    },
    {
      skill: 'RESTful API Standards & Error Handling',
      category: 'Technical',
      currentLevel: 'Intermediate',
      targetLevel: 'Proficient',
      urgency: 'Recommended',
      estimatedHoursToLearn: 8,
      recommendedResource: 'API Design Patterns (Manning Publications)'
    }
  ],
  progressionPath: [
    {
      stage: 'Phase 1: Backend Foundation (Days 1-10)',
      timeframe: 'Weeks 1-2',
      focus: 'Node.js/Express with TypeScript, relational schemas, indexing, and Docker setup.'
    },
    {
      stage: 'Phase 2: Full-Stack Capstone (Days 11-20)',
      timeframe: 'Weeks 2-3',
      focus: 'Build high-concurrency app with Redis cache, rate limiting, and automated CI/CD.'
    },
    {
      stage: 'Phase 3: ATS Optimization & Outreach (Days 21-30)',
      timeframe: 'Weeks 4+',
      focus: 'Resume quantification with XYZ metrics, STAR interview prep, and direct hiring manager outreach.'
    }
  ],
  strategicAdvice: 'Hiring managers for Full-Stack roles look for candidates who can take ownership from database migration down to responsive UI component. In your resume and portfolio, highlight backend architecture decisions and quantify the throughput or latency outcomes.'
};

export const FALLBACK_ROADMAP: CareerRoadmap = {
  role: 'Full Stack Software Engineer',
  weeklyHours: 15,
  totalDays: 30,
  overallStrategy: 'A targeted 30-day intensive curriculum designed to transform existing frontend competency into full-stack backend mastery, capped with a production-grade system and ATS-tailored resume overhaul.',
  weeks: [
    {
      weekNumber: 1,
      theme: 'Core Backend & Relational Database Architecture',
      weeklyGoal: 'Master relational schema modeling, SQL query optimization, and TypeScript backend APIs.',
      milestoneProject: 'Containerized RESTful Service with PostgreSQL and Migration Tooling',
      days: [
        {
          day: 1,
          title: 'Node.js & TypeScript Backend Setup',
          description: 'Set up strict tsconfig, Express server with structured routes, controllers, and typed middleware.',
          estimatedMinutes: 90,
          category: 'Learning',
          deliverable: 'Running boilerplate with centralized error handler and request validator.',
          resourceName: 'TypeScript Express Best Practices',
          resourceLink: 'https://expressjs.com'
        },
        {
          day: 2,
          title: 'PostgreSQL Relational Schema Design',
          description: 'Design a multi-tenant relational schema with primary/foreign keys, unique constraints, and enum types.',
          estimatedMinutes: 90,
          category: 'Building',
          deliverable: 'SQL migration scripts covering 5 connected tables with indexing strategy.',
          resourceName: 'PostgreSQL Official Docs',
          resourceLink: 'https://www.postgresql.org/docs/'
        },
        {
          day: 3,
          title: 'Connection Pooling & Query Optimization',
          description: 'Implement connection pooling via pg/node-postgres or ORM. Benchmark query execution plans with EXPLAIN ANALYZE.',
          estimatedMinutes: 75,
          category: 'Learning',
          deliverable: 'Pool connection utility with latency telemetry and benchmark logs.',
          resourceName: 'PostgreSQL Indexing Deep Dive',
          resourceLink: 'https://use-the-index-luke.com'
        },
        {
          day: 4,
          title: 'REST API Authentication with JWT & HTTP-Only Cookies',
          description: 'Build secure authentication flow with bcrypt password hashing, refresh tokens, and CSRF protection.',
          estimatedMinutes: 100,
          category: 'Building',
          deliverable: 'Tested login/register/refresh endpoints with automated Jest test suite.',
          resourceName: 'OWASP Authentication Cheat Sheet',
          resourceLink: 'https://cheatsheetseries.owasp.org'
        },
        {
          day: 5,
          title: 'Docker Containerization for Local Dev',
          description: 'Write Dockerfile and docker-compose.yml running app service and PostgreSQL database with persistent volume.',
          estimatedMinutes: 80,
          category: 'Building',
          deliverable: 'Single command `docker-compose up` booting full local database and backend.',
          resourceName: 'Docker Compose Guide',
          resourceLink: 'https://docs.docker.com/compose/'
        },
        {
          day: 6,
          title: 'Week 1 Review & Architecture Benchmark',
          description: 'Review code structure, document API contracts in Swagger/OpenAPI, and refactor code smells.',
          estimatedMinutes: 60,
          category: 'Portfolio',
          deliverable: 'Completed GitHub repository for Week 1 backend starter.',
          resourceName: 'OpenAPI Specification Standard',
          resourceLink: 'https://swagger.io/specification/'
        },
        {
          day: 7,
          title: 'Rest & Strategic Career Reading',
          description: 'Study system design articles on caching strategies and high-concurrency data models.',
          estimatedMinutes: 45,
          category: 'Learning',
          deliverable: 'Personal summary notes on cache invalidation patterns.',
          resourceName: 'System Design Primer',
          resourceLink: 'https://github.com/donnemartin/system-design-primer'
        }
      ]
    },
    {
      weekNumber: 2,
      theme: 'Advanced Systems, Caching & Concurrency',
      weeklyGoal: 'Integrate Redis caching, rate limiting, asynchronous queues, and automated test coverage.',
      milestoneProject: 'High-Throughput Analytics & Queue Processing Engine',
      days: [
        {
          day: 8,
          title: 'Redis Caching & Session Management',
          description: 'Integrate Redis for in-memory response caching and cache-aside query pattern.',
          estimatedMinutes: 90,
          category: 'Building',
          deliverable: 'Cached endpoints reducing p95 database query latency from 85ms to 4ms.',
          resourceName: 'Redis University Cache Patterns',
          resourceLink: 'https://redis.io'
        },
        {
          day: 9,
          title: 'API Rate Limiting & Security Headers',
          description: 'Implement sliding window rate limiting using Redis and configure Helmet security headers.',
          estimatedMinutes: 75,
          category: 'Building',
          deliverable: 'Custom middleware preventing DDoS and brute force credential attacks.',
          resourceName: 'Express Rate Limit & Security',
          resourceLink: 'https://helmetjs.github.io'
        },
        {
          day: 10,
          title: 'Asynchronous Background Jobs with BullMQ',
          description: 'Set up worker threads and background queues for email dispatch, file processing, and report exports.',
          estimatedMinutes: 100,
          category: 'Building',
          deliverable: 'Asynchronous job producer and consumer with retry mechanisms.',
          resourceName: 'BullMQ Guide',
          resourceLink: 'https://docs.bullmq.io'
        },
        {
          day: 11,
          title: 'Integration Testing with Supertest & Testcontainers',
          description: 'Spin up real ephemeral PostgreSQL instance inside test runners for end-to-end integration verification.',
          estimatedMinutes: 90,
          category: 'Building',
          deliverable: 'Automated test suite with >80% code coverage.',
          resourceName: 'Testcontainers Node.js',
          resourceLink: 'https://testcontainers.com'
        },
        {
          day: 12,
          title: 'GitHub Actions CI/CD Pipeline',
          description: 'Configure automated pipeline running linter, typecheck, unit tests, and Docker image build on every push.',
          estimatedMinutes: 75,
          category: 'Building',
          deliverable: 'Green CI workflow badge in repo README.',
          resourceName: 'GitHub Actions Documentation',
          resourceLink: 'https://docs.github.com/actions'
        },
        {
          day: 13,
          title: 'Deploy to Cloud (Render / Fly.io / GCP)',
          description: 'Deploy containerized web service and managed database to cloud provider with HTTPS and environment secrets.',
          estimatedMinutes: 90,
          category: 'Portfolio',
          deliverable: 'Live production URL with health-check endpoint responding 200 OK.',
          resourceName: 'Fly.io Launch Guide',
          resourceLink: 'https://fly.io/docs/'
        },
        {
          day: 14,
          title: 'Week 2 Review & Capstone Checkpoint',
          description: 'Measure system performance with Apache Bench or k6 load tests. Document results in README.',
          estimatedMinutes: 60,
          category: 'Portfolio',
          deliverable: 'Performance benchmark graphs included in project repository.',
          resourceName: 'k6 Load Testing',
          resourceLink: 'https://k6.io'
        }
      ]
    },
    {
      weekNumber: 3,
      theme: 'Frontend Integration & Capstone Showcase',
      weeklyGoal: 'Connect backend to a polished React frontend, handle optimistic updates, and polish live demo.',
      milestoneProject: 'Full-Stack SaaS Product with Live Demo & System Diagram',
      days: [
        {
          day: 15,
          title: 'Type-Safe API Client (TanStack Query / tRPC)',
          description: 'Build shared TypeScript types between backend models and frontend client for end-to-end type safety.',
          estimatedMinutes: 90,
          category: 'Building',
          deliverable: 'Type-safe custom hooks with automated caching and background refetching.',
          resourceName: 'TanStack Query Docs',
          resourceLink: 'https://tanstack.com/query'
        },
        {
          day: 16,
          title: 'Optimistic UI & Real-Time Sync',
          description: 'Implement optimistic updates for task reordering and instant state transitions with rollback on error.',
          estimatedMinutes: 90,
          category: 'Building',
          deliverable: 'Zero-latency interaction experience on all mutations.',
          resourceName: 'React State Management Best Practices',
          resourceLink: 'https://react.dev'
        },
        {
          day: 17,
          title: 'Production Logging & Sentry Observability',
          description: 'Add structured JSON logging with Pino and capture unhandled exceptions with Sentry.',
          estimatedMinutes: 60,
          category: 'Building',
          deliverable: 'Real-time alert configured for any 500-series server error.',
          resourceName: 'Sentry Observability',
          resourceLink: 'https://sentry.io'
        },
        {
          day: 18,
          title: 'Interactive System Architecture Diagram',
          description: 'Create an architectural diagram (Mermaid.js or Excalidraw) showcasing database, cache, workers, and client layers.',
          estimatedMinutes: 75,
          category: 'Portfolio',
          deliverable: 'Embedded high-res architecture diagram in capstone repo.',
          resourceName: 'Mermaid.js Architecture Diagrams',
          resourceLink: 'https://mermaid.js.org'
        },
        {
          day: 19,
          title: 'Record 2-Minute Technical Demo Video',
          description: 'Record Loom or screen capture walking through code architecture, technical hurdles overcome, and live demo.',
          estimatedMinutes: 60,
          category: 'Portfolio',
          deliverable: 'Published demo link ready for recruiter viewing.',
          resourceName: 'Technical Demo Tips',
          resourceLink: 'https://loom.com'
        },
        {
          day: 20,
          title: 'Week 3 Polish & Code Cleanup',
          description: 'Review PRs, ensure clean git commits, delete temporary debug code, and check mobile responsiveness.',
          estimatedMinutes: 60,
          category: 'Portfolio',
          deliverable: 'Pristine portfolio piece with 100% working live demo.',
          resourceName: 'Clean Code Checklist',
          resourceLink: 'https://github.com'
        },
        {
          day: 21,
          title: 'Strategic Rest & Mock Screening Prep',
          description: 'Re-charge and review common behavioral questions regarding full-stack challenges and team trade-offs.',
          estimatedMinutes: 45,
          category: 'Learning',
          deliverable: 'Personal answers written for top 3 behavioral prompts.',
          resourceName: 'STAR Interview Method',
          resourceLink: 'https://www.thebalancecareers.com/what-is-the-star-interview-response-technique-2061629'
        }
      ]
    },
    {
      weekNumber: 4,
      theme: 'ATS Resume Overhaul, Mock Interviews & Strategic Outreach',
      weeklyGoal: 'Tailor resume bullets with quantifiable metrics, pass ATS screenings, and submit targeted applications.',
      milestoneProject: 'Polished ATS-Ready Resume & 15 Targeted Warm Applications',
      days: [
        {
          day: 22,
          title: 'Resume Bullet Transformation (Google XYZ Formula)',
          description: 'Rewrite every bullet point using: "Accomplished [X] as measured by [Y] by doing [Z]".',
          estimatedMinutes: 90,
          category: 'Application',
          deliverable: '6 newly polished high-impact work experience bullet points.',
          resourceName: 'Google Tech Resume Guide',
          resourceLink: 'https://www.inc.com/bill-murphy-jr/google-recruiters-say-these-5-resume-tips-including-x-y-z-formula-will-improve-your-odds-of-getting-hired-at-google.html'
        },
        {
          day: 23,
          title: 'ATS Scanner Validation & Keyword Ingestion',
          description: 'Run resume through the ATS Studio analyzer against 3 target job descriptions. Eliminate formatting flags.',
          estimatedMinutes: 75,
          category: 'Application',
          deliverable: 'Resume achieving >85/100 ATS readiness score.',
          resourceName: 'ATS Studio Diagnostic Tool',
          resourceLink: '#ats-studio'
        },
        {
          day: 24,
          title: 'LinkedIn & GitHub Profile Synchronization',
          description: 'Update LinkedIn headline, featured projects, and GitHub pinned repositories with live demo links and tech stack.',
          estimatedMinutes: 60,
          category: 'Networking',
          deliverable: 'Synchronized online presence aligned with Full-Stack Engineer target.',
          resourceName: 'LinkedIn Tech Optimization Guide',
          resourceLink: 'https://www.linkedin.com'
        },
        {
          day: 25,
          title: 'System Design Mock Interview Drill',
          description: 'Practice designing a URL shortener, Rate Limiter, and Notification Service under 30-minute time limits.',
          estimatedMinutes: 90,
          category: 'Learning',
          deliverable: 'Written architectural solution with trade-offs analyzed.',
          resourceName: 'System Design Interview Questions',
          resourceLink: 'https://github.com/donnemartin/system-design-primer'
        },
        {
          day: 26,
          title: 'Data Structures & Algorithms Rapid Review',
          description: 'Review hash maps, two pointers, binary search, and tree traversals. Solve 3 medium problems.',
          estimatedMinutes: 90,
          category: 'Learning',
          deliverable: 'Clean solutions with documented Big-O time and space complexity.',
          resourceName: 'Blind 75 Curated List',
          resourceLink: 'https://leetcode.com'
        },
        {
          day: 27,
          title: 'Target Company Mapping & Warm Outreach',
          description: 'Identify 15 target tech companies and reach out to engineering managers or alumni with personalized notes.',
          estimatedMinutes: 90,
          category: 'Networking',
          deliverable: '15 personalized outreach messages sent to relevant professionals.',
          resourceName: 'Networking for Engineers Template',
          resourceLink: 'https://www.levels.fyi'
        },
        {
          day: 28,
          title: 'Submit 10 Tailored Job Applications',
          description: 'Submit 10 high-quality applications through referral links, company career sites, or Wellfound.',
          estimatedMinutes: 90,
          category: 'Application',
          deliverable: 'Application tracker spreadsheet populated with follow-up dates.',
          resourceName: 'Wellfound Job Board',
          resourceLink: 'https://wellfound.com'
        },
        {
          day: 29,
          title: 'Full Mock Interview Simulation',
          description: 'Simulate a 45-minute technical and behavioral interview with our AI Mock Interview tool.',
          estimatedMinutes: 60,
          category: 'Learning',
          deliverable: 'Recorded response transcript with feedback score analyzed.',
          resourceName: 'AI Interview Studio',
          resourceLink: '#interview-prep'
        },
        {
          day: 30,
          title: 'Milestone Celebration & Continuous Pipeline Review',
          description: 'Celebrate completing your 30-day intensive program! Establish a weekly cadence of 5 applications and 2 follow-ups.',
          estimatedMinutes: 45,
          category: 'Portfolio',
          deliverable: 'Weekly job search cadence calendar established.',
          resourceName: 'ApexCareer Intelligence Community',
          resourceLink: '#'
        }
      ]
    }
  ]
};

export const FALLBACK_ATS_ANALYSIS: ATSAnalysis = {
  atsScore: 82,
  matchPercentage: 76,
  verdict: 'Needs Optimization',
  breakdown: {
    sectionCompleteness: 94,
    actionVerbStrength: 82,
    quantifiableMetricsRatio: 58,
    formattingParsability: 96,
    keywordAlignment: 78
  },
  missingKeywords: {
    hardSkills: ['GraphQL', 'Database Indexing', 'Redis Caching', 'Microservices'],
    toolsAndFrameworks: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'AWS S3'],
    domainCompetencies: ['System Architecture', 'High Availability', 'Load Balancing']
  },
  detectedKeywords: [
    'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'RESTful APIs',
    'Tailwind CSS', 'Vite', 'Git', 'Agile', 'Unit Testing', 'Vitest'
  ],
  formattingAudit: {
    passed: [
      'Standard clean section headings (Experience, Education, Skills, Projects)',
      'Clear reverse-chronological order format',
      'No multi-column layout table artifacts that confuse ATS scanners',
      'Standard contact links with email and GitHub'
    ],
    warnings: [
      '1 bullet point uses passive voice ("Collaborated with backend developers...")',
      'Missing explicit mention of Docker or containerization in the summary'
    ],
    criticalIssues: []
  },
  weakBulletsFound: [
    {
      original: 'Worked on improving site performance and reduced bundle size by 28% through code splitting and tree shaking.',
      issue: 'Starts with weak verb "Worked on". Can lead with strong action verb and quantify business impact.',
      improvedExample: 'Optimized frontend asset pipeline via dynamic code splitting and tree-shaking, slashing production bundle size by 28% and boosting Lighthouse performance score from 68 to 94.'
    },
    {
      original: 'Collaborated with backend developers to integrate REST APIs and handle error states gracefully.',
      issue: 'Vague collaboration statement without measurable output or specific API scale.',
      improvedExample: 'Integrated 14+ secure REST endpoints with automated retry policies and global error boundary wrappers, supporting 45,000 MAU with 99.8% client uptime.'
    }
  ],
  actionPlan: [
    'Inject critical keywords: Docker, Redis, and Database Indexing into Work Experience and Skills sections.',
    'Upgrade passive bullet openers like "Worked on" or "Assisted with" into impact-driven verbs like "Architected", "Engineered", or "Pioneered".',
    'Include a 1-line link to your containerized full-stack capstone project with live URL.'
  ]
};

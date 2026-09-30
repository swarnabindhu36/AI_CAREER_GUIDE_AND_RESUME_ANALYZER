import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { PREDEFINED_ROLES, FALLBACK_CAREER_ANALYSIS, FALLBACK_ROADMAP, FALLBACK_ATS_ANALYSIS } from './src/data/rolesData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// Roles catalogue endpoint
app.get('/api/roles', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: PREDEFINED_ROLES,
  });
});

// Curated job platforms endpoint
app.get('/api/job-platforms', (req: Request, res: Response) => {
  const role = (req.query.role as string) || 'software engineer';
  const encodedRole = encodeURIComponent(role);
  
  res.json({
    success: true,
    data: [
      {
        name: 'LinkedIn Jobs',
        url: `https://www.linkedin.com/jobs/search/?keywords=${encodedRole}`,
        description: 'World largest professional network with direct recruiter messaging.',
        badge: 'Recommended'
      },
      {
        name: 'Wellfound (AngelList)',
        url: `https://wellfound.com/jobs?query=${encodedRole}`,
        description: 'Startup jobs with transparent salary and equity compensation.',
        badge: 'Top Startup Roles'
      },
      {
        name: 'Levels.fyi Jobs',
        url: `https://www.levels.fyi/jobs?keyword=${encodedRole}`,
        description: 'Verified tech compensation bands and direct engineering job listings.',
        badge: 'High Comp'
      },
      {
        name: 'RemoteOK',
        url: `https://remoteok.com/remote-${encodedRole}-jobs`,
        description: 'Curated global remote technology careers.',
        badge: 'Remote First'
      },
      {
        name: 'GitHub Jobs Directory',
        url: `https://github.com/topics/${encodedRole.toLowerCase().replace(/%20/g, '-')}`,
        description: 'Open source opportunities and community repos hiring active contributors.',
        badge: 'Engineering'
      }
    ]
  });
});

// Career Analysis Endpoint
app.post('/api/career/analyze', async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      currentRole,
      targetRole,
      yearsExperience,
      weeklyHours,
      currentSkills,
      targetCompanies,
      resumeText,
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Graceful fallback with user target role merged
      const fallback = {
        ...FALLBACK_CAREER_ANALYSIS,
        targetRole: targetRole || FALLBACK_CAREER_ANALYSIS.targetRole,
      };
      return res.json({ success: true, data: fallback, mode: 'curated-fallback' });
    }

    const prompt = `You are an elite Silicon Valley executive career strategist and technical recruiter.
Analyze the following candidate profile against their target career objective and produce an ultra-actionable diagnostic in JSON.

Candidate Profile:
- Full Name: ${fullName || 'Candidate'}
- Current Role/Level: ${currentRole || 'Early Career Professional'}
- Target Role: ${targetRole || 'Full Stack Software Engineer'}
- Years of Experience: ${yearsExperience ?? 1}
- Available Weekly Learning Hours: ${weeklyHours ?? 15}
- Current Skills: ${(currentSkills || []).join(', ')}
- Target Companies: ${targetCompanies || 'Tier 1 Tech Companies'}
- Resume Summary Excerpt:
${(resumeText || '').slice(0, 3000)}

Provide a structured assessment with:
1. targetRole (string)
2. matchScore (number between 40 and 95 based on realistic qualifications)
3. marketDemand ("Very High" | "High" | "Moderate" | "Growing")
4. salaryRange ({ min: string, median: string, max: string, currency: string })
5. executiveSummary (clear, insightful 2-3 sentences about their trajectory and competitive edge)
6. coreStrengths (array of 3-5 specific tangible candidate strengths)
7. prioritySkillGaps (array of 3-5 objects with: skill, category ["Technical"|"Tooling"|"Domain"|"Leadership"], currentLevel ["None"|"Beginner"|"Intermediate"|"Proficient"], targetLevel ["Intermediate"|"Proficient"|"Advanced"], urgency ["Critical"|"High"|"Recommended"], estimatedHoursToLearn, recommendedResource)
8. progressionPath (array of 3 phased milestones: stage, timeframe, focus)
9. strategicAdvice (1-2 paragraphs of high-impact strategic coaching advice from a senior director)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetRole: { type: Type.STRING },
            matchScore: { type: Type.NUMBER },
            marketDemand: { type: Type.STRING },
            salaryRange: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.STRING },
                median: { type: Type.STRING },
                max: { type: Type.STRING },
                currency: { type: Type.STRING },
              },
              required: ['min', 'median', 'max', 'currency'],
            },
            executiveSummary: { type: Type.STRING },
            coreStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            prioritySkillGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  category: { type: Type.STRING },
                  currentLevel: { type: Type.STRING },
                  targetLevel: { type: Type.STRING },
                  urgency: { type: Type.STRING },
                  estimatedHoursToLearn: { type: Type.NUMBER },
                  recommendedResource: { type: Type.STRING },
                },
                required: ['skill', 'category', 'currentLevel', 'targetLevel', 'urgency', 'estimatedHoursToLearn', 'recommendedResource'],
              },
            },
            progressionPath: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stage: { type: Type.STRING },
                  timeframe: { type: Type.STRING },
                  focus: { type: Type.STRING },
                },
                required: ['stage', 'timeframe', 'focus'],
              },
            },
            strategicAdvice: { type: Type.STRING },
          },
          required: [
            'targetRole',
            'matchScore',
            'marketDemand',
            'salaryRange',
            'executiveSummary',
            'coreStrengths',
            'prioritySkillGaps',
            'progressionPath',
            'strategicAdvice',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed, mode: 'gemini-live' });
  } catch (error: any) {
    console.error('Error in /api/career/analyze:', error);
    res.json({
      success: true,
      data: FALLBACK_CAREER_ANALYSIS,
      mode: 'curated-fallback',
      warning: error?.message || 'Generated via fallback system',
    });
  }
});

// 30-Day Personalized Roadmap Endpoint
app.post('/api/career/roadmap', async (req: Request, res: Response) => {
  try {
    const { targetRole, weeklyHours, currentSkills, skillGaps } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        data: {
          ...FALLBACK_ROADMAP,
          role: targetRole || FALLBACK_ROADMAP.role,
          weeklyHours: weeklyHours || FALLBACK_ROADMAP.weeklyHours,
        },
        mode: 'curated-fallback',
      });
    }

    const prompt = `Create an intensive, practical 30-day career roadmap for a candidate aiming to become a ${targetRole || 'Full Stack Software Engineer'}.
Candidate context:
- Available learning time: ${weeklyHours || 15} hours per week.
- Current existing skills: ${(currentSkills || []).join(', ')}
- Primary target gaps to close: ${(skillGaps || []).join(', ')}

The roadmap must span 4 sequential weeks (total 30 days, ~7-8 days per week).
Week 1 Theme: Core Fundamentals & Relational/Backend Architecture
Week 2 Theme: Advanced Systems, Caching, & Production Tooling
Week 3 Theme: Capstone Project Implementation & Live Cloud Deployment
Week 4 Theme: ATS Resume Overhaul, Behavioral STAR Mock Interviews & Targeted Applications

For EVERY single day (Day 1 to 30), provide:
- day (number 1 to 30)
- title (clean, punchy title)
- description (action-oriented step with exact technical context)
- estimatedMinutes (calculated realistically based on ${weeklyHours} hours/week)
- category ("Learning" | "Building" | "Portfolio" | "Application" | "Networking")
- deliverable (tangible outcome: e.g. "Git commit with Docker Compose file", "5 tested endpoints", "Deployed live URL")
- resourceName (authoritative resource)
- resourceLink (standard clean documentation URL)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            weeklyHours: { type: Type.NUMBER },
            totalDays: { type: Type.NUMBER },
            overallStrategy: { type: Type.STRING },
            weeks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weekNumber: { type: Type.NUMBER },
                  theme: { type: Type.STRING },
                  weeklyGoal: { type: Type.STRING },
                  milestoneProject: { type: Type.STRING },
                  days: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        day: { type: Type.NUMBER },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        estimatedMinutes: { type: Type.NUMBER },
                        category: { type: Type.STRING },
                        deliverable: { type: Type.STRING },
                        resourceName: { type: Type.STRING },
                        resourceLink: { type: Type.STRING },
                      },
                      required: ['day', 'title', 'description', 'estimatedMinutes', 'category', 'deliverable', 'resourceName', 'resourceLink'],
                    },
                  },
                },
                required: ['weekNumber', 'theme', 'weeklyGoal', 'milestoneProject', 'days'],
              },
            },
          },
          required: ['role', 'weeklyHours', 'totalDays', 'overallStrategy', 'weeks'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed, mode: 'gemini-live' });
  } catch (error: any) {
    console.error('Error in /api/career/roadmap:', error);
    res.json({
      success: true,
      data: FALLBACK_ROADMAP,
      mode: 'curated-fallback',
      warning: error?.message,
    });
  }
});

// Resume ATS Analysis Endpoint
app.post('/api/resume/analyze', async (req: Request, res: Response) => {
  try {
    const { resumeText, targetRole, targetJobDescription } = req.body;

    if (!resumeText || resumeText.trim().length < 40) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMPTY_RESUME', message: 'Please provide resume text or upload a valid resume document.' },
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ success: true, data: FALLBACK_ATS_ANALYSIS, mode: 'curated-fallback' });
    }

    const prompt = `You are an enterprise Applicant Tracking System (ATS) parsing engine and Fortune 500 tech recruitment director.
Audit the following resume against the target role: "${targetRole || 'Full Stack Software Engineer'}".
${targetJobDescription ? `Target Job Description:\n${targetJobDescription}\n` : ''}

Candidate Resume Text:
"""
${resumeText.slice(0, 7000)}
"""

Perform a comprehensive ATS audit and provide:
1. atsScore: overall score from 0 to 100 based on rigorous criteria (formatting, keyword coverage, quantifiable metrics).
2. matchPercentage: match against target role / job description (0 to 100).
3. verdict: "Ready to Apply" (if score >= 85), "Needs Optimization" (65-84), or "High Risk of Rejection" (< 65).
4. breakdown:
   - sectionCompleteness (0-100: Contact, Summary, Experience, Projects, Education, Skills)
   - actionVerbStrength (0-100: starts bullets with strong verbs like Spearheaded, Architected, Engineered vs Worked on, Assisted)
   - quantifiableMetricsRatio (0-100: % of bullets containing numbers, percentages, dollar values, or latency figures)
   - formattingParsability (0-100: standard font/layout parsing viability)
   - keywordAlignment (0-100: frequency of essential industry keywords)
5. missingKeywords:
   - hardSkills: array of 4-8 missing technical skills needed for this role
   - toolsAndFrameworks: array of 3-6 missing toolings
   - domainCompetencies: array of 3-5 high-level domain skills (e.g. Distributed Systems, Agile, A/B Testing)
6. detectedKeywords: array of 8-15 strong keywords successfully detected in the resume
7. formattingAudit:
   - passed: array of 3-5 passed formatting checks
   - warnings: array of 1-3 warnings
   - criticalIssues: array of any critical errors
8. weakBulletsFound: array of 2-4 actual weak bullets identified in this resume, each with:
   - original: exact or paraphrased bullet from resume
   - issue: why an ATS or hiring manager would downgrade it
   - improvedExample: high-impact rewrite following Google XYZ formula (Accomplished [X] as measured by [Y] by doing [Z])
9. actionPlan: array of 3-4 numbered immediate steps to maximize interview callback rates.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.NUMBER },
            matchPercentage: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                sectionCompleteness: { type: Type.NUMBER },
                actionVerbStrength: { type: Type.NUMBER },
                quantifiableMetricsRatio: { type: Type.NUMBER },
                formattingParsability: { type: Type.NUMBER },
                keywordAlignment: { type: Type.NUMBER },
              },
              required: ['sectionCompleteness', 'actionVerbStrength', 'quantifiableMetricsRatio', 'formattingParsability', 'keywordAlignment'],
            },
            missingKeywords: {
              type: Type.OBJECT,
              properties: {
                hardSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                toolsAndFrameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
                domainCompetencies: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['hardSkills', 'toolsAndFrameworks', 'domainCompetencies'],
            },
            detectedKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            formattingAudit: {
              type: Type.OBJECT,
              properties: {
                passed: { type: Type.ARRAY, items: { type: Type.STRING } },
                warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                criticalIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['passed', 'warnings', 'criticalIssues'],
            },
            weakBulletsFound: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  improvedExample: { type: Type.STRING },
                },
                required: ['original', 'issue', 'improvedExample'],
              },
            },
            actionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'atsScore',
            'matchPercentage',
            'verdict',
            'breakdown',
            'missingKeywords',
            'detectedKeywords',
            'formattingAudit',
            'weakBulletsFound',
            'actionPlan',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed, mode: 'gemini-live' });
  } catch (error: any) {
    console.error('Error in /api/resume/analyze:', error);
    res.json({
      success: true,
      data: FALLBACK_ATS_ANALYSIS,
      mode: 'curated-fallback',
      warning: error?.message,
    });
  }
});

// Bullet Point Optimizer Endpoint (Google XYZ Formula)
app.post('/api/resume/optimize-bullet', async (req: Request, res: Response) => {
  try {
    const { bulletText, targetRole, context } = req.body;

    if (!bulletText || bulletText.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Please provide a bullet point to optimize.' },
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        data: {
          original: bulletText,
          improvedVersions: [
            {
              type: 'High Impact Metric',
              text: `Engineered high-performance backend microservice, reducing p95 query latency by 42% and processing 120,000+ daily requests with 99.9% uptime.`,
              rationale: 'Applies XYZ formula with quantifiable speed and scale improvements.',
            },
            {
              type: 'Technical Rigor',
              text: `Architected containerized REST API utilizing PostgreSQL indexing and Redis caching, cutting database CPU utilization by 35%.`,
              rationale: 'Emphasizes technical stack depth and system resource efficiency.',
            },
            {
              type: 'Leadership & Ownership',
              text: `Spearheaded cross-functional migration to TypeScript service layer, eliminating runtime production exceptions by 64% across 8-engineer team.`,
              rationale: 'Highlights team velocity, reliability, and engineering ownership.',
            },
          ],
          actionVerbUsed: 'Engineered / Architected / Spearheaded',
          metricsAdded: ['42% latency reduction', '120,000+ daily requests', '99.9% uptime'],
        },
        mode: 'curated-fallback',
      });
    }

    const prompt = `You are a Google recruitment expert and resume bullet point specialist.
Optimize the following resume bullet point using Google's renowned XYZ Formula:
"Accomplished [X], as measured by [Y], by doing [Z]"

Original Bullet: "${bulletText}"
Target Role Context: "${targetRole || 'Software Engineer'}"
Optional Project Context: "${context || 'Production web application'}"

Generate 3 distinct, high-impact improvements:
1. "High Impact Metric" - focus on business outcomes, conversion, throughput, or speed.
2. "Technical Rigor" - focus on architectural choices, database queries, memory optimization, or testing coverage.
3. "Leadership & Ownership" - focus on cross-functional alignment, mentorship, developer velocity, or reliability standards.

Return structured JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            improvedVersions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  text: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                },
                required: ['type', 'text', 'rationale'],
              },
            },
            actionVerbUsed: { type: Type.STRING },
            metricsAdded: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['original', 'improvedVersions', 'actionVerbUsed', 'metricsAdded'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed, mode: 'gemini-live' });
  } catch (error: any) {
    console.error('Error in /api/resume/optimize-bullet:', error);
    res.json({
      success: true,
      data: {
        original: req.body.bulletText,
        improvedVersions: [
          {
            type: 'High Impact Metric',
            text: `Engineered optimized service pipeline, boosting data throughput by 38% and saving 14 server compute hours weekly.`,
            rationale: 'Employs Google XYZ metric formula.',
          },
        ],
        actionVerbUsed: 'Engineered',
        metricsAdded: ['38% throughput boost'],
      },
      mode: 'curated-fallback',
      warning: error?.message,
    });
  }
});

const INTERVIEW_CATEGORIES = [
  'Technical Architecture',
  'Behavioral (STAR)',
  'System Design',
  'Problem Solving',
] as const;

function createFallbackInterviewQuestions(targetRole: string, skillGaps: string[] = []) {
  const role = PREDEFINED_ROLES.find((item) => item.title.toLowerCase() === targetRole.toLowerCase());
  const skills = skillGaps.length ? skillGaps : role?.essentialSkills || ['core role skills'];
  const focus = skills[0];

  return [
    {
      id: 'fallback-technical',
      category: 'Technical Architecture',
      question: `How would you design a reliable ${targetRole} solution using ${focus}? Explain the main components and trade-offs.`,
      context: `Assesses role-specific architecture decisions and practical use of ${focus}.`,
      idealAnswerRubric: {
        situation: `A production ${targetRole} system needs to support a new high-priority requirement.`,
        task: `Design an approach that uses ${focus} while meeting reliability and maintainability needs.`,
        action: 'Explain the components, data flow, failure handling, security, and alternatives considered.',
        result: 'Connect the design to measurable reliability, performance, or user outcomes.',
      },
      keyKeywordsToInclude: [focus, 'trade-offs', 'reliability', 'security'],
    },
    {
      id: 'fallback-behavioral',
      category: 'Behavioral (STAR)',
      question: `Tell me about a time you solved a difficult problem involving ${focus} in work related to ${targetRole}.`,
      context: 'Evaluates ownership, communication, and evidence-based decision making.',
      idealAnswerRubric: {
        situation: `Set the context for the ${targetRole} challenge and its impact.`,
        task: 'Describe the responsibility or outcome you owned.',
        action: 'Explain the steps you took, how you communicated, and why you chose them.',
        result: 'Share the measurable outcome and what you learned.',
      },
      keyKeywordsToInclude: ['ownership', 'communication', 'impact', 'learning'],
    },
    {
      id: 'fallback-system-design',
      category: 'System Design',
      question: `Design a scalable system for a common ${targetRole} workflow. How would you handle growth, failures, and security?`,
      context: `Tests system-level reasoning grounded in ${targetRole} responsibilities.`,
      idealAnswerRubric: {
        situation: 'Clarify the users, workload, constraints, and success measures.',
        task: 'Propose a design that meets functional and operational requirements.',
        action: 'Cover APIs, data storage, scaling, observability, security, and failure recovery.',
        result: 'Explain how you would validate the design against the success measures.',
      },
      keyKeywordsToInclude: ['scalability', 'observability', 'security', 'failure recovery'],
    },
    {
      id: 'fallback-problem-solving',
      category: 'Problem Solving',
      question: `A ${targetRole} workflow using ${focus} has started failing intermittently. How would you investigate and resolve it?`,
      context: 'Assesses structured diagnosis, prioritization, and verification.',
      idealAnswerRubric: {
        situation: 'Establish the impact, scope, timeline, and available evidence.',
        task: 'Restore the workflow while identifying the underlying cause.',
        action: 'Form hypotheses, inspect relevant signals, test a minimal fix, and communicate progress.',
        result: 'Verify recovery and describe prevention or monitoring improvements.',
      },
      keyKeywordsToInclude: ['diagnosis', 'hypothesis', 'verification', 'prevention'],
    },
  ];
}

// Role- and category-aware mock interview question generator
app.post('/api/interview/questions', async (req: Request, res: Response) => {
  try {
    const { targetRole = 'Software Engineer', skillGaps = [], category = 'All' } = req.body;
    const selectedCategory = INTERVIEW_CATEGORIES.includes(category) ? category : 'All';
    const fallbackQuestions = createFallbackInterviewQuestions(targetRole, skillGaps);
    const filterQuestions = (questions: typeof fallbackQuestions) =>
      selectedCategory === 'All'
        ? questions
        : questions.filter((question) => question.category === selectedCategory);

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        data: filterQuestions(fallbackQuestions),
        mode: 'curated-fallback'
      });
    }

    const roleMeta = PREDEFINED_ROLES.find((item) => item.title.toLowerCase() === targetRole.toLowerCase());
    const prompt = `Generate 4 realistic, high-caliber interview questions for a candidate targeting "${targetRole}".
Specific candidate skill gaps to test: ${skillGaps.join(', ') || roleMeta?.essentialSkills.join(', ') || 'core role skills'}.
${selectedCategory === 'All'
    ? `Include questions across these categories: ${INTERVIEW_CATEGORIES.map((item) => `"${item}"`).join(', ')}.`
    : `Every question must use exactly this category: "${selectedCategory}". Do not return questions from other categories.`}

For each question provide:
- id: unique string
- category
- question
- context (what the interviewer is testing for)
- idealAnswerRubric: { situation, task, action, result }
- keyKeywordsToInclude: array of 4-6 essential buzzwords/terms`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING },
              question: { type: Type.STRING },
              context: { type: Type.STRING },
              idealAnswerRubric: {
                type: Type.OBJECT,
                properties: {
                  situation: { type: Type.STRING },
                  task: { type: Type.STRING },
                  action: { type: Type.STRING },
                  result: { type: Type.STRING },
                },
                required: ['situation', 'task', 'action', 'result'],
              },
              keyKeywordsToInclude: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['id', 'category', 'question', 'context', 'idealAnswerRubric', 'keyKeywordsToInclude'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    const matchingQuestions = filterQuestions(parsed);
    res.json({
      success: true,
      data: matchingQuestions.length ? matchingQuestions : filterQuestions(fallbackQuestions),
      mode: matchingQuestions.length ? 'gemini-live' : 'curated-fallback',
    });
  } catch (error: any) {
    console.error('Error in /api/interview/questions:', error);
    const { targetRole = 'Software Engineer', skillGaps = [], category = 'All' } = req.body;
    const fallbackQuestions = createFallbackInterviewQuestions(targetRole, skillGaps);
    const data = category === 'All'
      ? fallbackQuestions
      : fallbackQuestions.filter((question) => question.category === category);
    res.json({ success: true, data, mode: 'curated-fallback' });
  }
});

// Evaluate Interview Response Endpoint
app.post('/api/interview/evaluate', async (req: Request, res: Response) => {
  try {
    const { question, userAnswer } = req.body;

    if (!userAnswer || userAnswer.trim().length < 15) {
      return res.status(400).json({
        success: false,
        error: { code: 'SHORT_ANSWER', message: 'Please provide a more detailed response to evaluate.' },
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        data: {
          score: 84,
          verdict: 'Strong Answer',
          starAdherence: {
            situation: 'Clearly defined context and business scale.',
            task: 'Identified the core engineering trade-off.',
            action: 'Good technical specifics; could mention exact tools used.',
            result: 'Included a concrete metric, which recruiters love.',
          },
          strengths: ['Clear narrative arc', 'Strong ownership language', 'Quantifiable outcome'],
          areasForImprovement: ['Mention trade-offs considered before picking the solution', 'Briefly state lessons learned'],
          improvedSTARSample: `When our API faced unexpected traffic surges during product launch (Situation), I was tasked with preventing cascade server timeouts (Task). I implemented a Redis sliding-window rate limiter with local in-memory fallback (Action), maintaining 99.95% uptime and reducing p95 latency to 8ms (Result).`,
        },
        mode: 'curated-fallback',
      });
    }

    const prompt = `You are a Principal Engineer and Bar Raiser interviewer at a FAANG company.
Evaluate the candidate's interview answer using the STAR methodology (Situation, Task, Action, Result).

Question Asked: "${question}"
Candidate's Answer:
"""
${userAnswer}
"""

Evaluate and return structured JSON with:
1. score (number 0-100)
2. verdict ("Exceptional" | "Strong Answer" | "Adequate" | "Needs Restructuring")
3. starAdherence: object with { situation, task, action, result } reviews
4. strengths: array of 2-3 specific positives
5. areasForImprovement: array of 2-3 clear coaching tips
6. improvedSTARSample: rewritten exemplar answer demonstrating how a top candidate would answer.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
            starAdherence: {
              type: Type.OBJECT,
              properties: {
                situation: { type: Type.STRING },
                task: { type: Type.STRING },
                action: { type: Type.STRING },
                result: { type: Type.STRING },
              },
              required: ['situation', 'task', 'action', 'result'],
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvedSTARSample: { type: Type.STRING },
          },
          required: ['score', 'verdict', 'starAdherence', 'strengths', 'areasForImprovement', 'improvedSTARSample'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed, mode: 'gemini-live' });
  } catch (error: any) {
    console.error('Error in /api/interview/evaluate:', error);
    res.status(500).json({ success: false, error: error?.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('⚡ Vite development middlewares attached');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('📦 Serving production static bundle from /dist');
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 ApexCareer AI Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

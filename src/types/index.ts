export interface SkillGap {
  skill: string;
  category: 'Technical' | 'Tooling' | 'Domain' | 'Leadership';
  currentLevel: 'None' | 'Beginner' | 'Intermediate' | 'Proficient';
  targetLevel: 'Intermediate' | 'Proficient' | 'Advanced';
  urgency: 'Critical' | 'High' | 'Recommended';
  estimatedHoursToLearn: number;
  recommendedResource: string;
}

export interface CareerIntelligence {
  targetRole: string;
  matchScore: number; // 0-100
  marketDemand: 'Very High' | 'High' | 'Moderate' | 'Growing';
  salaryRange: {
    min: string;
    median: string;
    max: string;
    currency: string;
  };
  executiveSummary: string;
  coreStrengths: string[];
  prioritySkillGaps: SkillGap[];
  progressionPath: {
    stage: string;
    timeframe: string;
    focus: string;
  }[];
  strategicAdvice: string;
}

export interface RoadmapDay {
  day: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  category: 'Learning' | 'Building' | 'Portfolio' | 'Application' | 'Networking';
  deliverable: string;
  completed?: boolean;
  resourceLink?: string;
  resourceName?: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  theme: string;
  weeklyGoal: string;
  milestoneProject: string;
  days: RoadmapDay[];
}

export interface CareerRoadmap {
  role: string;
  weeklyHours: number;
  totalDays: number;
  overallStrategy: string;
  weeks: RoadmapWeek[];
}

export interface ATSAnalysis {
  atsScore: number; // 0-100
  matchPercentage: number;
  verdict: 'Ready to Apply' | 'Needs Optimization' | 'High Risk of Rejection';
  breakdown: {
    sectionCompleteness: number; // 0-100
    actionVerbStrength: number;
    quantifiableMetricsRatio: number; // e.g. 45%
    formattingParsability: number;
    keywordAlignment: number;
  };
  missingKeywords: {
    hardSkills: string[];
    toolsAndFrameworks: string[];
    domainCompetencies: string[];
  };
  detectedKeywords: string[];
  formattingAudit: {
    passed: string[];
    warnings: string[];
    criticalIssues: string[];
  };
  weakBulletsFound: {
    original: string;
    issue: string;
    improvedExample: string;
  }[];
  actionPlan: string[];
}

export interface BulletOptimizationResponse {
  original: string;
  improvedVersions: {
    type: 'High Impact Metric' | 'Technical Rigor' | 'Leadership & Ownership';
    text: string;
    rationale: string;
  }[];
  actionVerbUsed: string;
  metricsAdded: string[];
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical Architecture' | 'Behavioral (STAR)' | 'System Design' | 'Problem Solving';
  question: string;
  context: string;
  idealAnswerRubric: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  keyKeywordsToInclude: string[];
}

export interface UserCareerProfile {
  fullName: string;
  currentRole: string;
  targetRole: string;
  yearsExperience: number;
  weeklyHours: number;
  currentSkills: string[];
  targetCompanies: string;
  resumeText: string;
  targetJobDescription?: string;
}

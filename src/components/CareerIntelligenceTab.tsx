import React, { useState } from 'react';
import { Sparkles, TrendingUp, DollarSign, Clock, ShieldAlert, BookOpen, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { UserCareerProfile, CareerIntelligence } from '../types';
import { PREDEFINED_ROLES } from '../data/rolesData';
import avatarMentorImg from '../assets/images/avatar_mentor_elena_1790778406750.jpg';

interface CareerIntelligenceTabProps {
  profile: UserCareerProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserCareerProfile>>;
  analysis: CareerIntelligence | null;
  loading: boolean;
  onRunAnalysis: () => void;
  onNavigateToRoadmap: () => void;
}

export const CareerIntelligenceTab: React.FC<CareerIntelligenceTabProps> = ({
  profile,
  setProfile,
  analysis,
  loading,
  onRunAnalysis,
  onNavigateToRoadmap,
}) => {
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    if (!skillInput.trim()) return;

    if (!profile.currentSkills.includes(skillInput.trim())) {
      setProfile(prev => ({
        ...prev,
        currentSkills: [...prev.currentSkills, skillInput.trim()]
      }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      currentSkills: prev.currentSkills.filter(s => s !== skillToRemove)
    }));
  };

  return (
    <div className="space-y-8">
      
      {/* Top Section Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Diagnostic Phase</span>
          <span aria-hidden="true">·</span>
          <span>Market Compensation Intelligence</span>
          <span aria-hidden="true">·</span>
          <span>Skill Gap Triangulation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
          Career Profile & Intelligence Audit
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Calibrate your qualifications against tier-1 engineering benchmarks, uncover high-urgency skill bottlenecks, and access compensation projections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Candidate Profile Configuration (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white">Target Profile Parameters</h3>
            <span className="text-xs text-slate-400">Step 1 of 3</span>
          </div>

          {/* Target Role Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Target Role
            </label>
            <input
              type="text"
              value={profile.targetRole}
              onChange={(e) => setProfile(prev => ({ ...prev, targetRole: e.target.value }))}
              placeholder="e.g. Full Stack Software Engineer"
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PREDEFINED_ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setProfile(prev => ({ ...prev, targetRole: r.title }))}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  {r.title}
                </button>
              ))}
            </div>
          </div>

          {/* Current Role & Years of Experience */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Current Role / Title
              </label>
              <input
                type="text"
                value={profile.currentRole}
                onChange={(e) => setProfile(prev => ({ ...prev, currentRole: e.target.value }))}
                placeholder="e.g. Junior Developer"
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                max="25"
                value={profile.yearsExperience}
                onChange={(e) => setProfile(prev => ({ ...prev, yearsExperience: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-md text-white font-mono tabular-nums focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Available Learning Time */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Weekly Learning Commitment
              </label>
              <span className="text-xs font-mono font-semibold text-indigo-400 tabular-nums">
                {profile.weeklyHours} hrs / week
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={profile.weeklyHours}
              onChange={(e) => setProfile(prev => ({ ...prev, weeklyHours: Number(e.target.value) }))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>5h (Casual)</span>
              <span>15h (Balanced)</span>
              <span>25h (Accelerated)</span>
              <span>40h (Full-time)</span>
            </div>
          </div>

          {/* Current Skills Tags */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Current Core Skills
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Add skill (press Enter)..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700/80 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 text-slate-200 rounded-md hover:bg-slate-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            {/* Skills container with clean unboxed text and remove affordance */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {profile.currentSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-800/80 border border-slate-700/70 text-slate-200 rounded"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Target Companies */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Target Companies / Industry
            </label>
            <input
              type="text"
              value={profile.targetCompanies}
              onChange={(e) => setProfile(prev => ({ ...prev, targetCompanies: e.target.value }))}
              placeholder="e.g. Stripe, Datadog, Fintech, Seed startups"
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Run Analysis CTA */}
          <button
            onClick={onRunAnalysis}
            disabled={loading}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Intelligence...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Career Intelligence Audit</span>
              </>
            )}
          </button>

        </div>

        {/* Right Column: Intelligence Results & Diagnostic (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {analysis ? (
            <>
              {/* Executive Stat Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Match Score Card */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400 font-medium">Role Match Index</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                      {analysis.matchScore}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/ 100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysis.matchScore}%` }}
                    />
                  </div>
                </div>

                {/* Market Demand Card */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400 font-medium">Hiring Demand</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>{analysis.marketDemand}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Verified Q3 2026 tech openings
                  </div>
                </div>

                {/* Compensation Range Card */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400 font-medium">Market Median Band</div>
                  <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
                    {analysis.salaryRange.median}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono tabular-nums mt-2">
                    Range: {analysis.salaryRange.min} – {analysis.salaryRange.max}
                  </div>
                </div>

              </div>

              {/* Executive Summary */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                  <span>Executive Assessment</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {analysis.executiveSummary}
                </p>
              </div>

              {/* Candidate Core Strengths */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-white mb-3">
                  Identified Strengths & Competitive Advantages
                </h4>
                <div className="space-y-2">
                  {analysis.coreStrengths.map((str, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Skill Gaps Table */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Priority Skill Gaps</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Focus areas required to bridge the compensation delta</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">
                    {analysis.prioritySkillGaps.length} Gaps Diagnosed
                  </span>
                </div>

                <div className="divide-y divide-slate-800">
                  {analysis.prioritySkillGaps.map((gap, i) => (
                    <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-100">{gap.skill}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-400">{gap.category}</span>
                          <span className="text-slate-500">·</span>
                          <span className={gap.urgency === 'Critical' ? 'text-rose-400 font-semibold' : 'text-amber-400'}>
                            {gap.urgency}
                          </span>
                        </div>
                        <div className="text-slate-400 mt-1 flex items-center gap-2">
                          <span>Level: {gap.currentLevel} → {gap.targetLevel}</span>
                          <span className="text-slate-600">|</span>
                          <span className="font-mono tabular-nums">~{gap.estimatedHoursToLearn} hrs study</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-400 text-[11px] block truncate max-w-[220px]">
                          {gap.recommendedResource}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Advice with Mentor Avatar */}
              <div className="bg-gradient-to-r from-slate-900/90 to-indigo-950/40 border border-slate-800 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <img
                    src={avatarMentorImg}
                    alt="Elena Vance Career Strategist"
                    className="w-12 h-12 rounded-full object-cover border border-indigo-400/40 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">Elena Vance</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-xs text-slate-400">Senior Career Strategist</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">
                      {analysis.strategicAdvice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Banner to Roadmap */}
              <div className="p-4 rounded-xl border border-indigo-800/60 bg-indigo-950/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Ready to close these skill gaps?</div>
                  <div className="text-xs text-slate-400 mt-0.5">Explore your personalized 30-day milestone curriculum.</div>
                </div>
                <button
                  onClick={onNavigateToRoadmap}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>View 30-Day Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-12 text-center">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">No Diagnostic Run Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Configure your target role parameters on the left and run the diagnostic to receive your compensation band, match rating, and skill gap matrix.
              </p>
              <button
                onClick={onRunAnalysis}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors"
              >
                Run Diagnostic Now
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

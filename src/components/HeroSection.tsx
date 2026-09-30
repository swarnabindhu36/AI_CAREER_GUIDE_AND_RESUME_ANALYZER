import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, Sparkles, FileText, Compass, Award } from 'lucide-react';
import heroWorkspaceImg from '../assets/images/hero_career_workspace_1790778393236.jpg';
import avatarCandidateImg from '../assets/images/avatar_candidate_alex_1790778419592.jpg';
import { PREDEFINED_ROLES } from '../data/rolesData';

interface HeroSectionProps {
  onSelectPreset: (roleId: string) => void;
  onExploreRoadmap: () => void;
  onOpenATS: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectPreset,
  onExploreRoadmap,
  onOpenATS,
}) => {
  return (
    <section className="relative border-b border-slate-800 bg-slate-950 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-950/20 via-slate-950/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Positioning */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Unboxed Metadata Kicker (Anti-Pill Rule) */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-indigo-400 font-semibold">Career Intelligence Engine</span>
              <span aria-hidden="true">·</span>
              <span>Gemini 3.8 Flash Powered</span>
              <span aria-hidden="true">·</span>
              <span>Updated September 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
              Architect your next tech role with deterministic precision.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Combine algorithmic resume auditing, Google XYZ bullet quantification, and an adaptive 30-day curriculum tailored to your exact target tech salary and skill gaps.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenATS}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-950/50 whitespace-nowrap"
              >
                <span>Audit Resume with ATS Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreRoadmap}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-200 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
              >
                <span>Explore 30-Day Roadmap</span>
              </button>
            </div>

            {/* Preset Profile Selectors (Interactive Segmented Buttons) */}
            <div className="pt-4 border-t border-slate-900">
              <span className="block text-xs font-medium text-slate-400 mb-2">
                Quick-load verified candidate benchmark:
              </span>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => onSelectPreset(role.id)}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-900/90 text-slate-300 border border-slate-800 rounded-md hover:border-indigo-500/60 hover:text-white transition-colors text-left flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{role.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Proof Adjacency Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-900/80 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
                  84%
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Avg. ATS callback lift
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
                  30 Days
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Milestone sprint cycle
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
                  $135K+
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Median full-stack band
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Frame */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-2 shadow-2xl backdrop-blur-sm">
              
              {/* High-Fidelity Hero Image */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-900">
                <img
                  src={heroWorkspaceImg}
                  alt="Executive engineering workstation with career analytics"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                
                {/* Contrast scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Overlaid Candidate Live Badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-3 rounded-lg bg-slate-950/90 border border-slate-800/90 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarCandidateImg}
                      alt="Alex Chen Candidate"
                      className="w-9 h-9 rounded-full object-cover border border-indigo-500/50"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">Alex Chen</div>
                      <div className="text-[11px] text-slate-400">Targeting: Full Stack Engineer</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-emerald-400 tabular-nums">82 / 100 ATS</div>
                    <div className="text-[10px] text-slate-400">Ready for Week 3</div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

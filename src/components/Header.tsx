import React from 'react';
import { Sparkles, ArrowRight, BookOpen, FileCheck, Target, MessageSquare, Compass } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickLoadDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onQuickLoadDemo,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('intelligence')}
          className="text-lg font-bold tracking-tight text-white hover:text-indigo-400 transition-colors flex items-center gap-1.5 focus-visible:outline-none"
        >
          <span>ApexCareer AI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"></span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab('intelligence')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'intelligence'
                ? 'text-white font-semibold border-b-2 border-indigo-500 pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Career Intelligence
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'text-white font-semibold border-b-2 border-indigo-500 pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            30-Day Roadmap
          </button>

          <button
            onClick={() => setActiveTab('ats-studio')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'ats-studio'
                ? 'text-white font-semibold border-b-2 border-indigo-500 pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ATS Resume Studio
          </button>

          <button
            onClick={() => setActiveTab('bullet-optimizer')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'bullet-optimizer'
                ? 'text-white font-semibold border-b-2 border-indigo-500 pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bullet Optimizer
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'interview'
                ? 'text-white font-semibold border-b-2 border-indigo-500 pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mock Interview
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'text-white font-semibold border-b-2 border-indigo-500 pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Job Discovery
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onQuickLoadDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-md hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
            title="Load sample full-stack candidate profile"
          >
            <span>Demo Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('ats-studio')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors whitespace-nowrap shadow-sm shadow-indigo-950"
          >
            <span>Scan Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center gap-4 px-4 py-2 overflow-x-auto border-t border-slate-900 text-xs font-medium bg-slate-950">
        <button
          onClick={() => setActiveTab('intelligence')}
          className={`whitespace-nowrap py-1 ${activeTab === 'intelligence' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Intelligence
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`whitespace-nowrap py-1 ${activeTab === 'roadmap' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Roadmap
        </button>
        <button
          onClick={() => setActiveTab('ats-studio')}
          className={`whitespace-nowrap py-1 ${activeTab === 'ats-studio' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          ATS Studio
        </button>
        <button
          onClick={() => setActiveTab('bullet-optimizer')}
          className={`whitespace-nowrap py-1 ${activeTab === 'bullet-optimizer' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Bullets
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`whitespace-nowrap py-1 ${activeTab === 'interview' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Interview
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`whitespace-nowrap py-1 ${activeTab === 'jobs' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Jobs
        </button>
      </div>
    </header>
  );
};

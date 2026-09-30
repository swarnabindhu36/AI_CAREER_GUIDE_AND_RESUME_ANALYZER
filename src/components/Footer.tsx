import React from 'react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">ApexCareer AI</span>
            <span className="text-slate-600">·</span>
            <span>Career Intelligence & ATS Studio</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <button onClick={() => onSelectTab('intelligence')} className="hover:text-white transition-colors">
              Intelligence
            </button>
            <button onClick={() => onSelectTab('roadmap')} className="hover:text-white transition-colors">
              30-Day Roadmap
            </button>
            <button onClick={() => onSelectTab('ats-studio')} className="hover:text-white transition-colors">
              ATS Studio
            </button>
            <button onClick={() => onSelectTab('bullet-optimizer')} className="hover:text-white transition-colors">
              Bullet Optimizer
            </button>
            <button onClick={() => onSelectTab('interview')} className="hover:text-white transition-colors">
              Mock Interview
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-900/80 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Methodology Notice: The estimated ATS readiness score is a heuristic benchmark based on parsing patterns and does not guarantee employer decisions.
          </p>
          <p>
            © {new Date().getFullYear()} ApexCareer Intelligence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

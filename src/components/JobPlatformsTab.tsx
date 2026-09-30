import React, { useEffect, useState } from 'react';
import { ExternalLink, Compass, Briefcase, CheckCircle2, Bookmark, Search } from 'lucide-react';

interface JobPlatformsTabProps {
  targetRole: string;
}

interface Platform {
  name: string;
  url: string;
  description: string;
  badge: string;
}

export const JobPlatformsTab: React.FC<JobPlatformsTabProps> = ({ targetRole }) => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlatforms = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/job-platforms?role=${encodeURIComponent(targetRole || 'Software Engineer')}`);
        const data = await res.json();
        if (data.success && data.data) {
          setPlatforms(data.data);
        }
      } catch (err) {
        console.error('Error fetching job platforms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, [targetRole]);

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Outreach Phase</span>
          <span aria-hidden="true">·</span>
          <span>Verified Channels</span>
          <span aria-hidden="true">·</span>
          <span>High-Compensation Tech Hubs</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
          Job Discovery & Application Channels
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Direct search portals and filtered queries configured specifically for {targetRole || 'Full Stack Software Engineer'} opportunities.
        </p>
      </div>

      {/* Grid of Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {platforms.map((p, idx) => (
          <div
            key={idx}
            className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500/50 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/50">
                  {p.badge}
                </span>
                <Briefcase className="w-4 h-4 text-slate-500" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{p.name}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-slate-800 hover:bg-indigo-600 rounded-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Search {targetRole || 'Jobs'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Application Strategy Blueprint */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">
          Application Strategy & Conversion Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1.5">
            <span className="font-semibold text-indigo-400 block">1. The 10-10-10 Rule:</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Target 10 top-tier stretch companies, 10 solid growth startups, and 10 high-probability matches. Never spray 100 identical resumes.
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1.5">
            <span className="font-semibold text-indigo-400 block">2. Recruiter Cold Inmail:</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Always follow up on LinkedIn within 24 hours of application with a concise 3-sentence note referencing the specific role ID.
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1.5">
            <span className="font-semibold text-indigo-400 block">3. GitHub Repo Showcase:</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Include a 1-line link to your capstone project's live demo URL at the top of your resume contact header.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

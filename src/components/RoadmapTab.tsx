import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckSquare, Square, Calendar, Clock, Download, RefreshCw, Sparkles, ExternalLink, ArrowRight, Award } from 'lucide-react';
import { CareerRoadmap, RoadmapDay } from '../types';
import roadmapVisualImg from '../assets/images/roadmap_visualization_1790778433914.jpg';

interface RoadmapTabProps {
  roadmap: CareerRoadmap | null;
  loading: boolean;
  weeklyHours: number;
  onUpdateWeeklyHours: (hours: number) => void;
  onRegenerateRoadmap: () => void;
  onNavigateToATS: () => void;
}

export const RoadmapTab: React.FC<RoadmapTabProps> = ({
  roadmap,
  loading,
  weeklyHours,
  onUpdateWeeklyHours,
  onRegenerateRoadmap,
  onNavigateToATS,
}) => {
  const [activeWeek, setActiveWeek] = useState<number>(0); // 0 = all weeks, 1-4 = specific
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({
    1: true,
    2: true, // sample defaults
  });

  const handleToggleDay = (dayNum: number) => {
    setCompletedDays(prev => {
      const nextState = !prev[dayNum];
      const updated = { ...prev, [dayNum]: nextState };

      // Trigger celebratory confetti if completing a milestone day (e.g. Day 7, 14, 21, 30)
      if (nextState && (dayNum % 7 === 0 || dayNum === 30)) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

      return updated;
    });
  };

  // Calculate progress
  const totalDays = 30;
  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalDays) * 100);

  // Filter weeks
  const displayedWeeks = roadmap?.weeks
    ? activeWeek === 0
      ? roadmap.weeks
      : roadmap.weeks.filter(w => w.weekNumber === activeWeek)
    : [];

  const handleExportMarkdown = () => {
    if (!roadmap) return;
    let md = `# 30-Day Career Roadmap: ${roadmap.role}\n`;
    md += `Weekly Commitment: ${roadmap.weeklyHours} hours/week\n`;
    md += `Overall Strategy: ${roadmap.overallStrategy}\n\n`;

    roadmap.weeks.forEach(w => {
      md += `## Week ${w.weekNumber}: ${w.theme}\n`;
      md += `Goal: ${w.weeklyGoal}\n`;
      md += `Milestone Project: ${w.milestoneProject}\n\n`;

      w.days.forEach(d => {
        const status = completedDays[d.day] ? '[x]' : '[ ]';
        md += `- ${status} **Day ${d.day}: ${d.title}** (${d.estimatedMinutes}m)\n`;
        md += `  - Description: ${d.description}\n`;
        md += `  - Deliverable: ${d.deliverable}\n`;
        if (d.resourceLink) {
          md += `  - Resource: [${d.resourceName || 'Link'}](${d.resourceLink})\n`;
        }
      });
      md += '\n';
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `30-Day-Roadmap-${roadmap.role.replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Adaptive Execution</span>
            <span aria-hidden="true">·</span>
            <span>Sprint Cadence</span>
            <span aria-hidden="true">·</span>
            <span>Milestone Verification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            30-Day Milestone Career Roadmap
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Daily bite-sized objectives calibrated to your weekly schedule, building directly toward an ATS-proven portfolio.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportMarkdown}
            disabled={!roadmap}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700/80 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            title="Download formatted Markdown for Notion or Obsidian"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Markdown</span>
          </button>

          <button
            onClick={onRegenerateRoadmap}
            disabled={loading}
            className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 rounded-md text-white hover:bg-indigo-500 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-calibrate Roadmap</span>
          </button>
        </div>
      </div>

      {/* Progress & Time Selector Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        
        {/* Left: Overall Strategy & Progress (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Target Role</div>
              <div className="text-base font-bold text-white mt-0.5">
                {roadmap?.role || 'Full Stack Software Engineer'}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Roadmap Progress</div>
              <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                {completedCount} / {totalDays} Days ({progressPercent}%)
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {roadmap?.overallStrategy ||
              'A structured 30-day curriculum guiding you step-by-step from backend foundations through capstone cloud deployment and Google XYZ resume optimization.'}
          </p>

          {/* Time Commitment Controls */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs text-slate-400">Pacing:</span>
            {[10, 15, 20, 30].map(h => (
              <button
                key={h}
                type="button"
                onClick={() => onUpdateWeeklyHours(h)}
                className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                  weeklyHours === h
                    ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {h}h / wk
              </button>
            ))}
          </div>
        </div>

        {/* Right: Graphic Card (4 Cols) */}
        <div className="lg:col-span-4 relative rounded-lg overflow-hidden border border-slate-800 aspect-[16/9] lg:aspect-auto">
          <img
            src={roadmapVisualImg}
            alt="Career Roadmap Milestones"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
            <div className="text-xs font-semibold text-white">4 Sequential Milestones</div>
            <div className="text-[11px] text-slate-300">Foundation → Systems → Capstone → ATS Placement</div>
          </div>
        </div>

      </div>

      {/* Week Filter Controls (Interactive Segmented Tabs) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-lg">
        <button
          onClick={() => setActiveWeek(0)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeWeek === 0
              ? 'bg-slate-800 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All 30 Days
        </button>

        {[1, 2, 3, 4].map(w => (
          <button
            key={w}
            onClick={() => setActiveWeek(w)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeWeek === w
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Week {w}
          </button>
        ))}
      </div>

      {/* Weeks & Days Timeline */}
      <div className="space-y-8">
        {displayedWeeks.map((week) => (
          <div
            key={week.weekNumber}
            className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden"
          >
            {/* Week Header */}
            <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                  <span>WEEK {week.weekNumber}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 font-sans">{week.weeklyGoal}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {week.theme}
                </h3>
              </div>

              <div className="text-xs text-slate-400">
                <span className="text-slate-500">Milestone: </span>
                <span className="text-slate-200 font-medium">{week.milestoneProject}</span>
              </div>
            </div>

            {/* Days List */}
            <div className="divide-y divide-slate-800/80">
              {week.days.map((day) => {
                const isDone = Boolean(completedDays[day.day]);

                return (
                  <div
                    key={day.day}
                    onClick={() => handleToggleDay(day.day)}
                    className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer hover:bg-slate-800/30 ${
                      isDone ? 'bg-slate-950/40 opacity-75' : ''
                    }`}
                  >
                    {/* Checkbox trigger */}
                    <button
                      type="button"
                      aria-label={`Toggle Day ${day.day}`}
                      className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors shrink-0"
                    >
                      {isDone ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-600" />
                      )}
                    </button>

                    {/* Day Content */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-indigo-400 tabular-nums">
                          Day {day.day}
                        </span>
                        <span className="text-slate-600">·</span>
                        <h4 className={`font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {day.title}
                        </h4>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400 font-mono tabular-nums flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {day.estimatedMinutes} min
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400">{day.category}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {day.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                        <div className="text-slate-400">
                          <span className="text-slate-500">Deliverable: </span>
                          <span className="text-slate-200 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {day.deliverable}
                          </span>
                        </div>

                        {day.resourceName && (
                          <a
                            href={day.resourceLink || '#'}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 text-[11px]"
                          >
                            <span>{day.resourceName}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

      {/* Bottom Nav to ATS */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-white">Reached Week 4 or ready to polish your resume?</div>
          <div className="text-xs text-slate-400 mt-0.5">Use the ATS Studio to ensure all required keywords and metrics are indexed.</div>
        </div>
        <button
          onClick={onNavigateToATS}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Open ATS Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, ArrowRight, Wand2, Lightbulb } from 'lucide-react';
import { BulletOptimizationResponse } from '../types';

interface BulletOptimizerTabProps {
  targetRole: string;
}

export const BulletOptimizerTab: React.FC<BulletOptimizerTabProps> = ({ targetRole }) => {
  const [bulletText, setBulletText] = useState(
    'Worked on improving website speed and fixed backend database queries.'
  );
  const [context, setContext] = useState('High-traffic e-commerce SaaS platform');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulletOptimizationResponse | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const sampleWeakBullets = [
    {
      title: 'Backend Performance',
      text: 'Worked on improving website speed and fixed backend database queries.',
      context: 'Production Node.js & PostgreSQL service',
    },
    {
      title: 'Customer Dashboard',
      text: 'Created frontend React dashboard for users to view reports.',
      context: 'B2B analytics tool with 50,000 monthly active users',
    },
    {
      title: 'ML Pipeline',
      text: 'Helped clean data and trained a machine learning model.',
      context: 'Customer churn prediction pipeline in Python',
    },
    {
      title: 'Agile & Team Coordination',
      text: 'Managed team meetings and tracked tasks in Jira.',
      context: 'Cross-functional team of 8 software engineers',
    },
  ];

  const handleOptimize = async () => {
    if (!bulletText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/resume/optimize-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletText,
          targetRole,
          context,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
      }
    } catch (err) {
      console.error('Error optimizing bullet:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Google XYZ Formula</span>
          <span aria-hidden="true">·</span>
          <span>Quantifiable Impact</span>
          <span aria-hidden="true">·</span>
          <span>Action Verb Precision</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
          Resume Bullet Point Impact Laboratory
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Transform passive job descriptions into metric-dense achievements using Google's formula: <span className="text-indigo-400 font-semibold">Accomplished [X], as measured by [Y], by doing [Z]</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input & Preset Samples (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white">Draft Bullet Point</h3>
            <span className="text-xs text-indigo-400 font-medium">XYZ Converter</span>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Select Sample Weak Bullet:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {sampleWeakBullets.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setBulletText(sample.text);
                    setContext(sample.context);
                  }}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bullet Textarea */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Original Resume Bullet Text
            </label>
            <textarea
              rows={4}
              value={bulletText}
              onChange={(e) => setBulletText(e.target.value)}
              placeholder="e.g. Worked on improving website speed..."
              className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-100 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Project Context */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Technical / Business Context (Optional)
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. High-throughput distributed caching service"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Optimize CTA */}
          <button
            onClick={handleOptimize}
            disabled={loading || !bulletText.trim()}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Quantifying Metrics...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Optimize with Google XYZ Formula</span>
              </>
            )}
          </button>

          {/* Formula Rule Card */}
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-400">
              <Lightbulb className="w-4 h-4" />
              <span>The Google XYZ Anatomy:</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              • <strong className="text-slate-200">[X] Accomplished:</strong> Active verb + direct system impact.
              <br />
              • <strong className="text-slate-200">[Y] Measured by:</strong> Quantifiable metric (%, $, ms, MAU, test coverage).
              <br />
              • <strong className="text-slate-200">[Z] Doing:</strong> Technical mechanism, framework, or architectural choice.
            </p>
          </div>

        </div>

        {/* Right: 3 Optimized Versions (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    3 High-Impact Optimized Variations
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Choose the angle that best matches your target level
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                  XYZ Validated
                </span>
              </div>

              {result.improvedVersions.map((variant, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3 transition-colors hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                      Variant {idx + 1}: {variant.type}
                    </span>

                    <button
                      onClick={() => handleCopy(variant.text, idx)}
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded bg-slate-800/80 border border-slate-700"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Copy Bullet</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-slate-100 font-medium leading-relaxed bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                    {variant.text}
                  </p>

                  <div className="text-xs text-slate-400 flex items-start gap-1.5">
                    <span className="text-slate-500 font-medium">Recruiter Rationale:</span>
                    <span>{variant.rationale}</span>
                  </div>
                </div>
              ))}

              {/* Injected Action Verbs & Metrics */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Action Verb Strategy:</span>
                  <span className="text-slate-200 font-semibold">{result.actionVerbUsed}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Injected Impact Metrics:</span>
                  <div className="flex flex-wrap gap-1">
                    {result.metricsAdded.map((m, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-900/50 font-mono text-[11px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-12 text-center">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">Optimizer Ready</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Paste any resume bullet on the left and click "Optimize with Google XYZ Formula" to generate 3 verified high-impact rewrites.
              </p>
              <button
                onClick={handleOptimize}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors"
              >
                Optimize Sample Bullet
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

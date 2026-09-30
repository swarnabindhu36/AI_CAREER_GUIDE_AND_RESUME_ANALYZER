import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Copy, Check, ArrowRight, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { ATSAnalysis } from '../types';
import { PREDEFINED_ROLES } from '../data/rolesData';
import { extractTextFromFile } from '../utils/fileExtractor';

interface ATSStudioTabProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  targetJobDescription: string;
  setTargetJobDescription: (text: string) => void;
  targetRole: string;
  analysis: ATSAnalysis | null;
  loading: boolean;
  onScanResume: () => void;
  onNavigateToBulletOptimizer: () => void;
}

export const ATSStudioTab: React.FC<ATSStudioTabProps> = ({
  resumeText,
  setResumeText,
  targetJobDescription,
  setTargetJobDescription,
  targetRole,
  analysis,
  loading,
  onScanResume,
  onNavigateToBulletOptimizer,
}) => {
  const [showJobDescription, setShowJobDescription] = useState(Boolean(targetJobDescription));
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File exceeds 5MB size limit.');
      return;
    }

    try {
      setUploadError(null);
      const text = await extractTextFromFile(file);
      setResumeText(text);
    } catch (err: any) {
      setUploadError(err?.message || 'Error extracting file.');
    }
  };

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  const handleLoadSampleResume = (roleId: string) => {
    const role = PREDEFINED_ROLES.find(r => r.id === roleId);
    if (role) {
      setResumeText(role.sampleProfile.resumeText);
      if (role.sampleProfile.targetJobDescription) {
        setTargetJobDescription(role.sampleProfile.targetJobDescription);
        setShowJobDescription(true);
      }
    }
  };

  const wordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Heuristic Audit</span>
          <span aria-hidden="true">·</span>
          <span>ATS Parser Simulation</span>
          <span aria-hidden="true">·</span>
          <span>Google XYZ Optimization</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
          ATS Resume Readiness Studio
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Simulate enterprise Applicant Tracking System parsers (Taleo, Greenhouse, Workday) to detect missing hard skills, passive verbs, and quantify your career impact.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Form & Upload (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white">Resume Input & File Parser</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-mono tabular-nums">{wordCount} words</span>
            </div>
          </div>

          {/* Quick Sample Loaders */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300">Load Sample Resume:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PREDEFINED_ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleLoadSampleResume(r.id)}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  {r.title}
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop File Upload */}
          <div className="relative border-2 border-dashed border-slate-700/80 hover:border-indigo-500/80 rounded-lg p-4 text-center transition-colors bg-slate-950/40">
            <input
              type="file"
              accept=".txt,.pdf,.docx,.md"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
            <div className="text-xs font-medium text-slate-200">
              Drop resume file (PDF, DOCX, TXT)
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Processed locally in memory · 5MB max
            </div>
          </div>

          {uploadError && (
            <div className="text-xs text-rose-400 bg-rose-950/30 p-2.5 rounded border border-rose-900/60">
              {uploadError}
            </div>
          )}

          {/* Direct Text Editor */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Resume Text Content
            </label>
            <textarea
              rows={12}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste plain resume text here (Summary, Experience, Projects, Education, Skills)..."
              className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 font-mono focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
            />
          </div>

          {/* Job Description Comparison Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowJobDescription(!showJobDescription)}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>{showJobDescription ? 'Hide Target Job Description' : '+ Add Target Job Description (Recommended)'}</span>
              {showJobDescription ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showJobDescription && (
              <div className="mt-2.5 space-y-1.5">
                <label className="block text-xs font-medium text-slate-400">
                  Target Job Description Text
                </label>
                <textarea
                  rows={6}
                  value={targetJobDescription}
                  onChange={(e) => setTargetJobDescription(e.target.value)}
                  placeholder="Paste target job posting responsibilities and requirements to evaluate keyword match percentage..."
                  className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Run Scan Button */}
          <button
            onClick={onScanResume}
            disabled={loading || !resumeText.trim()}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running ATS Heuristics...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Audit Resume with ATS Engine</span>
              </>
            )}
          </button>

        </div>

        {/* Right Column: ATS Diagnostic Report (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {analysis ? (
            <>
              {/* Scorecard Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Overall Score */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400 font-medium">Estimated ATS Score</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-3xl font-extrabold font-mono tabular-nums ${
                      analysis.atsScore >= 85 ? 'text-emerald-400' : analysis.atsScore >= 70 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {analysis.atsScore}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/ 100</span>
                  </div>
                  <div className="text-xs mt-2 font-medium">
                    Status: <span className="text-white">{analysis.verdict}</span>
                  </div>
                </div>

                {/* Match Percentage */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400 font-medium">Role Alignment Match</div>
                  <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
                    {analysis.matchPercentage}%
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Target: {targetRole || 'Full Stack Engineer'}
                  </div>
                </div>

                {/* Quantifiable Metrics Ratio */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400 font-medium">Quantified Bullets Ratio</div>
                  <div className="text-2xl font-bold font-mono text-indigo-400 tabular-nums mt-1">
                    {analysis.breakdown.quantifiableMetricsRatio}%
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Industry goal: &gt; 40% with metrics
                  </div>
                </div>

              </div>

              {/* 5-Dimensional Breakdown */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
                <h4 className="text-sm font-semibold text-white">ATS Heuristic Breakdown</h4>
                
                <div className="space-y-2.5 pt-1">
                  {[
                    { label: 'Section Completeness (Header, Summary, Experience, Projects, Education, Skills)', value: analysis.breakdown.sectionCompleteness },
                    { label: 'Action Verb Strength (Architected, Engineered vs Worked on, Assisted)', value: analysis.breakdown.actionVerbStrength },
                    { label: 'Quantifiable Metrics (Percentages, Latency, Headcount, Throughput)', value: analysis.breakdown.quantifiableMetricsRatio },
                    { label: 'Formatting & Layout Parsability (Single-column, standard ASCII, clean headers)', value: analysis.breakdown.formattingParsability },
                    { label: 'Keyword Density & Alignment', value: analysis.breakdown.keywordAlignment },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 truncate max-w-[80%]">{item.label}</span>
                        <span className="font-mono text-slate-200 tabular-nums">{item.value}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Keywords Box */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>Missing Keywords to Ingest</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1 font-medium">Critical Hard Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.missingKeywords.hardSkills.map((k, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-900/50">
                          + {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1 font-medium">Tools & Platforms:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.missingKeywords.toolsAndFrameworks.map((k, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-900/50">
                          + {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1 font-medium">Domain & Systems Competencies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.missingKeywords.domainCompetencies.map((k, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          + {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detected Strong Keywords */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-white mb-2.5">
                  Successfully Detected Keywords
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.detectedKeywords.map((k, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs rounded bg-emerald-950/40 text-emerald-300 border border-emerald-900/50">
                      ✓ {k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weak Bullets & Google XYZ Improvements */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">
                    Bullet Point Diagnostic & Google XYZ Formula
                  </h4>
                  <button
                    onClick={onNavigateToBulletOptimizer}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    <span>Open Optimizer Tool</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-4">
                  {analysis.weakBulletsFound.map((bullet, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2">
                      <div>
                        <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block">Original in Resume:</span>
                        <p className="text-xs text-slate-300 italic mt-0.5">"{bullet.original}"</p>
                      </div>

                      <div className="text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded border border-amber-900/40">
                        <span className="font-semibold">ATS Risk: </span>
                        {bullet.issue}
                      </div>

                      <div className="pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                            Optimized (Google XYZ Formula):
                          </span>
                          <button
                            onClick={() => handleCopyBullet(bullet.improvedExample, idx)}
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                          >
                            {copiedBulletIdx === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 text-[11px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-emerald-100 font-medium mt-1 leading-relaxed bg-emerald-950/20 p-2.5 rounded border border-emerald-900/40">
                          {bullet.improvedExample}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formatting Parsability Audit */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
                <h4 className="text-sm font-semibold text-white">ATS Formatting & Parsability Checks</h4>
                
                <div className="space-y-1.5 text-xs">
                  {analysis.formattingAudit.passed.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                  {analysis.formattingAudit.warnings.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Plan */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-900/60 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-white mb-2.5">
                  Prioritized Revision Action Plan
                </h4>
                <div className="space-y-2 text-xs">
                  {analysis.actionPlan.map((action, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-200">
                      <span className="font-mono text-indigo-400 font-bold">{i + 1}.</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

            </>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-12 text-center">
              <FileText className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">No Resume Scanned Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Paste your resume text or upload a document on the left, then click Audit Resume with ATS Engine to receive a deep heuristic diagnosis.
              </p>
              <button
                onClick={onScanResume}
                disabled={!resumeText.trim()}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                Scan Resume Now
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

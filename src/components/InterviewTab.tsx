import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Send, BookOpen, Lightbulb, ChevronRight } from 'lucide-react';
import { PREDEFINED_ROLES } from '../data/rolesData';
import { InterviewQuestion } from '../types';

interface InterviewTabProps {
  targetRole: string;
}

export const InterviewTab: React.FC<InterviewTabProps> = ({ targetRole }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | InterviewQuestion['category']>('All');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    setQuestions([]);
    setSelectedQuestion(null);
    setEvaluation(null);
    setUserAnswer('');
    try {
      const roleSkills = PREDEFINED_ROLES.find(
        (role) => role.title.toLowerCase() === targetRole.toLowerCase()
      )?.essentialSkills || [];
      const res = await fetch('/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          category: selectedCategory,
          skillGaps: roleSkills,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const matchingQuestions = selectedCategory === 'All'
          ? data.data
          : data.data.filter((question: InterviewQuestion) => question.category === selectedCategory);
        setQuestions(matchingQuestions);
        setSelectedQuestion(matchingQuestions[0] || null);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [targetRole, selectedCategory]);

  const handleEvaluate = async () => {
    if (!userAnswer.trim() || !selectedQuestion) return;
    setEvaluating(true);

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: selectedQuestion.question,
          userAnswer,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setEvaluation(data.data);
      }
    } catch (err) {
      console.error('Error evaluating answer:', err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Interview Calibration</span>
            <span aria-hidden="true">·</span>
            <span>STAR Rubric Evaluation</span>
            <span aria-hidden="true">·</span>
            <span>Bar Raiser Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            AI Mock Interview & STAR Simulator
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Practice realistic behavioral and system architecture questions calibrated to {targetRole || 'your target role'}, with automated Bar-Raiser scoring.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label htmlFor="interview-category" className="sr-only">Question category</label>
          <select
            id="interview-category"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value as 'All' | InterviewQuestion['category'])}
            className="px-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-md text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All categories</option>
            <option value="Technical Architecture">Technical Architecture</option>
            <option value="Behavioral (STAR)">Behavioral (STAR)</option>
            <option value="System Design">System Design</option>
            <option value="Problem Solving">Problem Solving</option>
          </select>
          <button
            onClick={fetchQuestions}
            disabled={loadingQuestions}
            className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 border border-slate-700/80 rounded-md text-slate-200 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingQuestions ? 'animate-spin' : ''}`} />
            <span>Generate New Batch</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Question Selection & Answering Canvas (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Question List */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Select Question to Practice:
            </h3>

            <div className="space-y-2">
              {questions.length === 0 && !loadingQuestions && (
                <p className="py-5 text-center text-xs text-slate-400">No questions are available for this selection.</p>
              )}
              {questions.map((q) => {
                const isSelected = selectedQuestion?.id === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestion(q);
                      setEvaluation(null);
                      setUserAnswer('');
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/80 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                      <span className="text-indigo-400">{q.category}</span>
                    </div>
                    <p className="font-medium line-clamp-2">{q.question}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Detail & User Answer Input */}
          {selectedQuestion && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block mb-1">
                  Active Question · {selectedQuestion.category}
                </span>
                <h4 className="text-sm font-semibold text-white leading-relaxed">
                  {selectedQuestion.question}
                </h4>
                <p className="text-xs text-slate-400 mt-1 italic">
                  Interviewer Context: {selectedQuestion.context}
                </p>
              </div>

              {/* STAR Guidance Pill Tabs */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1 text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Recommended STAR Structure:</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  <strong className="text-slate-300">Situation:</strong> {selectedQuestion.idealAnswerRubric.situation.slice(0, 80)}...
                  <br />
                  <strong className="text-slate-300">Action:</strong> {selectedQuestion.idealAnswerRubric.action.slice(0, 80)}...
                </p>
              </div>

              {/* User Answer Textarea */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Your Response (Draft or Bullet Points)
                </label>
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Outline your Situation, Task, Action, and Result with quantifiable outcomes..."
                  className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-100 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Evaluate Button */}
              <button
                onClick={handleEvaluate}
                disabled={evaluating || !userAnswer.trim()}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {evaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Evaluating STAR Rubric...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit & Evaluate Answer</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Right Column: AI Evaluation & Rubric Benchmark (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {evaluation ? (
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              
              {/* Scorecard Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Interview Performance Score</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                      {evaluation.score}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/ 100</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Bar-Raiser Verdict</span>
                  <span className="text-sm font-semibold text-emerald-400">
                    {evaluation.verdict}
                  </span>
                </div>
              </div>

              {/* STAR Adherence Breakdown */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  STAR Method Alignment:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800">
                    <span className="font-mono text-indigo-400 font-semibold block mb-0.5">S (Situation)</span>
                    <span className="text-slate-300 text-[11px] leading-relaxed">{evaluation.starAdherence?.situation}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800">
                    <span className="font-mono text-indigo-400 font-semibold block mb-0.5">T (Task)</span>
                    <span className="text-slate-300 text-[11px] leading-relaxed">{evaluation.starAdherence?.task}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800">
                    <span className="font-mono text-indigo-400 font-semibold block mb-0.5">A (Action)</span>
                    <span className="text-slate-300 text-[11px] leading-relaxed">{evaluation.starAdherence?.action}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800">
                    <span className="font-mono text-indigo-400 font-semibold block mb-0.5">R (Result)</span>
                    <span className="text-slate-300 text-[11px] leading-relaxed">{evaluation.starAdherence?.result}</span>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="space-y-3 pt-2">
                <div>
                  <h5 className="text-xs font-semibold text-white mb-1.5">What Worked Well:</h5>
                  <div className="space-y-1">
                    {evaluation.strengths?.map((s: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-white mb-1.5">Coaching Tips to Elevate Answer:</h5>
                  <div className="space-y-1">
                    {evaluation.areasForImprovement?.map((tip: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-amber-300">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Exemplar Model Response */}
              <div className="pt-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block mb-1.5">
                  Exemplar Bar-Raiser Answer:
                </span>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed bg-emerald-950/20 p-3.5 rounded-lg border border-emerald-900/40">
                  {evaluation.improvedSTARSample}
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-12 text-center">
              <MessageSquare className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">Select a Question & Practice</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Select any question on the left, type out your response utilizing the STAR structure, and receive an instant Bar-Raiser performance audit.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

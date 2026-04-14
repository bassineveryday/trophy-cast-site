'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, BarChart3, Sparkles, Loader2, Users } from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

interface QuestionStat {
  questionId: string;
  questionText: string;
  questionType: string;
  totalResponses: number;
  average?: number;
  breakdown?: Record<string, number>;
  answers?: string[];
}

interface SurveyResultData {
  survey: {
    id: string;
    title: string;
    status: string;
    ai_summary: string | null;
  };
  totalRespondents: number;
  questionStats: QuestionStat[];
}

function PasswordGate({ onUnlock }: { onUnlock: (pw: string) => void }) {
  const [pw, setPw] = useState('');
  return (
    <div className="min-h-screen bg-[#0C1A23] flex items-center justify-center p-6">
      <div className="bg-[#162D3D] rounded-xl p-8 max-w-sm w-full">
        <h1 className="text-xl font-bold text-[#D4AF37] mb-4 font-serif">🔒 Admin Access</h1>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && pw && onUnlock(pw)}
          placeholder="Enter admin password"
          className="w-full px-4 py-3 rounded-lg bg-[#0C1A23] text-[#F5F1E6] border border-[#2A4A5F] focus:border-[#D4AF37] outline-none mb-4"
        />
        <button
          onClick={() => pw && onUnlock(pw)}
          className="w-full py-3 bg-[#D4AF37] text-[#0C1A23] font-bold rounded-lg hover:bg-[#C4A030] transition-colors"
        >
          Unlock
        </button>
      </div>
    </div>
  );
}

function RatingBar({ value, count, total }: { value: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-[#D4AF37] w-6 text-right font-mono">{value}</span>
      <div className="flex-1 bg-[#0C1A23] rounded-full h-5 overflow-hidden">
        <div
          className="bg-[#D4AF37] h-full rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[#C9D3DA] w-16 text-right">{count} ({pct}%)</span>
    </div>
  );
}

function QuestionResult({ stat }: { stat: QuestionStat }) {
  const isChoice = stat.questionType === 'multiple_choice' || stat.questionType === 'yes_no';
  const isRating = stat.questionType === 'rating';
  const isText = stat.questionType === 'open_text';
  const breakdown = stat.breakdown ?? {};
  const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-[#162D3D] border border-[#2A4A5F] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-[#F5F1E6] font-semibold text-sm">{stat.questionText}</h3>
        <span className="text-xs text-[#546674] whitespace-nowrap ml-3">{stat.totalResponses} responses</span>
      </div>

      {isChoice && (
        <div className="space-y-2">
          {sorted.map(([opt, count]) => (
            <RatingBar key={opt} value="" count={count} total={stat.totalResponses} />
          ))}
          {sorted.map(([opt, count]) => {
            const pct = stat.totalResponses > 0 ? Math.round((count / stat.totalResponses) * 100) : 0;
            return (
              <div key={opt} className="flex items-center gap-3 text-sm">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#C9D3DA]">{opt}</span>
                    <span className="text-[#D4AF37] font-mono">{pct}%</span>
                  </div>
                  <div className="bg-[#0C1A23] rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-[#4FC3F7] h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-[#546674] w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {isRating && (
        <div className="space-y-2">
          <div className="text-center mb-3">
            <span className="text-3xl font-bold text-[#D4AF37]">{stat.average}</span>
            <span className="text-sm text-[#546674]"> / 5</span>
          </div>
          {['5', '4', '3', '2', '1'].map((v) => (
            <RatingBar key={v} value={v} count={breakdown[v] ?? 0} total={stat.totalResponses} />
          ))}
        </div>
      )}

      {isText && stat.answers && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {stat.answers.map((a, i) => (
            <div key={i} className="bg-[#0C1A23] rounded-lg px-3 py-2 text-sm text-[#C9D3DA] border-l-2 border-[#4FC3F7]">
              &ldquo;{a}&rdquo;
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SurveyResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { password, unlocked, unlock } = useAdminAuth();
  const [data, setData] = useState<SurveyResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const fetchResults = useCallback(async () => {
    if (!password) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/surveys/${id}/results`, {
        headers: { 'x-admin-password': password },
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error); return; }
      setData(json);
    } catch {
      setError('Failed to load results.');
    } finally {
      setLoading(false);
    }
  }, [id, password]);

  useEffect(() => {
    if (unlocked) fetchResults();
  }, [unlocked, fetchResults]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/admin/surveys/${id}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (res.ok) {
        fetchResults(); // Refresh to show new AI summary
      } else {
        setError(json.error);
      }
    } catch {
      setError('AI analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (!unlocked) return <PasswordGate onUnlock={unlock} />;

  return (
    <div className="min-h-screen bg-[#0C1A23] text-[#F5F1E6]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/survey" className="text-[#546674] hover:text-[#C9D3DA]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[#D4AF37] font-serif flex items-center gap-2">
            <BarChart3 className="w-6 h-6" /> Survey Results
          </h1>
        </div>

        {loading && <div className="text-[#546674] text-center py-12">Loading results...</div>}
        {error && <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>}

        {data && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#162D3D] border border-[#2A4A5F] rounded-xl p-5">
              <h2 className="text-lg font-bold text-[#F5F1E6]">{data.survey.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-[#546674]">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {data.totalRespondents} respondents</span>
                <span className={`px-2 py-0.5 rounded text-xs border ${
                  data.survey.status === 'active' ? 'bg-green-900/40 text-green-300 border-green-700' :
                  data.survey.status === 'closed' ? 'bg-red-900/40 text-red-300 border-red-700' :
                  'bg-yellow-900/40 text-yellow-300 border-yellow-700'
                }`}>{data.survey.status}</span>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-[#0C1A23] border border-purple-800/40 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Ask DBM — AI Intelligence Report
                </h3>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-800 text-purple-100 text-xs font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  {data.survey.ai_summary ? 'Re-analyze' : 'Generate Analysis'}
                </button>
              </div>
              {data.survey.ai_summary ? (
                <div className="text-sm text-[#C9D3DA] whitespace-pre-wrap leading-relaxed">{data.survey.ai_summary}</div>
              ) : (
                <p className="text-sm text-[#546674] italic">
                  No AI analysis yet. Click &ldquo;Generate Analysis&rdquo; to have Ask DBM compile a full report from all responses.
                </p>
              )}
            </div>

            {/* Question-by-question results */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#4FC3F7] uppercase tracking-wider">
                Question-by-Question Breakdown
              </h3>
              {data.questionStats.map((stat) => (
                <QuestionResult key={stat.questionId} stat={stat} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

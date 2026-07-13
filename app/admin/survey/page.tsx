'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Plus,
  Trash2,
  Send,
  BarChart3,
  Sparkles,
  ArrowLeft,
  GripVertical,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

type QuestionType = 'multiple_choice' | 'rating' | 'open_text' | 'yes_no';

interface QuestionDraft {
  questionText: string;
  questionType: QuestionType;
  options: string[];
  required: boolean;
}

interface Survey {
  id: string;
  title: string;
  description: string | null;
  status: 'draft' | 'active' | 'closed';
  created_at: string;
  closes_at: string | null;
  ai_summary: string | null;
}

const QUESTION_TYPES: { value: QuestionType; label: string; desc: string }[] = [
  { value: 'multiple_choice', label: 'Multiple Choice', desc: 'Pick one option' },
  { value: 'rating', label: 'Rating (1–5)', desc: 'Rate on a scale' },
  { value: 'open_text', label: 'Open Text', desc: 'Free-form answer' },
  { value: 'yes_no', label: 'Yes / No', desc: 'Simple yes or no' },
];

function emptyQuestion(): QuestionDraft {
  return { questionText: '', questionType: 'multiple_choice', options: ['', ''], required: true };
}

// ─── Password gate (same pattern as weekly email page) ──────────────────────
function PasswordGate({ onUnlock }: { onUnlock: (pw: string) => void }) {
  const [pw, setPw] = useState('');
  return (
    <div className="min-h-screen bg-[#0C1A23] flex items-center justify-center p-6">
      <div className="bg-[#162D3D] rounded-xl p-8 max-w-sm w-full">
        <h1 className="text-xl font-bold text-trophyGold mb-4 font-serif">🔒 Admin Access</h1>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && pw && onUnlock(pw)}
          placeholder="Enter admin password"
          className="w-full px-4 py-3 rounded-lg bg-[#0C1A23] text-[#F5F1E6] border border-[#2A4A5F] focus:border-trophyGold outline-none mb-4"
        />
        <button
          onClick={() => pw && onUnlock(pw)}
          className="w-full py-3 bg-trophyGold text-[#0C1A23] font-bold rounded-lg hover:bg-[#B5953E] transition-colors"
        >
          Unlock
        </button>
      </div>
    </div>
  );
}

// ─── Survey Builder (create new survey) ─────────────────────────────────────
function SurveyBuilder({
  password,
  onCreated,
}: {
  password: string;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => setQuestions([...questions, emptyQuestion()]);

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, patch: Partial<QuestionDraft>) => {
    setQuestions(questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)));
  };

  const addOption = (qIdx: number) => {
    const q = questions[qIdx];
    updateQuestion(qIdx, { options: [...q.options, ''] });
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    const q = questions[qIdx];
    if (q.options.length <= 2) return;
    updateQuestion(qIdx, { options: q.options.filter((_, i) => i !== oIdx) });
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const q = questions[qIdx];
    updateQuestion(qIdx, { options: q.options.map((o, i) => (i === oIdx ? value : o)) });
  };

  const handleCreate = async () => {
    setError('');
    if (!title.trim()) { setError('Survey title is required.'); return; }

    const validQuestions = questions.filter((q) => q.questionText.trim());
    if (validQuestions.length === 0) { setError('Add at least one question.'); return; }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          title: title.trim(),
          description: description.trim() || null,
          questions: validQuestions.map((q) => ({
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.questionType === 'multiple_choice' ? q.options.filter((o) => o.trim()) : undefined,
            required: q.required,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to create survey.'); return; }
      onCreated();
    } catch {
      setError('Network error.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-trophyGold font-serif flex items-center gap-2">
        <Plus className="w-5 h-5" /> Create New Survey
      </h2>

      {error && <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div>
        <label className="block text-sm text-[#C9D3DA] mb-1">Survey Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Post-Doris Tournament Feedback"
          className="w-full px-4 py-3 rounded-lg bg-[#0C1A23] text-[#F5F1E6] border border-[#2A4A5F] focus:border-trophyGold outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-[#C9D3DA] mb-1">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief intro for the email and survey page..."
          rows={2}
          className="w-full px-4 py-3 rounded-lg bg-[#0C1A23] text-[#F5F1E6] border border-[#2A4A5F] focus:border-trophyGold outline-none resize-none"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[#4FC3F7] uppercase tracking-wider">Questions</h3>
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="bg-[#132532] border border-[#2A4A5F] rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-2">
              <GripVertical className="w-4 h-4 text-[#546674] mt-3 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <input
                    value={q.questionText}
                    onChange={(e) => updateQuestion(qIdx, { questionText: e.target.value })}
                    placeholder={`Question ${qIdx + 1}`}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#0C1A23] text-[#F5F1E6] border border-[#2A4A5F] focus:border-trophyGold outline-none text-sm"
                  />
                  <select
                    value={q.questionType}
                    onChange={(e) => updateQuestion(qIdx, { questionType: e.target.value as QuestionType })}
                    className="px-3 py-2 rounded-lg bg-[#0C1A23] text-[#C9D3DA] border border-[#2A4A5F] outline-none text-sm"
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {q.questionType === 'multiple_choice' && (
                  <div className="space-y-2 pl-2">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border border-[#546674]" />
                        <input
                          value={opt}
                          onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                          placeholder={`Option ${oIdx + 1}`}
                          className="flex-1 px-3 py-1.5 rounded bg-[#0C1A23] text-[#F5F1E6] border border-[#2A4A5F] focus:border-trophyGold outline-none text-sm"
                        />
                        {q.options.length > 2 && (
                          <button onClick={() => removeOption(qIdx, oIdx)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => addOption(qIdx)} className="text-xs text-[#4FC3F7] hover:underline">+ Add option</button>
                  </div>
                )}

                {q.questionType === 'rating' && (
                  <p className="text-xs text-[#546674] pl-2">Members will rate 1–5 stars</p>
                )}
                {q.questionType === 'yes_no' && (
                  <p className="text-xs text-[#546674] pl-2">Members will choose Yes or No</p>
                )}
                {q.questionType === 'open_text' && (
                  <p className="text-xs text-[#546674] pl-2">Members will type a free-form response</p>
                )}
              </div>
              {questions.length > 1 && (
                <button onClick={() => removeQuestion(qIdx)} className="text-red-400 hover:text-red-300 mt-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        <button onClick={addQuestion} className="flex items-center gap-2 text-sm text-[#4FC3F7] hover:text-trophyGold transition-colors">
          <Plus className="w-4 h-4" /> Add Question
        </button>
      </div>

      <button
        onClick={handleCreate}
        disabled={saving}
        className="w-full py-3 bg-trophyGold text-[#0C1A23] font-bold rounded-lg hover:bg-[#B5953E] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardList className="w-4 h-4" />}
        {saving ? 'Creating...' : 'Create Survey'}
      </button>
    </div>
  );
}

// ─── Survey List + Actions ──────────────────────────────────────────────────
function SurveyList({ password }: { password: string }) {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/surveys?club_id=DBM');
      const data = await res.json();
      setSurveys(data.surveys ?? []);
    } catch {
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSurveys(); }, [fetchSurveys]);

  const handleSend = async (surveyId: string) => {
    if (!confirm('Send this survey to ALL subscribers? This will also activate the survey.')) return;
    setActionLoading(surveyId);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/surveys/${surveyId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(`❌ ${data.error}`); return; }
      setMessage(`✅ Sent to ${data.recipientCount} subscribers!`);
      fetchSurveys();
    } catch {
      setMessage('❌ Network error.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleClose = async (surveyId: string) => {
    if (!confirm('Close this survey? No more responses will be accepted.')) return;
    setActionLoading(surveyId);
    try {
      const res = await fetch('/api/admin/surveys', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, surveyId, status: 'closed' }),
      });
      if (res.ok) fetchSurveys();
    } finally {
      setActionLoading(null);
    }
  };

  const handleAnalyze = async (surveyId: string) => {
    setActionLoading(surveyId);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/surveys/${surveyId}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(`❌ ${data.error}`); return; }
      setMessage('✅ AI analysis complete!');
      fetchSurveys();
    } catch {
      setMessage('❌ Network error.');
    } finally {
      setActionLoading(null);
    }
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',
    active: 'bg-green-900/40 text-green-300 border-green-700',
    closed: 'bg-red-900/40 text-red-300 border-red-700',
  };

  if (loading) return <div className="text-[#546674] text-center py-8">Loading surveys...</div>;
  if (surveys.length === 0) return <div className="text-[#546674] text-center py-8">No surveys yet. Create one above!</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-trophyGold font-serif flex items-center gap-2">
        <ClipboardList className="w-5 h-5" /> Your Surveys
      </h2>

      {message && <div className="text-sm px-4 py-2 rounded-lg bg-[#132532] text-[#C9D3DA]">{message}</div>}

      {surveys.map((s) => (
        <div key={s.id} className="bg-[#162D3D] border border-[#2A4A5F] rounded-xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-[#F5F1E6] font-semibold">{s.title}</h3>
              <p className="text-xs text-[#546674] mt-0.5">
                Created {new Date(s.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded border ${statusColors[s.status] ?? ''}`}>
              {s.status}
            </span>
          </div>

          {s.description && <p className="text-sm text-[#C9D3DA] mb-4">{s.description}</p>}

          <div className="flex flex-wrap gap-2">
            {s.status === 'draft' && (
              <button
                onClick={() => handleSend(s.id)}
                disabled={actionLoading === s.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-trophyGold text-[#0C1A23] text-sm font-semibold rounded-lg hover:bg-[#B5953E] disabled:opacity-50"
              >
                {actionLoading === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Send to Members
              </button>
            )}

            {s.status === 'active' && (
              <>
                <button
                  onClick={() => handleClose(s.id)}
                  disabled={actionLoading === s.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-800 text-red-100 text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Close Survey
                </button>
                <a
                  href={`/survey/${s.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A4A5F] text-[#C9D3DA] text-sm rounded-lg hover:bg-[#3A5A6F]"
                >
                  Preview
                </a>
              </>
            )}

            <Link
              href={`/admin/survey/${s.id}/results`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A4A5F] text-[#C9D3DA] text-sm rounded-lg hover:bg-[#3A5A6F]"
            >
              <BarChart3 className="w-3.5 h-3.5" /> View Results
            </Link>

            {(s.status === 'active' || s.status === 'closed') && (
              <button
                onClick={() => handleAnalyze(s.id)}
                disabled={actionLoading === s.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-800 text-purple-100 text-sm font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {actionLoading === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Ask DBM — AI Analysis
              </button>
            )}
          </div>

          {s.ai_summary && (
            <div className="mt-4 bg-[#0C1A23] border border-purple-800/40 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Ask DBM — AI Analysis
              </h4>
              <div className="text-sm text-[#C9D3DA] whitespace-pre-wrap leading-relaxed">{s.ai_summary}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function SurveyAdminPage() {
  const { password, unlocked, unlock } = useAdminAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!unlocked) return <PasswordGate onUnlock={unlock} />;

  return (
    <div className="min-h-screen bg-[#0C1A23] text-[#F5F1E6]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin" className="text-[#546674] hover:text-[#C9D3DA]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-trophyGold font-serif flex items-center gap-2">
            <ClipboardList className="w-6 h-6" /> Survey Manager
          </h1>
        </div>

        <div className="space-y-10">
          <SurveyBuilder password={password} onCreated={() => setRefreshKey((k) => k + 1)} />
          <hr className="border-[#2A4A5F]" />
          <SurveyList key={refreshKey} password={password} />
        </div>
      </div>
    </div>
  );
}

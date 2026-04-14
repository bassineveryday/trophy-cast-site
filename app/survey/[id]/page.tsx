'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'rating' | 'open_text' | 'yes_no';
  options: string[] | { max: number } | null;
  required: boolean;
  sort_order: number;
}

interface SurveyData {
  survey: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    club_id: string;
  };
  questions: Question[];
}

export default function SurveyPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<SurveyData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const fetchSurvey = useCallback(async () => {
    try {
      const res = await fetch(`/api/surveys/${id}`);
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Survey not found.'); return; }
      if (json.survey.status !== 'active') { setError('This survey is no longer accepting responses.'); return; }
      setData(json);
      // Parse options from JSON string if needed
      for (const q of json.questions) {
        if (typeof q.options === 'string') {
          try { q.options = JSON.parse(q.options); } catch { q.options = []; }
        }
        // Ensure rating options are treated as { max } object, not array
      }
    } catch {
      setError('Failed to load survey.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchSurvey(); }, [fetchSurvey]);

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!data) return;
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter your email so we know who responded.');
      return;
    }

    // Validate required questions
    const missing = data.questions.filter((q) => q.required && !answers[q.id]?.trim());
    if (missing.length > 0) {
      setError(`Please answer all required questions. Missing: "${missing[0].question_text}"`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/surveys/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          respondentId: email.trim().toLowerCase(),
          answers: Object.entries(answers)
            .filter(([, v]) => v.trim())
            .map(([questionId, answer]) => ({ questionId, answer: answer.trim() })),
        }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Failed to submit.'); return; }
      setSubmitted(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C1A23] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  // ─── Error state ──────────────────────────────────────────────────────────
  if (!data) {
    return (
      <div className="min-h-screen bg-[#0C1A23] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-[#C9D3DA] text-lg">{error || 'Survey not found.'}</p>
          <a href="https://trophycast.app" className="text-[#4FC3F7] text-sm hover:underline mt-4 inline-block">
            Go to Trophy Cast →
          </a>
        </div>
      </div>
    );
  }

  // ─── Submitted state ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0C1A23] flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-[#162D3D] rounded-xl p-8">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#D4AF37] font-serif mb-2">Thank You!</h1>
          <p className="text-[#C9D3DA]">
            Your feedback has been recorded. The Denver Bassmasters board will review all responses
            and Trophy Cast&apos;s AI will compile a full analysis report.
          </p>
          <a href="https://trophycast.app" className="inline-block mt-6 px-6 py-3 bg-[#D4AF37] text-[#0C1A23] font-bold rounded-lg hover:bg-[#C4A030]">
            Back to Trophy Cast
          </a>
        </div>
      </div>
    );
  }

  // ─── Survey form ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0C1A23] text-[#F5F1E6]">
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Image
            src="https://trophycast.app/tc-logos/tc-email-header.png"
            alt="Trophy Cast"
            width={60}
            height={60}
            className="mx-auto mb-3"
            unoptimized
          />
          <h1 className="text-2xl font-bold text-[#D4AF37] font-serif">{data.survey.title}</h1>
          {data.survey.description && (
            <p className="text-[#C9D3DA] mt-2 text-sm">{data.survey.description}</p>
          )}
          <p className="text-[#546674] text-xs mt-2">Denver Bassmasters · Powered by Trophy Cast</p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm text-[#C9D3DA] mb-1">Your Email <span className="text-red-400">*</span></label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-lg bg-[#162D3D] text-[#F5F1E6] border border-[#2A4A5F] focus:border-[#D4AF37] outline-none"
          />
          <p className="text-xs text-[#546674] mt-1">So we can track who&apos;s responded (one submission per person).</p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {data.questions.map((q, idx) => (
            <div key={q.id} className="bg-[#162D3D] border border-[#2A4A5F] rounded-xl p-5">
              <label className="block text-sm font-semibold text-[#F5F1E6] mb-3">
                {idx + 1}. {q.question_text}
                {q.required && <span className="text-red-400 ml-1">*</span>}
              </label>

              {q.question_type === 'multiple_choice' && Array.isArray(q.options) && (
                <div className="space-y-2">
                  {(q.options as string[]).map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        answers[q.id] === opt ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#546674] group-hover:border-[#C9D3DA]'
                      }`}>
                        {answers[q.id] === opt && <div className="w-1.5 h-1.5 bg-[#0C1A23] rounded-full" />}
                      </div>
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => setAnswer(q.id, opt)}
                        className="sr-only"
                      />
                      <span className="text-sm text-[#C9D3DA] group-hover:text-[#F5F1E6]">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.question_type === 'yes_no' && (
                <div className="flex gap-3">
                  {['Yes', 'No'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAnswer(q.id, opt)}
                      className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        answers[q.id] === opt
                          ? 'bg-[#D4AF37] text-[#0C1A23]'
                          : 'bg-[#0C1A23] text-[#C9D3DA] border border-[#2A4A5F] hover:border-[#D4AF37]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.question_type === 'rating' && (() => {
                const ratingMax = (q.options && !Array.isArray(q.options) && typeof q.options === 'object' && 'max' in q.options)
                  ? (q.options as { max: number }).max
                  : 5;
                return (
                  <div className={`flex gap-2 ${ratingMax > 5 ? 'flex-wrap' : 'justify-center'}`}>
                    {Array.from({ length: ratingMax }, (_, i) => String(i + 1)).map((v) => (
                      <button
                        key={v}
                        onClick={() => setAnswer(q.id, v)}
                        className={`w-11 h-11 rounded-lg text-base font-bold transition-colors ${
                          answers[q.id] === v
                            ? 'bg-[#D4AF37] text-[#0C1A23]'
                            : 'bg-[#0C1A23] text-[#C9D3DA] border border-[#2A4A5F] hover:border-[#D4AF37]'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                );
              })()}

              {q.question_type === 'open_text' && (
                <textarea
                  value={answers[q.id] ?? ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  placeholder="Type your answer..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-[#0C1A23] text-[#F5F1E6] border border-[#2A4A5F] focus:border-[#D4AF37] outline-none resize-none text-sm"
                />
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full mt-8 py-4 bg-[#D4AF37] text-[#0C1A23] font-bold text-lg rounded-xl hover:bg-[#C4A030] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          {submitting ? 'Submitting...' : 'Submit Survey'}
        </button>

        <p className="text-xs text-[#546674] text-center mt-4">
          Your responses are stored securely by Trophy Cast and reviewed by Denver Bassmasters officers.
        </p>
      </div>
    </div>
  );
}

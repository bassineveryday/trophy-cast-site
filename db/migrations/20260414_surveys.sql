-- ============================================================================
-- Survey System tables for Trophy Cast
-- Supports: create survey → email to members → collect responses → AI analysis
-- ============================================================================
-- 1. Surveys (one per survey created by an officer)
CREATE TABLE IF NOT EXISTS surveys (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id text NOT NULL DEFAULT 'DBM',
    title text NOT NULL,
    description text,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
    created_by text,
    -- officer email or name
    closes_at timestamptz,
    -- optional deadline
    ai_summary text,
    -- AI-generated analysis (filled after close)
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
-- 2. Survey questions (ordered within a survey)
CREATE TABLE IF NOT EXISTS survey_questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    sort_order integer NOT NULL DEFAULT 0,
    question_text text NOT NULL,
    question_type text NOT NULL DEFAULT 'multiple_choice' CHECK (
        question_type IN (
            'multiple_choice',
            'rating',
            'open_text',
            'yes_no'
        )
    ),
    options jsonb,
    -- for multiple_choice: ["Option A", "Option B", ...]
    required boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);
-- 3. Survey responses (one row per question per respondent)
CREATE TABLE IF NOT EXISTS survey_responses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    question_id uuid NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
    respondent_id text NOT NULL,
    -- email or unique token
    answer text,
    -- the chosen option, rating value, or free text
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (question_id, respondent_id) -- one answer per question per person
);
-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_surveys_club_status ON surveys(club_id, status);
CREATE INDEX IF NOT EXISTS idx_survey_questions_survey ON survey_questions(survey_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_question ON survey_responses(question_id);
-- RLS (enable but allow all for now — admin-only access via service role key)
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
-- Public can INSERT responses (filling out a survey) and SELECT surveys/questions (viewing a survey)
CREATE POLICY "Anyone can view active surveys" ON surveys FOR
SELECT USING (status = 'active');
CREATE POLICY "Anyone can view survey questions" ON survey_questions FOR
SELECT USING (true);
CREATE POLICY "Anyone can submit responses" ON survey_responses FOR
INSERT WITH CHECK (true);
CREATE POLICY "Service role full access surveys" ON surveys FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access questions" ON survey_questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access responses" ON survey_responses FOR ALL USING (true) WITH CHECK (true);
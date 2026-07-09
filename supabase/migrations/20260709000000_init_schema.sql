-- 1. 방명록 테이블 생성
CREATE TABLE IF NOT EXISTS guestbook (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    writer_name VARCHAR(50) NOT NULL,
    password_hash VARCHAR(100),
    content TEXT NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE NOT NULL,
    theme_mode VARCHAR(10) NOT NULL
);

-- 2. 방문 통계 테이블 생성
CREATE TABLE IF NOT EXISTS visit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    theme_mode VARCHAR(10) NOT NULL,
    referrer VARCHAR(255),
    user_agent TEXT
);

-- 3. RLS (Row Level Security) 활성화
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_logs ENABLE ROW LEVEL SECURITY;

-- 4. 방명록(guestbook) RLS 정책 설정
-- A. 누구나 숨겨지지 않은 방명록 글을 볼 수 있음
CREATE POLICY select_public_guestbook ON guestbook
    FOR SELECT
    USING (is_hidden = false);

-- B. 누구나 방명록 글을 작성할 수 있음
CREATE POLICY insert_public_guestbook ON guestbook
    FOR INSERT
    WITH CHECK (true);

-- C. 인증된 관리자(예비 부부)는 모든 방명록 권한을 가짐 (숨김 해제, 삭제 등)
CREATE POLICY all_admin_guestbook ON guestbook
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. 방문 통계(visit_logs) RLS 정책 설정
-- A. 누구나 방문 통계를 남길 수 있음 (접속 시 insert)
CREATE POLICY insert_public_visit_logs ON visit_logs
    FOR INSERT
    WITH CHECK (true);

-- B. 인증된 관리자만 방문 통계를 조회할 수 있음
CREATE POLICY select_admin_visit_logs ON visit_logs
    FOR SELECT
    TO authenticated
    USING (true);

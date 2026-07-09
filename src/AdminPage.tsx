import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, fetchAllGuestbook, deleteGuestbookEntry, fetchVisitStats } from '@/lib/supabase'
import type { GuestbookEntry } from '@/lib/supabase'
import { LogOut, Trash2, Sun, Moon, Eye, EyeOff } from 'lucide-react'

type AdminView = 'guestbook' | 'stats'

export default function AdminPage() {
  const [session, setSession] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [view, setView] = useState<AdminView>('guestbook')
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [stats, setStats] = useState<any[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s) setSession(s)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => listener?.subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  const loadEntries = useCallback(async () => {
    try {
      const data = await fetchAllGuestbook()
      setEntries(data)
    } catch { /* silent */ }
  }, [])

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchVisitStats()
      setStats(data)
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    if (!session) return
    if (view === 'guestbook') loadEntries()
    else loadStats()
  }, [session, view, loadEntries, loadStats])

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await deleteGuestbookEntry(id)
      setEntries((prev) => prev.filter((e) => e.id !== id))
    } catch {
      alert('삭제 실패')
    }
  }

  if (!session) {
    return (
      <div className="admin-page">
        <div className="admin-login-card">
          <h1 className="admin-login-title">관리자 로그인</h1>
          <form onSubmit={handleLogin} className="admin-login-form">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              required
            />
            <div className="admin-password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                required
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p className="admin-error">{error}</p>}
            <button type="submit" className="admin-submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          <button type="button" className="admin-back-btn" onClick={() => navigate('/')}>
            ← 청첩장으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1 className="admin-header-title">대시보드</h1>
        <div className="admin-header-right">
          <span className="admin-email">{session.user.email}</span>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={14} /> 로그아웃
          </button>
        </div>
      </header>

      <nav className="admin-tabs">
        <button
          type="button"
          className={`admin-tab${view === 'guestbook' ? ' admin-tab--active' : ''}`}
          onClick={() => setView('guestbook')}
        >
          방명록 관리
        </button>
        <button
          type="button"
          className={`admin-tab${view === 'stats' ? ' admin-tab--active' : ''}`}
          onClick={() => setView('stats')}
        >
          접속 통계
        </button>
      </nav>

      <div className="admin-content">
        {view === 'guestbook' && (
          <div className="admin-guestbook">
            <p className="admin-count">총 {entries.length}개의 메시지</p>
            {entries.length === 0 ? (
              <p className="admin-empty">방명록이 비어 있습니다.</p>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="admin-entry">
                  <div className="admin-entry-top">
                    <span className="admin-entry-name">{entry.writer_name}</span>
                    <span className="admin-entry-mode">
                      {entry.theme_mode === 'light' ? <Sun size={11} /> : <Moon size={11} />}
                      {entry.theme_mode}
                    </span>
                  </div>
                  <p className="admin-entry-content">{entry.content}</p>
                  <div className="admin-entry-bottom">
                    <span className="admin-entry-date">{formatDate(entry.created_at)}</span>
                    <button
                      type="button"
                      className="admin-delete-btn"
                      onClick={() => handleDelete(entry.id)}
                      aria-label="삭제"
                    >
                      <Trash2 size={13} />
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {view === 'stats' && (
          <div className="admin-stats">
            {stats.length === 0 ? (
              <p className="admin-empty">아직 방문 기록이 없습니다.</p>
            ) : (
              <table className="admin-stats-table">
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>전체</th>
                    <th>라이트</th>
                    <th>다크</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((row) => (
                    <tr key={row.date}>
                      <td>{row.date}</td>
                      <td>{row.total}</td>
                      <td>{row.light}</td>
                      <td>{row.dark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p className="admin-stats-total">
              누적 방문: {stats.reduce((sum: number, r: any) => sum + r.total, 0)}회
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
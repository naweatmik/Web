import { useState, useEffect } from 'react'
import { supabase, isSupabaseReady } from '../lib/supabase'
import { curriculum as defaultCurriculum, instructor as defaultInstructor1, instructor2 as defaultInstructor2 } from '../data/content'
import { LogOut, Upload, Trash2, Loader2, Save, Plus } from 'lucide-react'

const defaultInstructors = {
  1: defaultInstructor1,
  2: defaultInstructor2,
}

// ─── Style tokens ─────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    background: '#0A0A0A',
    color: '#ffffff',
    fontFamily: 'inherit',
  },
  inner: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '48px 24px 80px',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  label: {
    display: 'block',
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: '#ffffff',
    color: '#000',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
  btnDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(239,68,68,0.15)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: 13,
    cursor: 'pointer',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
    marginTop: 0,
  },
}

// ─── Reusable field wrapper ───────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={S.label}>{label}</label>}
      {children}
    </div>
  )
}

// ─── Feedback messages ────────────────────────────────────────────────────────
function Msg({ error, success }) {
  if (error) return <p style={{ color: '#f87171', fontSize: 13, margin: '8px 0 0' }}>{error}</p>
  if (success) return <p style={{ color: '#4ade80', fontSize: 13, margin: '8px 0 0' }}>{success}</p>
  return null
}

// ─── Tab 1 – 작업물 ────────────────────────────────────────────────────────────
function WorksTab() {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [link, setLink] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { fetchWorks() }, [])

  async function fetchWorks() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setWorks(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    setError('')
    setSuccess('')
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`
      const { error: storageError } = await supabase.storage
        .from('works-images')
        .upload(fileName, file)
      if (storageError) throw storageError

      const { data: { publicUrl } } = supabase.storage
        .from('works-images')
        .getPublicUrl(fileName)

      const { error: dbError } = await supabase
        .from('works')
        .insert({ image_url: publicUrl, link: link || null })
      if (dbError) throw dbError

      setSuccess('등록 완료!')
      setFile(null)
      setLink('')
      e.target.reset()
      fetchWorks()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(work) {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      const fileName = work.image_url.split('/').pop()
      await supabase.storage.from('works-images').remove([fileName])
      const { error } = await supabase.from('works').delete().eq('id', work.id)
      if (error) throw error
      fetchWorks()
    } catch (err) {
      alert('삭제 실패: ' + err.message)
    }
  }

  return (
    <div>
      {/* Upload form */}
      <div style={{ ...S.card, marginBottom: 32 }}>
        <h2 style={S.sectionTitle}>작업물 추가</h2>
        <form onSubmit={handleUpload}>
          <Field label="이미지 파일 *">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              required
              style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }}
            />
          </Field>
          <Field label="포트폴리오 링크 (선택)">
            <input
              type="url"
              placeholder="https://..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              style={S.input}
            />
          </Field>
          <Msg error={error} success={success} />
          <button
            type="submit"
            disabled={uploading || !file}
            style={{ ...S.btnPrimary, marginTop: 16, opacity: uploading || !file ? 0.5 : 1 }}
          >
            {uploading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={15} />}
            {uploading ? '업로드 중...' : '등록'}
          </button>
        </form>
      </div>

      {/* Works grid */}
      <h2 style={S.sectionTitle}>등록된 작업물 ({works.length}개)</h2>
      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>불러오는 중...</p>
      ) : works.length === 0 ? (
        <div style={{ ...S.card, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14, padding: '48px 24px' }}>
          등록된 작업물이 없습니다
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {works.map((work) => (
            <div key={work.id} style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
              <img
                src={work.image_url}
                alt="작업물"
                style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                {work.link ? (
                  <a
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#60a5fa', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}
                  >
                    링크 열기
                  </a>
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>링크 없음</span>
                )}
                <button onClick={() => handleDelete(work)} style={S.btnDanger}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Tab 2 – 강사 정보 ─────────────────────────────────────────────────────────
const emptyInstructor = { name: '', title: '', photo: '', bio: '', careers: '' }

function InstructorCard({ slot, label }) {
  const [form, setForm] = useState(emptyInstructor)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('instructors')
          .select('*')
          .eq('slot', slot)
          .single()
        if (error && error.code !== 'PGRST116') throw error
        const src = data || defaultInstructors[slot] || {}
        setForm({
          name: src.name || '',
          title: src.title || '',
          photo: src.photo || '',
          bio: src.bio || '',
          careers: Array.isArray(src.careers) ? src.careers.join('\n') : (src.careers || ''),
        })
      } catch (err) {
        const src = defaultInstructors[slot] || {}
        setForm({
          name: src.name || '',
          title: src.title || '',
          photo: src.photo || '',
          bio: src.bio || '',
          careers: Array.isArray(src.careers) ? src.careers.join('\n') : '',
        })
      }
    }
    load()
  }, [slot])

  function update(field, val) {
    setForm((prev) => ({ ...prev, [field]: val }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const careersArr = form.careers
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)

      const { error } = await supabase.from('instructors').upsert(
        {
          slot,
          name: form.name,
          title: form.title,
          photo: form.photo,
          bio: form.bio,
          careers: careersArr,
        },
        { onConflict: 'slot' }
      )
      if (error) throw error
      setSuccess('저장 완료!')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ ...S.card, flex: 1 }}>
      <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700 }}>{label}</h3>
      <Field label="이름">
        <input style={S.input} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="홍길동" />
      </Field>
      <Field label="직함">
        <input style={S.input} value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="웹 UIUX 전임강사" />
      </Field>
      <Field label="사진 URL">
        <input style={S.input} value={form.photo} onChange={(e) => update('photo', e.target.value)} placeholder="https://..." />
      </Field>
      <Field label="소개">
        <textarea
          style={{ ...S.input, resize: 'vertical', minHeight: 80 }}
          value={form.bio}
          onChange={(e) => update('bio', e.target.value)}
          placeholder="강사 소개 텍스트"
        />
      </Field>
      <Field label="경력 (한 줄에 하나씩)">
        <textarea
          style={{ ...S.input, resize: 'vertical', minHeight: 80 }}
          value={form.careers}
          onChange={(e) => update('careers', e.target.value)}
          placeholder={'現 SBS컴퓨터학원 강사\n前 웹 에이전시 디자이너'}
        />
      </Field>
      <Msg error={error} success={success} />
      <button
        onClick={handleSave}
        disabled={saving}
        style={{ ...S.btnPrimary, marginTop: 16, opacity: saving ? 0.5 : 1 }}
      >
        {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
        {saving ? '저장 중...' : '저장'}
      </button>
    </div>
  )
}

function InstructorsTab() {
  return (
    <div>
      <h2 style={S.sectionTitle}>강사 정보</h2>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <InstructorCard slot={1} label="강사 1" />
        <InstructorCard slot={2} label="강사 2" />
      </div>
    </div>
  )
}

// ─── Tab 3 – 커리큘럼 ──────────────────────────────────────────────────────────
function CurriculumTab() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('curriculum')
          .select('*')
          .order('step', { ascending: true })
        if (error) throw error
        if (data && data.length > 0) {
          setRows(data)
        } else {
          // pre-fill from local default
          setRows(
            defaultCurriculum.map((c) => ({
              step: c.step,
              title: c.title,
              tag: c.tag,
              color: c.color,
            }))
          )
        }
      } catch (err) {
        console.error(err)
        setRows(
          defaultCurriculum.map((c) => ({
            step: c.step,
            title: c.title,
            tag: c.tag,
            color: c.color,
          }))
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function updateRow(index, field, value) {
    setRows((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function addRow() {
    const nextStep = rows.length > 0 ? Math.max(...rows.map((r) => r.step)) + 1 : 1
    setRows((prev) => [...prev, { step: nextStep, title: '', tag: '', color: '#3B82F6' }])
  }

  async function deleteRow(index) {
    const row = rows[index]
    if (!confirm(`Step ${row.step} "${row.title}" 을 삭제하시겠습니까?`)) return
    try {
      if (row.id) {
        const { error } = await supabase.from('curriculum').delete().eq('id', row.id)
        if (error) throw error
      }
      setRows((prev) => prev.filter((_, i) => i !== index))
    } catch (err) {
      alert('삭제 실패: ' + err.message)
    }
  }

  async function handleSaveAll() {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const payload = rows.map((r) => ({
        step: r.step,
        title: r.title,
        tag: r.tag,
        color: r.color,
        ...(r.id ? { id: r.id } : {}),
      }))
      const { error } = await supabase
        .from('curriculum')
        .upsert(payload, { onConflict: 'step' })
      if (error) throw error
      setSuccess('전체 저장 완료!')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>불러오는 중...</p>
  }

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ ...S.sectionTitle, marginBottom: 0 }}>커리큘럼</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={addRow}
            style={{ ...S.btnPrimary, background: 'rgba(255,255,255,0.1)', color: '#fff' }}
          >
            <Plus size={15} /> 추가
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            style={{ ...S.btnPrimary, opacity: saving ? 0.5 : 1 }}
          >
            {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
            {saving ? '저장 중...' : '전체 저장'}
          </button>
        </div>
      </div>
      <Msg error={error} success={success} />

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '48px 1fr 120px 56px 40px',
        gap: 10,
        padding: '8px 14px',
        color: 'rgba(255,255,255,0.35)',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginTop: 12,
      }}>
        <span>Step</span>
        <span>제목</span>
        <span>태그</span>
        <span>색상</span>
        <span />
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '48px 1fr 120px 56px 40px',
              gap: 10,
              alignItems: 'center',
              ...S.card,
              padding: '12px 14px',
            }}
          >
            <input
              type="number"
              style={{ ...S.input, margin: 0, textAlign: 'center', fontWeight: 700, color: row.color || '#fff' }}
              value={row.step}
              onChange={(e) => updateRow(i, 'step', Number(e.target.value))}
            />
            <input
              style={{ ...S.input, margin: 0 }}
              value={row.title}
              onChange={(e) => updateRow(i, 'title', e.target.value)}
              placeholder="제목"
            />
            <input
              style={{ ...S.input, margin: 0 }}
              value={row.tag}
              onChange={(e) => updateRow(i, 'tag', e.target.value)}
              placeholder="태그"
            />
            <input
              type="color"
              value={row.color || '#ffffff'}
              onChange={(e) => updateRow(i, 'color', e.target.value)}
              style={{ width: 36, height: 36, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, cursor: 'pointer', background: 'transparent', padding: 2 }}
            />
            <button onClick={() => deleteRow(i)} style={{ ...S.btnDanger, padding: '6px 8px' }}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Admin component ──────────────────────────────────────────────────────
const TABS = [
  { id: 'works', label: '작업물' },
  { id: 'instructors', label: '강사 정보' },
  { id: 'curriculum', label: '커리큘럼' },
]

export default function Admin() {
  if (!isSupabaseReady) {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
        <div>
          <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Supabase 설정 필요</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            .env 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 입력하세요.
          </p>
        </div>
      </div>
    )
  }

  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('works')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (err) {
      setAuthError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  // ── Login screen ──────────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32 }}>관리자 로그인</h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={S.input}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={S.input}
            />
            {authError && <p style={{ color: '#f87171', fontSize: 13 }}>{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              style={{ ...S.btnPrimary, justifyContent: 'center', padding: '12px 20px', opacity: authLoading ? 0.5 : 1 }}
            >
              {authLoading && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              로그인
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Authenticated layout ───────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      <div style={S.inner}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>관리자 페이지</h1>
          <button
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            <LogOut size={15} />
            로그아웃
          </button>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex',
          gap: 4,
          marginBottom: 32,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 12,
          padding: 4,
          width: 'fit-content',
        }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 20px',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 700 : 400,
                background: activeTab === tab.id ? '#ffffff' : 'transparent',
                color: activeTab === tab.id ? '#000000' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'works' && <WorksTab />}
        {activeTab === 'instructors' && <InstructorsTab />}
        {activeTab === 'curriculum' && <CurriculumTab />}
      </div>

      {/* Keyframes for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

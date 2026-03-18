import { useState, useEffect } from 'react'
import { supabase, isSupabaseReady } from '../lib/supabase'
import { curriculum as defaultCurriculum, instructor as defaultInstructor1, instructor2 as defaultInstructor2, aboutCourse } from '../data/content'
import { LogOut, Upload, Trash2, Loader2, Save, Plus, Pencil, X, Check } from 'lucide-react'

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
const WORK_CATEGORIES = [
  { key: 'web',    label: '웹디자인' },
  { key: 'app',   label: '앱디자인' },
  { key: 'detail', label: '상세페이지' },
]
const CAT_COLOR = { web: '#3b82f6', app: '#a855f7', detail: '#10b981' }

function WorkCard({ work, onDelete, onSaved }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ category: work.category || 'web', link: work.link || '' })
  const [saving, setSaving] = useState(false)
  const [imgUploading, setImgUploading] = useState(false)
  const [imgHover, setImgHover] = useState(false)
  const [pdfUploading, setPdfUploading] = useState(false)
  const fileInputRef = useState(null)
  const pdfInputRef = useState(null)

  async function handleSave() {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('works')
        .update({ category: form.category, link: form.link || null })
        .eq('id', work.id)
      if (error) throw error
      setEditing(false)
      onSaved(work.id, { category: form.category, link: form.link || null })
    } catch (err) {
      alert('저장 실패: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setForm({ category: work.category || 'web', link: work.link || '' })
    setEditing(false)
  }

  async function handlePdfChange(e) {
    const uploadFile = e.target.files[0]
    if (!uploadFile) return
    setPdfUploading(true)
    try {
      const ext = uploadFile.name.split('.').pop()
      const fileName = `extra_${Date.now()}.${ext}`
      const contentType = form.category === 'app' ? 'application/pdf' : uploadFile.type
      const { error: uploadError } = await supabase.storage
        .from('works-images')
        .upload(fileName, uploadFile, { contentType })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('works-images').getPublicUrl(fileName)
      setForm(p => ({ ...p, link: publicUrl }))
    } catch (err) {
      alert('업로드 실패: ' + err.message)
    } finally {
      setPdfUploading(false)
      e.target.value = ''
    }
  }

  async function handleImageChange(e) {
    const newFile = e.target.files[0]
    if (!newFile) return
    setImgUploading(true)
    try {
      const ext = newFile.name.split('.').pop()
      const newFileName = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('works-images')
        .upload(newFileName, newFile)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('works-images')
        .getPublicUrl(newFileName)

      const { error: dbError } = await supabase
        .from('works')
        .update({ image_url: publicUrl })
        .eq('id', work.id)
      if (dbError) throw dbError

      const oldFileName = work.image_url.split('/').pop()
      await supabase.storage.from('works-images').remove([oldFileName])
      onSaved(work.id, { image_url: publicUrl })
    } catch (err) {
      alert('이미지 교체 실패: ' + err.message)
    } finally {
      setImgUploading(false)
      e.target.value = ''
    }
  }

  const catLabel = WORK_CATEGORIES.find(c => c.key === work.category)?.label || work.category || ''
  const catColor = CAT_COLOR[work.category] || '#6b7280'

  return (
    <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
      {/* 이미지 */}
      <div
        style={{ position: 'relative', cursor: 'pointer' }}
        onMouseEnter={() => setImgHover(true)}
        onMouseLeave={() => setImgHover(false)}
        onClick={() => !imgUploading && fileInputRef[0]?.click()}
      >
        <img
          src={work.image_url}
          alt="작업물"
          style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', opacity: imgHover || imgUploading ? 0.5 : 1, transition: 'opacity 0.15s' }}
        />
        {/* 카테고리 뱃지 */}
        {!editing && catLabel && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#fff', background: catColor + 'cc', padding: '3px 8px', borderRadius: 100,
            fontFamily: "'Inter', sans-serif",
          }}>{catLabel}</span>
        )}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: imgHover || imgUploading ? 1 : 0,
          transition: 'opacity 0.15s', pointerEvents: 'none',
        }}>
          {imgUploading
            ? <Loader2 size={24} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
            : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Upload size={22} color="#fff" />
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>이미지 교체</span>
              </div>
          }
        </div>
        <input type="file" accept="image/*" style={{ display: 'none' }}
          ref={(el) => { fileInputRef[0] = el }} onChange={handleImageChange} />
      </div>

      {/* 정보 영역 */}
      {editing ? (
        <div style={{ padding: '12px' }}>
          <select
            value={form.category}
            onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
            style={{ ...S.input, fontSize: 13, padding: '7px 10px', marginBottom: 8, cursor: 'pointer', color: '#fff', background: '#1a1a1a' }}
          >
            {WORK_CATEGORIES.map(c => <option key={c.key} value={c.key} style={{ background: '#1a1a1a', color: '#fff' }}>{c.label}</option>)}
          </select>

          {/* 웹디자인: URL 입력 */}
          {form.category === 'web' && (
            <input
              type="url"
              placeholder="사이트 링크 (선택)"
              value={form.link}
              onChange={(e) => setForm(p => ({ ...p, link: e.target.value }))}
              style={{ ...S.input, fontSize: 13, padding: '7px 10px', marginBottom: 10 }}
            />
          )}

          {/* 앱디자인: PDF 업로드 */}
          {form.category === 'app' && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: form.link ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
                  {form.link ? 'PDF 등록됨 ✓' : 'PDF 없음'}
                </span>
                {form.link && (
                  <a href={form.link} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 11, color: '#60a5fa' }}>미리보기</a>
                )}
              </div>
              <button
                type="button"
                onClick={() => pdfInputRef[0]?.click()}
                disabled={pdfUploading}
                style={{ ...S.btnPrimary, fontSize: 12, padding: '6px 14px', background: 'rgba(255,255,255,0.1)', color: '#fff', opacity: pdfUploading ? 0.5 : 1 }}
              >
                {pdfUploading ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={12} />}
                {pdfUploading ? 'PDF 업로드 중...' : 'PDF 업로드'}
              </button>
              <input type="file" accept="application/pdf" style={{ display: 'none' }}
                ref={(el) => { pdfInputRef[0] = el }} onChange={handlePdfChange} />
            </div>
          )}

          {/* 상세페이지: 원본 이미지 업로드 */}
          {form.category === 'detail' && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: form.link ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
                  {form.link ? '원본 이미지 등록됨 ✓' : '원본 없음 (썸네일로 표시)'}
                </span>
                {form.link && (
                  <a href={form.link} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 11, color: '#60a5fa' }}>미리보기</a>
                )}
              </div>
              <button
                type="button"
                onClick={() => pdfInputRef[0]?.click()}
                disabled={pdfUploading}
                style={{ ...S.btnPrimary, fontSize: 12, padding: '6px 14px', background: 'rgba(255,255,255,0.1)', color: '#fff', opacity: pdfUploading ? 0.5 : 1 }}
              >
                {pdfUploading ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={12} />}
                {pdfUploading ? '업로드 중...' : '원본 이미지 업로드'}
              </button>
              <input type="file" accept="image/*" style={{ display: 'none' }}
                ref={(el) => { pdfInputRef[0] = el }} onChange={handlePdfChange} />
            </div>
          )}

          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={handleSave} disabled={saving}
              style={{ ...S.btnPrimary, fontSize: 12, padding: '6px 12px', flex: 1, justifyContent: 'center', opacity: saving ? 0.5 : 1 }}>
              {saving ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={12} />}
              저장
            </button>
            <button onClick={handleCancel} style={{ ...S.btnDanger, padding: '6px 10px' }}>
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
            {work.link
              ? <a href={work.link} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#60a5fa', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 80 }}>링크 열기</a>
              : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>링크 없음</span>
            }
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button onClick={() => setEditing(true)}
                style={{ ...S.btnDanger, padding: '5px 8px', color: '#93c5fd', background: 'rgba(59,130,246,0.12)', borderColor: 'rgba(59,130,246,0.3)' }}>
                <Pencil size={12} />
              </button>
              <button onClick={() => onDelete(work)} style={{ ...S.btnDanger, padding: '5px 8px' }}>
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function WorksTab() {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState('web')
  const [link, setLink] = useState('')
  const [pdfFile, setPdfFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filterCat, setFilterCat] = useState('all')

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
      // 이미지 업로드
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`
      const { error: storageError } = await supabase.storage
        .from('works-images')
        .upload(fileName, file)
      if (storageError) throw storageError

      const { data: { publicUrl } } = supabase.storage
        .from('works-images')
        .getPublicUrl(fileName)

      // 앱디자인: PDF / 상세페이지: 원본 이미지 업로드 → link 필드에 저장
      let finalLink = link || null
      if ((category === 'app' || category === 'detail') && pdfFile) {
        const ext = pdfFile.name.split('.').pop()
        const extraName = `extra_${Date.now()}.${ext}`
        const contentType = category === 'app' ? 'application/pdf' : pdfFile.type
        const { error: extraError } = await supabase.storage
          .from('works-images')
          .upload(extraName, pdfFile, { contentType })
        if (extraError) throw extraError
        const { data: { publicUrl: extraUrl } } = supabase.storage.from('works-images').getPublicUrl(extraName)
        finalLink = extraUrl
      }

      const { error: dbError } = await supabase
        .from('works')
        .insert({ image_url: publicUrl, category, link: finalLink })
      if (dbError) throw dbError

      setSuccess('등록 완료!')
      setFile(null)
      setCategory('web')
      setLink('')
      setPdfFile(null)
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

  function handleSaved(id, updates) {
    setWorks((prev) => prev.map((w) => w.id === id ? { ...w, ...updates } : w))
  }

  const filtered = filterCat === 'all' ? works : works.filter(w => w.category === filterCat)

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
          <Field label="카테고리 *">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setLink(''); setPdfFile(null) }}
              style={{ ...S.input, cursor: 'pointer', color: '#fff', background: '#1a1a1a' }}
            >
              {WORK_CATEGORIES.map(c => <option key={c.key} value={c.key} style={{ background: '#1a1a1a', color: '#fff' }}>{c.label}</option>)}
            </select>
          </Field>
          {/* 웹디자인: URL 입력 */}
          {category === 'web' && (
            <Field label="사이트 링크 (선택)">
              <input
                type="url"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                style={S.input}
              />
            </Field>
          )}
          {/* 앱디자인: PDF 파일 */}
          {category === 'app' && (
            <Field label="PDF 파일 (선택)">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }}
              />
            </Field>
          )}
          {/* 상세페이지: 원본 이미지 업로드 */}
          {category === 'detail' && (
            <Field label="원본 이미지 (선택 — 클릭 시 라이트박스에 표시)">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPdfFile(e.target.files[0])}
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }}
              />
            </Field>
          )}
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

      {/* 카테고리 필터 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ ...S.sectionTitle, marginBottom: 0 }}>등록된 작업물 ({works.length}개)</h2>
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ key: 'all', label: '전체' }, ...WORK_CATEGORIES].map(c => (
            <button
              key={c.key}
              onClick={() => setFilterCat(c.key)}
              style={{
                padding: '5px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 600,
                background: filterCat === c.key ? '#fff' : 'rgba(255,255,255,0.08)',
                color: filterCat === c.key ? '#000' : 'rgba(255,255,255,0.45)',
              }}
            >{c.label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>불러오는 중...</p>
      ) : filtered.length === 0 ? (
        <div style={{ ...S.card, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14, padding: '48px 24px' }}>
          {works.length === 0 ? '등록된 작업물이 없습니다' : '해당 카테고리 작업물이 없습니다'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {filtered.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              onDelete={handleDelete}
              onSaved={handleSaved}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Tab 2 – 강사 정보 ─────────────────────────────────────────────────────────
function InstructorCard({ instructor, index, onDelete, onSaved }) {
  const [form, setForm] = useState({
    name: instructor.name || '',
    title: instructor.title || '',
    photo: instructor.photo || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function update(field, val) {
    setForm((prev) => ({ ...prev, [field]: val }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      if (instructor.id) {
        const { error } = await supabase
          .from('instructors')
          .update({ name: form.name, title: form.title, photo: form.photo })
          .eq('id', instructor.id)
        if (error) throw error
        onSaved(instructor.id, form)
      } else {
        const nextSlot = Date.now() // 고유 slot 값으로 타임스탬프 사용
        const { data, error } = await supabase
          .from('instructors')
          .insert({ slot: nextSlot, name: form.name, title: form.title, photo: form.photo })
          .select()
          .single()
        if (error) throw error
        onSaved(null, form, data)
      }
      setSuccess('저장 완료!')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`"${form.name || '강사'}"를 삭제하시겠습니까?`)) return
    try {
      if (instructor.id) {
        const { error } = await supabase.from('instructors').delete().eq('id', instructor.id)
        if (error) throw error
      }
      onDelete(instructor.id || null, index)
    } catch (err) {
      alert('삭제 실패: ' + err.message)
    }
  }

  return (
    <div style={{ ...S.card, flex: '1 1 260px', minWidth: 260 }}>
      {/* 카드 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
          강사 {index + 1}
        </h3>
        <button onClick={handleDelete} style={{ ...S.btnDanger, padding: '5px 9px' }}>
          <Trash2 size={13} />
        </button>
      </div>

      <Field label="이름">
        <input style={S.input} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="홍길동" />
      </Field>
      <Field label="직함">
        <input style={S.input} value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="웹 UIUX 전임강사" />
      </Field>
      <Field label="사진 URL">
        <input style={S.input} value={form.photo} onChange={(e) => update('photo', e.target.value)} placeholder="https://..." />
      </Field>
      {form.photo && (
        <img
          src={form.photo}
          alt="미리보기"
          style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      )}
      <Msg error={error} success={success} />
      <button
        onClick={handleSave}
        disabled={saving}
        style={{ ...S.btnPrimary, marginTop: 8, width: '100%', justifyContent: 'center', opacity: saving ? 0.5 : 1 }}
      >
        {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
        {saving ? '저장 중...' : '저장'}
      </button>
    </div>
  )
}

function InstructorsTab() {
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('instructors')
          .select('*')
          .order('slot', { ascending: true })
        if (error) throw error
        if (data && data.length > 0) {
          setInstructors(data)
        } else {
          // DB가 비어있으면 기본값으로 초기화
          setInstructors([
            { ...defaultInstructors[1], id: null, slot: 1 },
            { ...defaultInstructors[2], id: null, slot: 2 },
          ])
        }
      } catch {
        setInstructors([
          { ...defaultInstructors[1], id: null, slot: 1 },
          { ...defaultInstructors[2], id: null, slot: 2 },
        ])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function handleAdd() {
    setInstructors((prev) => [...prev, { id: null, slot: null, name: '', title: '', photo: '' }])
  }

  function handleDelete(id, index) {
    if (id) {
      setInstructors((prev) => prev.filter((inst) => inst.id !== id))
    } else {
      setInstructors((prev) => prev.filter((_, i) => i !== index))
    }
  }

  function handleSaved(oldId, form, newData) {
    if (oldId) {
      // 기존 강사 수정
      setInstructors((prev) =>
        prev.map((inst) => inst.id === oldId ? { ...inst, ...form } : inst)
      )
    } else if (newData) {
      // 새로 추가된 강사 — id 반영
      setInstructors((prev) => {
        const idx = prev.findIndex((inst) => inst.id === null && inst.name === '' && inst.title === '' && inst.photo === '')
        if (idx === -1) return prev
        const next = [...prev]
        next[idx] = newData
        return next
      })
    }
  }

  if (loading) {
    return <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>불러오는 중...</p>
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ ...S.sectionTitle, marginBottom: 0 }}>강사 정보</h2>
        <button onClick={handleAdd} style={{ ...S.btnPrimary, background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
          <Plus size={15} /> 강사 추가
        </button>
      </div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {instructors.map((inst, i) => (
          <InstructorCard
            key={inst.id ?? `new-${i}`}
            instructor={inst}
            index={i}
            onDelete={handleDelete}
            onSaved={handleSaved}
          />
        ))}
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
          // DB에 없는 step은 로컬 기본값으로 보완
          const dbSteps = data.map((d) => d.step)
          const missing = defaultCurriculum
            .filter((c) => !dbSteps.includes(c.step))
            .map((c) => ({ step: c.step, title: c.title, tag: c.tag, color: c.color }))
          setRows([...data, ...missing].sort((a, b) => a.step - b.step))
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
    setRows((prev) => [...prev, { title: '', tag: '', color: '#3B82F6' }])
  }

  async function deleteRow(index) {
    const row = rows[index]
    if (!confirm(`"${row.title || '새 항목'}" 을 삭제하시겠습니까?`)) return
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
      // step은 배열 순서(1-based)로 자동 결정
      const numbered = rows.map((r, i) => ({ ...r, step: i + 1 }))

      const toUpdate = numbered.filter((r) => r.id)
      const toInsert = numbered.filter((r) => !r.id)

      for (const r of toUpdate) {
        const { error } = await supabase
          .from('curriculum')
          .update({ step: r.step, title: r.title, tag: r.tag, color: r.color })
          .eq('id', r.id)
        if (error) throw error
      }

      if (toInsert.length > 0) {
        const { error } = await supabase
          .from('curriculum')
          .insert(toInsert.map((r) => ({ step: r.step, title: r.title, tag: r.tag, color: r.color })))
        if (error) throw error
      }

      // 저장 후 DB에서 다시 불러와 id 동기화
      const { data, error: fetchError } = await supabase
        .from('curriculum')
        .select('*')
        .order('step', { ascending: true })
      if (fetchError) throw fetchError
      setRows(data || [])
      setSuccess('저장 완료!')
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
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ ...S.sectionTitle, marginBottom: 0 }}>커리큘럼</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={addRow} style={{ ...S.btnPrimary, background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
            <Plus size={15} /> 항목 추가
          </button>
          <button onClick={handleSaveAll} disabled={saving} style={{ ...S.btnPrimary, opacity: saving ? 0.5 : 1 }}>
            {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
            {saving ? '저장 중...' : '전체 저장'}
          </button>
        </div>
      </div>
      <Msg error={error} success={success} />

      {/* 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
        {rows.map((row, i) => (
          <div key={i} style={{ ...S.card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>

            {/* 순서 번호 */}
            <div style={{
              flexShrink: 0,
              width: 36, height: 36,
              borderRadius: 8,
              background: (row.color || '#3B82F6') + '22',
              border: `1px solid ${row.color || '#3B82F6'}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Inter', sans-serif",
              fontSize: 13, fontWeight: 800,
              color: row.color || '#3B82F6',
            }}>
              {String(i + 1).padStart(2, '0')}
            </div>

            {/* 제목 */}
            <input
              style={{ ...S.input, margin: 0, flex: 1, fontSize: 15, fontWeight: 600 }}
              value={row.title}
              onChange={(e) => updateRow(i, 'title', e.target.value)}
              placeholder="과목명을 입력하세요"
            />

            {/* 태그 */}
            <input
              style={{ ...S.input, margin: 0, width: 110, flexShrink: 0, fontSize: 13 }}
              value={row.tag}
              onChange={(e) => updateRow(i, 'tag', e.target.value)}
              placeholder="태그 (예: 주4일)"
            />

            {/* 색상 */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="color"
                value={row.color || '#3B82F6'}
                onChange={(e) => updateRow(i, 'color', e.target.value)}
                style={{ width: 36, height: 36, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, cursor: 'pointer', background: 'transparent', padding: 2 }}
              />
            </div>

            {/* 삭제 */}
            <button onClick={() => deleteRow(i)} style={{ ...S.btnDanger, padding: '7px 10px', flexShrink: 0 }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tab 4 – 학과소개 ──────────────────────────────────────────────────────────
// site_content 테이블 (key text PK, value jsonb) 하나만 사용
async function loadContent(key) {
  const { data, error } = await supabase.from('site_content').select('value').eq('key', key).single()
  if (error && error.code !== 'PGRST116') throw error
  return data?.value ?? null
}
async function saveContent(key, value) {
  const { error } = await supabase.from('site_content').upsert({ key, value }, { onConflict: 'key' })
  if (error) throw error
}

function AboutTab() {
  const [rows, setRows] = useState([])
  const [compMeta, setCompMeta] = useState({ tag: aboutCourse.comparison.tag, title: aboutCourse.comparison.title, subtitle: aboutCourse.comparison.subtitle, webColor: '#2D3FE7', printColor: '#6b7280' })
  const [compRows, setCompRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [rowsSaving, setRowsSaving] = useState(false)
  const [compSaving, setCompSaving] = useState(false)
  const [rowsMsg, setRowsMsg] = useState({ error: '', success: '' })
  const [compMsg, setCompMsg] = useState({ error: '', success: '' })

  useEffect(() => {
    async function load() {
      try {
        const [sec, comp] = await Promise.all([
          loadContent('about_sections'),
          loadContent('about_comparison'),
        ])
        setRows(sec ?? aboutCourse.cards.map((c, idx) => ({ tag: c.tag, title: c.title, body: c.body, color: idx === 1 ? '#2D3FE7' : '#141414' })))
        if (comp) {
          setCompMeta(comp.meta)
          setCompRows(comp.rows)
        } else {
          setCompRows(aboutCourse.comparison.rows.map((r) => ({ aspect: r.aspect, web: r.web, print: r.print })))
        }
      } catch (err) {
        // 테이블이 없으면 기본값 사용
        setRows(aboutCourse.cards.map((c, idx) => ({ tag: c.tag, title: c.title, body: c.body, color: idx === 1 ? '#2D3FE7' : '#141414' })))
        setCompRows(aboutCourse.comparison.rows.map((r) => ({ aspect: r.aspect, web: r.web, print: r.print })))
        console.error('site_content 로드 실패:', err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function updateRow(i, field, value) {
    setRows((prev) => { const next = [...prev]; next[i] = { ...next[i], [field]: value }; return next })
  }
  function updateCompRow(i, field, value) {
    setCompRows((prev) => { const next = [...prev]; next[i] = { ...next[i], [field]: value }; return next })
  }

  async function saveRows() {
    setRowsSaving(true); setRowsMsg({ error: '', success: '' })
    try {
      await saveContent('about_sections', rows)
      setRowsMsg({ error: '', success: '저장 완료!' })
    } catch (err) { setRowsMsg({ error: err.message, success: '' }) }
    finally { setRowsSaving(false) }
  }
  async function saveComparison() {
    setCompSaving(true); setCompMsg({ error: '', success: '' })
    try {
      await saveContent('about_comparison', { meta: compMeta, rows: compRows })
      setCompMsg({ error: '', success: '저장 완료!' })
    } catch (err) { setCompMsg({ error: err.message, success: '' }) }
    finally { setCompSaving(false) }
  }

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>불러오는 중...</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* ── 섹션 카드 (1·2번) ────────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ ...S.sectionTitle, marginBottom: 2 }}>학과소개</h2>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>섹션 카드 (1·2번)</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setRows((p) => [...p, { tag: '', title: '', body: '', color: '#141414' }])} style={{ ...S.btnPrimary, background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
              <Plus size={15} /> 항목 추가
            </button>
            <button onClick={saveRows} disabled={rowsSaving} style={{ ...S.btnPrimary, opacity: rowsSaving ? 0.5 : 1 }}>
              {rowsSaving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
              {rowsSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
        <Msg error={rowsMsg.error} success={rowsMsg.success} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rows.map((row, i) => (
            <div key={i} style={{ ...S.card, padding: '20px 24px', borderLeft: `4px solid ${row.color || '#141414'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>섹션 {i + 1}</span>
                <button onClick={() => setRows((p) => p.filter((_, j) => j !== i))} style={{ ...S.btnDanger, padding: '5px 9px' }}><Trash2 size={13} /></button>
              </div>
              <Field label="태그"><input style={S.input} value={row.tag} onChange={(e) => updateRow(i, 'tag', e.target.value)} placeholder="01 — Web Design" /></Field>
              <Field label="제목"><input style={{ ...S.input, fontWeight: 600 }} value={row.title} onChange={(e) => updateRow(i, 'title', e.target.value)} placeholder="섹션 제목" /></Field>
              <Field label="본문"><textarea style={{ ...S.input, resize: 'vertical', minHeight: 100, lineHeight: 1.7 }} value={row.body} onChange={(e) => updateRow(i, 'body', e.target.value)} placeholder="본문 내용" /></Field>
              <Field label="카드 배경색">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="color"
                    value={row.color || '#141414'}
                    onChange={(e) => updateRow(i, 'color', e.target.value)}
                    style={{ width: 44, height: 36, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, cursor: 'pointer', background: 'transparent', padding: 2 }}
                  />
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['#141414', '#2D3FE7', '#1a1a2e', '#0d2137', '#1c1c1c', '#1a1a00'].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => updateRow(i, 'color', preset)}
                        title={preset}
                        style={{ width: 24, height: 24, borderRadius: 6, background: preset, border: row.color === preset ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', padding: 0 }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{row.color || '#141414'}</span>
                </div>
              </Field>
            </div>
          ))}
        </div>
      </div>

      {/* ── 비교 표 (섹션 3) ─────────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ ...S.sectionTitle, marginBottom: 2 }}>비교 표</h2>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>섹션 3 — 웹디자인 vs 편집디자인</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={async () => {
                if (!window.confirm('content.js 기본값으로 초기화하고 저장할까요?')) return
                const defaultRows = aboutCourse.comparison.rows.map((r) => ({ aspect: r.aspect, web: r.web, print: r.print }))
                setCompRows(defaultRows)
                setCompSaving(true); setCompMsg({ error: '', success: '' })
                try {
                  await saveContent('about_comparison', { meta: compMeta, rows: defaultRows })
                  setCompMsg({ error: '', success: '기본값으로 초기화 완료!' })
                } catch (err) { setCompMsg({ error: err.message, success: '' }) }
                finally { setCompSaving(false) }
              }}
              style={{ ...S.btnPrimary, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}
            >
              기본값 초기화
            </button>
            <button onClick={() => setCompRows((p) => [...p, { aspect: '', web: '', print: '' }])} style={{ ...S.btnPrimary, background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
              <Plus size={15} /> 행 추가
            </button>
            <button onClick={saveComparison} disabled={compSaving} style={{ ...S.btnPrimary, opacity: compSaving ? 0.5 : 1 }}>
              {compSaving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
              {compSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
        <Msg error={compMsg.error} success={compMsg.success} />

        <div style={{ ...S.card, padding: '20px 24px', marginBottom: 12 }}>
          <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>표 헤더 정보</p>
          <Field label="태그"><input style={S.input} value={compMeta.tag} onChange={(e) => setCompMeta((p) => ({ ...p, tag: e.target.value }))} placeholder="03 — Web vs. Print" /></Field>
          <Field label="제목"><input style={{ ...S.input, fontWeight: 600 }} value={compMeta.title} onChange={(e) => setCompMeta((p) => ({ ...p, title: e.target.value }))} placeholder="웹디자인 vs 편집디자인" /></Field>
          <Field label="부제"><input style={S.input} value={compMeta.subtitle} onChange={(e) => setCompMeta((p) => ({ ...p, subtitle: e.target.value }))} placeholder="같은 디자인이지만, 전혀 다른 세계" /></Field>
          <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
            <Field label="웹디자인 컬럼 색상">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="color" value={compMeta.webColor || '#2D3FE7'} onChange={(e) => setCompMeta((p) => ({ ...p, webColor: e.target.value }))}
                  style={{ width: 44, height: 36, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, cursor: 'pointer', background: 'transparent', padding: 2 }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{compMeta.webColor || '#2D3FE7'}</span>
              </div>
            </Field>
            <Field label="편집디자인 컬럼 색상">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="color" value={compMeta.printColor || '#6b7280'} onChange={(e) => setCompMeta((p) => ({ ...p, printColor: e.target.value }))}
                  style={{ width: 44, height: 36, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, cursor: 'pointer', background: 'transparent', padding: 2 }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{compMeta.printColor || '#6b7280'}</span>
              </div>
            </Field>
          </div>
        </div>

        <div style={{ ...S.card, padding: '16px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 36px', gap: 10, padding: '6px 0 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 10 }}>
            {['구분', '웹디자인', '편집디자인', ''].map((h) => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {compRows.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 36px', gap: 10, alignItems: 'center' }}>
                <input style={{ ...S.input, margin: 0, fontSize: 13 }} value={row.aspect} onChange={(e) => updateCompRow(i, 'aspect', e.target.value)} placeholder="구분" />
                <input style={{ ...S.input, margin: 0, fontSize: 13 }} value={row.web} onChange={(e) => updateCompRow(i, 'web', e.target.value)} placeholder="웹디자인" />
                <input style={{ ...S.input, margin: 0, fontSize: 13 }} value={row.print} onChange={(e) => updateCompRow(i, 'print', e.target.value)} placeholder="편집디자인" />
                <button onClick={() => setCompRows((p) => p.filter((_, j) => j !== i))} style={{ ...S.btnDanger, padding: '6px 8px' }}><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

// ─── Main Admin component ──────────────────────────────────────────────────────
const TABS = [
  { id: 'works', label: '작업물' },
  { id: 'instructors', label: '강사 정보' },
  { id: 'curriculum', label: '커리큘럼' },
  { id: 'about', label: '학과소개' },
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
  const [stats, setStats] = useState({ today: null, week: null, total: null })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    async function fetchStats() {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).toISOString()

      const [todayRes, weekRes, totalRes] = await Promise.all([
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('visited_at', todayStart),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('visited_at', weekStart),
        supabase.from('page_views').select('*', { count: 'exact', head: true }),
      ])
      setStats({
        today: todayRes.count ?? 0,
        week: weekRes.count ?? 0,
        total: totalRes.count ?? 0,
      })
    }
    fetchStats()
  }, [session])

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

        {/* 방문자 통계 */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          {[
            { label: '오늘 방문자', value: stats.today, color: '#60a5fa' },
            { label: '최근 7일', value: stats.week, color: '#a78bfa' },
            { label: '전체 누계', value: stats.total, color: '#4ade80' },
          ].map((s) => (
            <div key={s.label} style={{
              ...S.card,
              flex: '1 1 120px',
              minWidth: 120,
              padding: '16px 20px',
              borderTop: `3px solid ${s.color}`,
            }}>
              <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: s.value === null ? 'rgba(255,255,255,0.2)' : s.color, fontFamily: "'Inter', sans-serif" }}>
                {s.value === null ? '—' : s.value.toLocaleString()}
              </p>
            </div>
          ))}
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
        {activeTab === 'about' && <AboutTab />}
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

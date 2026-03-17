import { useState, useEffect } from 'react'
import { supabase, isSupabaseReady } from '../lib/supabase'
import { LogOut, Upload, Trash2, Loader2, X } from 'lucide-react'

export default function Admin() {
  if (!isSupabaseReady) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 text-center">
        <div>
          <p className="text-white text-xl font-bold mb-3">Supabase 설정 필요</p>
          <p className="text-white/40 text-sm">.env 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 입력하세요.</p>
        </div>
      </div>
    )
  }
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [works, setWorks] = useState([])
  const [worksLoading, setWorksLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [link, setLink] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchWorks()
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchWorks()
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchWorks() {
    setWorksLoading(true)
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
      setWorksLoading(false)
    }
  }

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
    setWorks([])
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    setUploadError('')
    setSuccessMsg('')
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

      setSuccessMsg('등록 완료!')
      setFile(null)
      setLink('')
      e.target.reset()
      fetchWorks()
    } catch (err) {
      setUploadError(err.message)
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

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-white text-2xl font-black mb-8">관리자 로그인</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-white/30 transition-colors"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-white/30 transition-colors"
            />
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {authLoading ? <Loader2 size={16} className="animate-spin" /> : null}
              로그인
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-2xl font-black">관리자 페이지</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>

        {/* Upload form */}
        <div className="bg-white/5 rounded-2xl p-6 mb-10 border border-white/10">
          <h2 className="font-bold text-lg mb-6">작업물 추가</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="text-white/50 text-xs mb-2 block">이미지 파일 *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
                className="w-full text-white/70 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors cursor-pointer"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-2 block">포트폴리오 링크 (선택)</label>
              <input
                type="url"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-white/30 transition-colors"
              />
            </div>
            {uploadError && <p className="text-red-400 text-sm">{uploadError}</p>}
            {successMsg && <p className="text-green-400 text-sm">{successMsg}</p>}
            <button
              type="submit"
              disabled={uploading || !file}
              className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? '업로드 중...' : '등록'}
            </button>
          </form>
        </div>

        {/* Works list */}
        <div>
          <h2 className="font-bold text-lg mb-6">등록된 작업물 ({works.length}개)</h2>
          {worksLoading ? (
            <div className="text-white/40 text-sm">불러오는 중...</div>
          ) : works.length === 0 ? (
            <div className="text-white/30 text-sm py-8 text-center border border-white/10 rounded-2xl">
              등록된 작업물이 없습니다
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {works.map((work) => (
                <div key={work.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={work.image_url}
                    alt="작업물"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3 flex items-center justify-between">
                    {work.link ? (
                      <a
                        href={work.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-xs truncate max-w-[140px] hover:underline"
                      >
                        링크 열기
                      </a>
                    ) : (
                      <span className="text-white/30 text-xs">링크 없음</span>
                    )}
                    <button
                      onClick={() => handleDelete(work)}
                      className="text-red-400 hover:text-red-300 transition-colors ml-2 flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

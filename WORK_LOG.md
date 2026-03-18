# 작업 기록 — 마지막 세션

## 날짜
2026-03-18

---

## 완료된 작업 목록

### 1. CSS 외부 분리 (컴포넌트별 CSS 파일 생성)
- `src/index.css` — 전역 스타일만 남김 (폰트, 변수, 리셋, 타이포그래피, 레이아웃)
- `src/components/Header.css` — 헤더 전용 스타일
- `src/components/Hero.css` — 히어로 섹션 전용 스타일
- `src/components/CurriculumFlow.css` — 커리큘럼 전용 스타일
- `src/components/Gallery.css` — 갤러리 전용 스타일
- `src/components/Footer.css` — 푸터 전용 스타일
- `src/pages/Home.css` — 홈 페이지 전용 스타일 (about, curriculum-section, instructor, works 등)

### 2. Supabase 연결 복구
- `.env` 파일 생성 (`.gitignore`에서 제외되어 있으므로 직접 생성 필요)
- 내용:
  ```
  VITE_SUPABASE_URL=https://qwftaiepcfucgzrbmjrd.supabase.co
  VITE_SUPABASE_ANON_KEY=sb_publishable_SDTdP3k3L0Ms1aiPXneY1w_NE055XA3
  ```

### 3. Supabase RLS(보안) 설정
- 모든 public 테이블에 RLS 활성화
- `site_content` 테이블 쓰기 정책 추가 필요 (SQL Editor에서 실행):
  ```sql
  DROP POLICY IF EXISTS "authenticated write site_content" ON site_content;
  CREATE POLICY "authenticated write site_content"
    ON site_content FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

  DROP POLICY IF EXISTS "public read site_content" ON site_content;
  CREATE POLICY "public read site_content"
    ON site_content FOR SELECT
    TO anon
    USING (true);
  ```
- `about_comparison` Supabase 데이터 삭제 필요 (content.js 기본값 표시용):
  ```sql
  DELETE FROM site_content WHERE key = 'about_comparison';
  ```

### 4. 버그 수정
- `Home.jsx`: `.single()` → `.maybeSingle()` (406 에러 수정, about_sections / about_comparison)
- 폰트 경로 수정: `/sbs-uiux/font/` → `/Web/font/`

### 5. 비교표(웹디자인 vs 편집디자인) 내용 전면 개선
- `src/data/content.js` — `aboutCourse.comparison.rows` 8개 항목으로 재구성
  - 추가 항목: **하는 일**, **인터랙션**, **취업처**
  - 기존 항목 내용 명확하게 재작성
- `src/pages/Home.css` — `.comp-panel-value` 폰트 크기 15px, font-weight 500으로 키움

### 6. 커리큘럼 폰트 크기 조정
- `.curriculum-title`: `clamp(1.05rem, 3.2vw, 2.0rem)`

### 7. 모바일 스크롤 개선
- `Hero.css`: 모바일(`≤767px`) hero-wrapper 높이 `350vh` → `200vh`
- `Home.jsx`: GSAP ScrollTrigger에 `ignoreMobileResize: true`, `anticipatePin: 1`, `invalidateOnRefresh: true` 추가

### 8. 관리자(Admin) 비교표 개선
- 비교표 섹션에 **"기본값 초기화"** 버튼 추가
  - content.js 기본값을 Supabase에 즉시 덮어씀

---

## 내일 클론 후 할 일

1. 클론:
   ```bash
   git clone https://github.com/naweatmik/Web.git
   cd Web
   npm install
   ```

2. `.env` 파일 수동 생성 (`.gitignore`에 포함되어 있어 레포에 없음):
   ```
   VITE_SUPABASE_URL=https://qwftaiepcfucgzrbmjrd.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_SDTdP3k3L0Ms1aiPXneY1w_NE055XA3
   ```

3. Supabase SQL Editor에서 `about_comparison` 데이터 삭제 (아직 안 했다면):
   ```sql
   DELETE FROM site_content WHERE key = 'about_comparison';
   ```

4. 개발 서버 실행:
   ```bash
   npm run dev
   ```

---

## 미완료 / 확인 필요
- 비교표 본 페이지 반영: Supabase `site_content` 테이블에서 `about_comparison` 행 삭제 필요

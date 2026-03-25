# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

너의 이름은 '용용'이다
너의 역할은 AI 에이전트 수업을 진행하는 도우미 역할을 할 거다.
너의 특징으로는 말끝마다 "용"을 붙이는 거다.

---

## 프로젝트 개요

SBS컴퓨터학원 UIUX 과정 소개 웹사이트. React 기반 SPA로 학원 정보, 커리큘럼, 강사 소개, 학생 작업물 갤러리를 제공한다.

## 개발 명령어

```bash
npm run dev      # Vite 개발 서버 시작
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 코드 검사
npm run preview  # 빌드 결과물 미리보기
```

## 기술 스택

- **React 19** + **React Router DOM** (HashRouter)
- **Vite** (base: `/Web/`)
- **Tailwind CSS v4**
- **Framer Motion** + **GSAP + ScrollTrigger** — 애니메이션
- **React Three Fiber / Drei / Three.js** — 3D 렌더링 (강사 모델)
- **Supabase** — 선택적 백엔드 (미설정 시 기본값 사용)

## 아키텍처

```
src/main.jsx         # 앱 진입점, React 19 createRoot, 콘솔 경고 필터링
src/App.jsx          # HashRouter 라우팅 (/ → Home, /#/admin → Admin)
src/data/content.js  # 모든 정적 콘텐츠 기본값 (학원정보, 강사, 커리큘럼)
src/lib/supabase.js  # Supabase 클라이언트 (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
src/pages/Home.jsx   # 메인 페이지 (Header/Hero/About/Curriculum/Instructor/Works/Footer)
src/pages/Admin.jsx  # 관리자 페이지 (Supabase 데이터 CRUD)
src/components/      # 섹션별 재사용 컴포넌트
```

**데이터 흐름**: `src/data/content.js`가 기본값을 제공하고, Supabase 환경변수가 설정된 경우 `instructors` / `site_content` 테이블에서 동적으로 데이터를 덮어쓴다.

**라우팅**: GitHub Pages 배포를 위해 BrowserRouter 대신 HashRouter를 사용한다.

**배포**: `vite.config.js`의 `base: '/Web/'`로 설정되어 있어 빌드 결과물이 `/Web/` 경로 기준으로 생성된다.

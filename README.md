# SBS컴퓨터학원 UIUX 과정 소개 사이트

SBS컴퓨터학원 UIUX 디자인 과정을 소개하는 반응형 웹사이트입니다.
학원 정보, 커리큘럼, 강사 소개, 수강생 작업물 갤러리를 제공합니다.

---

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| 프레임워크 | React 19 + Vite |
| 스타일링 | Tailwind CSS v4 |
| 애니메이션 | Framer Motion, GSAP |
| 3D | React Three Fiber / Three.js |
| 라우팅 | React Router DOM (HashRouter) |
| 백엔드 | Supabase |

---

## 시작하기

```bash
npm install      # 패키지 설치
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과물 미리보기
```

---

## 콘텐츠 수정

`src/data/content.js` 파일만 수정하면 사이트 내용을 바꿀 수 있습니다.

| 항목 | 변수 | 설명 |
|------|------|------|
| 학원명 / 과정명 | `siteInfo` | 사이트 기본 정보 |
| 강사 정보 | `instructor` | 이름, 직함, 소개, 경력 |
| 진행 주차 | `currentWeek` | 0 = 준비중, 1 이상 = 진행중 |
| 커리큘럼 | `curriculum` | 각 과목 설명 |
| 연락처 | `contact` | 전화번호, 카카오 링크 |

---

## 관리자 페이지

`[사이트URL]/#/admin` 으로 접속해 수강생 작업물을 관리할 수 있습니다.
이미지 등록 및 삭제 기능을 제공합니다.

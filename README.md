# SBS컴퓨터학원 UIUX 과정 사이트

SBS컴퓨터학원 UIUX 디자인 과정 소개 사이트입니다.

## 기술 스택

- **프레임워크**: React + Vite
- **스타일링**: Tailwind CSS v4
- **애니메이션**: Framer Motion
- **아이콘**: Lucide React
- **라우팅**: React Router DOM
- **백엔드**: Supabase (DB + Auth + Storage)

## 시작하기

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## Supabase 설정 가이드

### 1. 프로젝트 생성
[supabase.com](https://supabase.com)에서 무료 계정을 만들고 새 프로젝트를 생성합니다.

### 2. works 테이블 생성
Supabase 대시보드 → SQL Editor에서 아래 SQL을 실행합니다:

```sql
CREATE TABLE works (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  link text,
  created_at timestamptz DEFAULT now()
);
```

### 3. Storage 버킷 생성
Storage → New Bucket → 이름: `works-images` → Public 체크 → Create

### 4. Authentication 설정
Authentication → Email 로그인 활성화 확인 → Users 탭에서 강사 계정 수동 생성

### 5. RLS (보안 정책) 설정

**works 테이블 RLS:**
```sql
-- RLS 활성화
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- 누구나 조회 가능
CREATE POLICY "Anyone can view works"
  ON works FOR SELECT USING (true);

-- 로그인한 사용자만 추가 가능
CREATE POLICY "Authenticated users can insert works"
  ON works FOR INSERT TO authenticated WITH CHECK (true);

-- 로그인한 사용자만 삭제 가능
CREATE POLICY "Authenticated users can delete works"
  ON works FOR DELETE TO authenticated USING (true);
```

**Storage 정책:**
```sql
-- 누구나 이미지 조회 가능
CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT USING (bucket_id = 'works-images');

-- 로그인한 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'works-images');

-- 로그인한 사용자만 삭제 가능
CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'works-images');
```

### 6. .env 파일 설정
프로젝트 루트에 `.env` 파일을 만들고 아래 내용을 입력합니다:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> Supabase 대시보드 → Settings → API 에서 URL과 anon key를 복사하세요.

## GitHub Pages 배포 가이드

1. GitHub에서 새 레포지토리 생성 (이름: `sbs-uiux`)
2. 아래 명령어로 코드 푸시:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/[유저명]/sbs-uiux.git
   git push -u origin main
   ```
3. GitHub 레포 → Settings → Pages → Source: **GitHub Actions** 선택
4. Settings → Secrets and variables → Actions에서 Supabase 키 추가:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Push 하면 자동 배포됩니다. 배포 URL: `https://[유저명].github.io/sbs-uiux/`

> **주의**: `vite.config.js`의 `base: '/sbs-uiux/'` 를 실제 레포명으로 변경하세요.

## content.js 수정 가이드

`src/data/content.js` 파일만 수정하면 사이트 내용이 바뀝니다:

| 항목 | 변수 | 설명 |
|------|------|------|
| 학원명/과정명 | `siteInfo` | 사이트 기본 정보 |
| 강사 정보 | `instructor` | 이름, 직함, 소개, 사진 URL, 경력 |
| 진행 주차 | `currentWeek` | 0=준비중, 1이상=진행중 표시 |
| 커리큘럼 | `curriculum` | 각 과목 설명 수정 |
| 연락처 | `contact` | 전화번호, 카카오 링크 |

## 관리자 페이지 사용법

1. 브라우저에서 `[사이트URL]/#/admin` 접속
2. Supabase에서 생성한 강사 계정으로 로그인
3. 이미지 파일 선택 + 포트폴리오 링크(선택) 입력 후 등록
4. 등록된 작업물 목록에서 삭제 가능

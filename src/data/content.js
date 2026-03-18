// ==============================
// SBS컴퓨터학원 UIUX 과정 콘텐츠
// 이 파일을 수정하면 사이트 내용이 변경됩니다
// ==============================

// 학원 기본 정보
export const siteInfo = {
  name: 'SBS컴퓨터학원',
  course: 'UIUX 디자인 과정',
  year: '2025',
}

// 학과 소개 섹션
export const aboutCourse = {
  label: 'About',
  cards: [
    {
      tag: '01 — Web Design',
      title: '코딩보다 감각이 먼저다.',
      body: '웹디자이너는 개발자가 아닙니다. 복잡한 코드를 작성하는 것이 목표가 아니라, 보기 좋고 쓰기 편한 화면을 만드는 것이 핵심입니다. HTML·CSS의 기초 구조만 이해하면 실무에서 충분합니다.\n\n쇼핑몰 메인 배너, 기업 홈페이지, 브랜드 랜딩페이지 — 브라우저에서 보이는 모든 화면이 웹디자이너의 손에서 나옵니다. Figma로 화면을 설계하고, 카페24·고도몰 같은 플랫폼에서 직접 적용하는 방식으로 일합니다.\n\nIT 기업·광고 에이전시·쇼핑몰·프리랜서까지, 웹디자이너는 어디서든 필요합니다.',
      gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    },
    {
      tag: '02 — UI/UX Design',
      title: '클릭 뒤엔 모든 게 설계다.',
      body: '앱을 처음 켰을 때의 첫 화면, 주문 완료까지의 단계 수, 버튼 하나의 위치 — 이 모든 것을 UX 디자이너가 결정합니다. 눈에 보이지 않는 흐름을 설계하는 것이 UX, 그 위에 색상·폰트·아이콘을 입혀 완성된 화면을 만드는 것이 UI입니다.\n\nFigma로 실제처럼 동작하는 프로토타입을 만들어 검증하고, 개발자에게 디자인 파일을 전달하는 방식으로 일합니다. 코딩은 하지 않지만, 개발자와 긴밀하게 협업합니다.\n\n네이버·카카오·쿠팡·토스 — 대한민국 IT를 이끄는 기업들이 가장 필요로 하는 직군입니다.',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 60%, #ec4899 100%)',
    },
  ],
  comparison: {
    tag: '03 — Web vs. Print',
    title: '웹디자인 vs 편집디자인',
    subtitle: '어떤 작업을 하는지 비교해보세요',
    rows: [
      { aspect: '하는 일',    web: '웹사이트·쇼핑몰·앱 화면·상세페이지·배너·UI 디자인',           print: '책·잡지·브로슈어·포스터·명함·패키지 레이아웃 디자인' },
      { aspect: '결과물',     web: '웹사이트 URL · 앱 화면 — 링크 하나로 누구나 바로 접속',      print: '인쇄된 종이 실물 · PDF 파일 — 배포하려면 인쇄하거나 파일 전달' },
      { aspect: '사용 툴',    web: 'Figma (화면 설계) · Photoshop · HTML/CSS 기초',             print: 'InDesign (편집·조판) · Illustrator · Photoshop' },
      { aspect: '작업 환경',  web: '화면 크기가 폰·태블릿·PC 모두 달라 — 모든 기기에 맞게 설계',  print: 'A4·B5 등 종이 규격에 맞춰 고정된 크기로 설계' },
      { aspect: '색상',       web: 'RGB — 빛의 3원색, 화면에서만 의미 있음',                     print: 'CMYK — 잉크 4색, 실제 인쇄 결과물이 기준' },
      { aspect: '인터랙션',   web: '버튼 클릭·팝업·페이지 전환·마이크로 애니메이션을 디자이너가 설계', print: '인터랙션 없음 — 이미지와 텍스트 배치가 전부' },
      { aspect: '수정·배포',  web: '파일 올리면 즉시 전 세계에 반영 — 횟수 제한 없이 수정 가능', print: '수정하면 다시 인쇄해야 함 — 비용 발생, 배포된 것은 회수 불가' },
      { aspect: '취업처',     web: 'IT기업·이커머스·스타트업·웹 에이전시·앱 개발사',              print: '출판사·광고대행사·인쇄소·패키지 디자인 스튜디오' },
    ],
  },
}

// 강사 정보
export const instructor = {
  name: '김태완',
  title: '웹 UIUX 전임강사 · 학과장',
  photo: 'https://api.dicebear.com/9.x/notionists/svg?seed=James&backgroundColor=b6e3f4',
  bio: 'UI/UX 디자인과 웹 개발을 아우르는 실무 중심의 교육을 진행합니다. 현업 경험을 바탕으로 취업까지 연결되는 포트폴리오 완성을 목표로 합니다.',
  careers: [
    '現 SBS컴퓨터학원 웹 UIUX 전임강사',
    '前 웹 에이전시 UI/UX 디자이너',
    'Figma, HTML/CSS, JavaScript 실무 다수',
  ],
}

export const instructor2 = {
  name: '여아람',
  title: '웹 UIUX 강사',
  photo: 'https://api.dicebear.com/9.x/notionists/svg?seed=Sophie&backgroundColor=ffd5dc',
}

// 현재 진행 주차 (0 = 준비중, 1 이상 = 진행중)
export const currentWeek = 0

// 커리큘럼 (총 10단계)
export const curriculum = [
  {
    step: 1,
    tag: '선수과목',
    title: '포토샵 / 일러스트 등',
    titleEn: 'Photoshop & Illustrator',
    color: '#EF4444',
    category: 'prerequisite',
    description: '포토샵과 일러스트레이터 등 기초 그래픽 툴을 학습합니다. 이미지 편집, 벡터 그래픽, 색상 이론을 익힙니다.',
    descEn: 'Master Photoshop & Illustrator. Build a foundation in image editing, vector graphics, and color theory.',
  },
  {
    step: 2,
    tag: '주4일',
    title: '피그마',
    titleEn: 'Figma',
    color: '#3B82F6',
    category: 'design',
    description: '현업에서 가장 많이 사용되는 UI 디자인 툴 Figma를 심층 학습합니다. 컴포넌트, 오토레이아웃, 디자인 시스템 구축까지 배웁니다.',
    descEn: 'Deep-dive into Figma — components, auto layout, and design systems used in real workplaces.',
  },
  {
    step: 3,
    tag: '격일',
    title: 'UX 설계',
    titleEn: 'UX Design',
    color: '#3B82F6',
    category: 'design',
    description: '사용자 경험 설계의 원칙과 방법론을 학습합니다. 사용자 리서치, 정보 구조 설계, 와이어프레임 제작 방법을 익힙니다.',
    descEn: 'Learn UX principles, user research, information architecture, and wireframe creation.',
  },
  {
    step: 4,
    tag: '격일',
    title: 'UI 도출 & 프로토타입',
    titleEn: 'UI & Prototype',
    color: '#3B82F6',
    category: 'design',
    description: 'UX 설계를 기반으로 실제 UI를 디자인하고 Figma로 인터랙티브 프로토타입을 제작합니다.',
    descEn: 'Design real UI from UX plans and build interactive Figma prototypes for usability testing.',
  },
  {
    step: 5,
    tag: '주4일',
    title: 'WEB1 HTML & CSS 기초',
    titleEn: 'HTML & CSS Basics',
    color: '#8B5CF6',
    category: 'web',
    description: 'HTML5 시맨틱 마크업과 CSS3 기초를 학습합니다. 박스 모델과 Flexbox 레이아웃을 익힙니다.',
    descEn: 'Semantic HTML5 markup and CSS3 essentials — box model and Flexbox layout.',
  },
  {
    step: 6,
    tag: '주4일',
    title: 'WEB2 HTML & CSS 중급 반응형',
    titleEn: 'Responsive Web Design',
    color: '#8B5CF6',
    category: 'web',
    description: 'CSS Grid와 미디어쿼리를 활용한 반응형 웹 디자인을 학습합니다.',
    descEn: 'Responsive web design with CSS Grid and media queries across all devices.',
  },
  {
    step: 7,
    tag: '주4일',
    title: 'WEB3 제이쿼리 & 자바스크립트 기초',
    titleEn: 'jQuery & JavaScript',
    color: '#8B5CF6',
    category: 'web',
    description: '자바스크립트 기초 문법과 jQuery를 활용한 DOM 조작, 이벤트 처리, 애니메이션 구현을 학습합니다.',
    descEn: 'JavaScript fundamentals and jQuery — DOM manipulation, events, and animations.',
  },
  {
    step: 8,
    tag: '주4일',
    title: '웹 디자인 실무 (카페24, 상세페이지)',
    titleEn: 'Web Design Practice',
    color: '#22C55E',
    category: 'portfolio',
    description: '실제 쇼핑몰 플랫폼 커스터마이징과 상품 상세페이지 제작 실무를 배웁니다.',
    descEn: 'Real-world web design — Cafe24 customization and product detail page production.',
  },
  {
    step: 9,
    tag: '격일',
    title: '웹 포트폴리오 - 1',
    titleEn: 'Portfolio 01',
    color: '#22C55E',
    category: 'portfolio',
    description: '개인 포트폴리오 사이트를 기획하고 디자인합니다. 나만의 브랜드 아이덴티티를 담은 포트폴리오를 제작합니다.',
    descEn: 'Plan and design your personal portfolio site with a unique brand identity.',
  },
  {
    step: 10,
    tag: '격일',
    title: '웹 포트폴리오 - 2',
    titleEn: 'Portfolio 02',
    color: '#22C55E',
    category: 'portfolio',
    description: '포트폴리오 사이트를 실제로 코딩하여 웹에 배포합니다. 이력서 작성 방법도 함께 다룹니다.',
    descEn: 'Code and deploy your portfolio to the web. Resume writing tips included.',
  },
  {
    step: 11,
    tag: '격일',
    title: '바이브 코딩',
    titleEn: 'Vibe Coding',
    color: '#F59E0B',
    category: 'extra',
    description: 'AI 도구를 활용한 바이브 코딩 방식으로 창의적인 웹 프로젝트를 제작합니다.',
    descEn: 'Create creative web projects using AI-assisted vibe coding methods.',
  },
  {
    step: 12,
    tag: '국비',
    title: '국비 수업',
    titleEn: 'Government-funded Course',
    color: '#F59E0B',
    category: 'extra',
    description: '국비지원 과정으로 진행되는 심화 수업입니다.',
    descEn: 'Advanced course offered through government-funded training.',
  },
]

// 연락처 정보
export const contact = {
  phone: '000-0000-0000',
  kakao: '#', // 카카오톡 채널 링크
}

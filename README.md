# MotionDeck

유튜브 크리에이터를 위한 애니메이션 프레젠테이션 에디터

## 소개

MotionDeck은 유튜브 콘텐츠 제작자들이 영상에 사용할 프레젠테이션 슬라이드를 쉽게 만들 수 있도록 설계된 웹 기반 에디터입니다. Framer Motion을 활용한 부드러운 애니메이션과 직관적인 드래그 앤 드롭 인터페이스를 제공합니다.

## 주요 기능

### 프로젝트 관리
- 여러 프로젝트 생성 및 관리
- IndexedDB를 활용한 대용량 로컬 저장 (이미지 포함 수백 MB 지원)
- JSON 형식으로 프로젝트 내보내기/가져오기
- 저장 용량 사용량 실시간 표시

### 슬라이드 편집
- **텍스트**: 제목, 본문 등 다양한 텍스트 요소 추가
- **이미지**: 드래그 앤 드롭 또는 파일 선택으로 이미지 삽입
- **아이콘**: 다양한 아이콘 라이브러리 지원
- **코드 블록**: 프로그래밍 코드 표시용 요소
- **도형**: 사각형, 원 등 기본 도형 추가

### 요소 조작
- **드래그 & 드롭**: 모든 요소를 마우스로 자유롭게 이동
- **리사이즈**: 모서리 핸들을 드래그하여 크기 조절
- **레이어 순서**: 요소를 앞으로/뒤로 이동 (맨 앞, 앞으로, 뒤로, 맨 뒤)
- **복사 & 삭제**: 요소 복제 및 삭제

### 슬라이드 관리
- 슬라이드 추가/복제/삭제
- 드래그로 슬라이드 순서 변경
- 슬라이드별 배경색 및 그라디언트 설정

### 스타일링
- **폰트 옵션**: 폰트 종류 선택 (Arial, Georgia, Courier New 등)
- **텍스트 스타일**: 굵게, 기울임, 밑줄
- **정렬**: 왼쪽, 가운데, 오른쪽 정렬
- **색상**: 텍스트 색상, 배경색 설정
- **그라디언트 배경**: 12가지 프리셋 그라디언트

### 실행 취소/다시 실행
- `Ctrl + Z`: 실행 취소 (Undo)
- `Ctrl + Shift + Z`: 다시 실행 (Redo)
- 작업 히스토리 관리

### 프레젠테이션 모드
- **일반 모드**: 전체 화면으로 슬라이드 발표
- **듀얼 모니터 모드**:
  - 청중용 창: 슬라이드만 표시 (녹화/송출용)
  - 발표자 창: 슬라이드 + 발표자 노트 표시
  - 두 창이 실시간 동기화 (BroadcastChannel API)
- 키보드 화살표 또는 버튼으로 슬라이드 이동
- ESC로 프레젠테이션 종료

### 성능 최적화
- 100KB 이상 이미지 자동 압축 (Canvas API)
- IndexedDB로 localStorage 한계 극복
- 효율적인 상태 관리

## 기술 스택

| 기술 | 용도 |
|------|------|
| [Next.js 14](https://nextjs.org) | React 프레임워크 (App Router) |
| [TypeScript](https://www.typescriptlang.org) | 타입 안전성 |
| [Tailwind CSS](https://tailwindcss.com) | 스타일링 |
| [Framer Motion](https://www.framer.com/motion) | 애니메이션 |
| [Lucide React](https://lucide.dev) | 아이콘 |
| IndexedDB | 대용량 로컬 저장소 |
| BroadcastChannel API | 창 간 통신 |

## 설치 및 실행

### 요구 사항
- Node.js 18.0 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/jeromwolf/-MotionDeck-.git
cd -MotionDeck-

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 프로덕션 빌드

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 린트 검사

```bash
npm run lint
```

## 사용 방법

### 1. 프로젝트 생성
- 홈 화면에서 "새 프로젝트" 버튼 클릭
- 프로젝트 이름 입력 후 생성

### 2. 슬라이드 편집
- 좌측 툴바에서 요소 선택 (텍스트, 이미지, 아이콘, 코드, 도형)
- 캔버스에 클릭하여 요소 추가
- 요소 선택 후 드래그로 이동, 모서리로 크기 조절

### 3. 스타일 적용
- 요소 선택 시 우측에 속성 패널 표시
- 폰트, 색상, 정렬 등 설정

### 4. 프레젠테이션
- 상단 "발표" 버튼으로 프레젠테이션 시작
- "발표자 모드"로 듀얼 모니터 지원

### 5. 저장 및 내보내기
- 자동 저장 (IndexedDB)
- "내보내기"로 JSON 파일 다운로드
- "가져오기"로 JSON 파일 불러오기

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx        # 메인 에디터 컴포넌트
│   ├── db.ts           # IndexedDB 헬퍼 함수
│   ├── layout.tsx      # 루트 레이아웃
│   ├── globals.css     # 전역 스타일
│   └── fonts/          # 로컬 폰트 파일
├── public/             # 정적 파일
└── ...
```

## 브라우저 지원

- Chrome (권장)
- Firefox
- Safari
- Edge

※ IndexedDB와 BroadcastChannel API를 지원하는 최신 브라우저 필요

## 라이선스

MIT License

## 기여

버그 리포트, 기능 제안, Pull Request를 환영합니다!

1. 이 저장소를 Fork
2. 기능 브랜치 생성 (`git checkout -b feature/새기능`)
3. 변경사항 커밋 (`git commit -m 'Add 새기능'`)
4. 브랜치에 Push (`git push origin feature/새기능`)
5. Pull Request 생성

## 연락처

문의사항이 있으시면 이슈를 등록해주세요.

# 🪙 김치프리미엄 (Kimchi Premium) 체크 사이트

> 한국 거래소(업비트)와 해외 거래소(바이낸스) 간의 암호화폐 가격 차이를 실시간으로 확인할 수 있는 웹 애플리케이션

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-4.1.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)

🌐 **배포 사이트**: [https://coin-site-tau.vercel.app/](https://coin-site-tau.vercel.app/)

---
## ✨ 주요 기능

- 🔄 **실시간 가격 업데이트**: WebSocket을 통한 즉각적인 가격 정보 갱신
- 📊 **김치프리미엄 계산**: 한국 가격과 해외 가격의 차이를 퍼센트로 표시
- 🔍 **검색 기능**: 코인 이름(한글/영문)으로 검색 가능
- 📈 **정렬 기능**: 가격, 김치프리미엄, 변동률 등 다양한 기준으로 정렬
- 🎨 **가격 변동 표시**: 상승/하락 여부를 색상과 아이콘으로 시각화
- 📱 **반응형 디자인**: 모바일과 데스크톱 환경 모두 지원

---

## 🛠 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구 및 개발 서버
- **Redux Toolkit** - 상태 관리
- **React Query** - 서버 상태 관리 및 데이터 페칭
- **React Router** - 라우팅
- **Material-UI** - UI 컴포넌트
- **Bootstrap** - 스타일링

### API & 실시간 통신
- **Upbit WebSocket API** - 한국 거래소 실시간 가격 데이터
- **Binance WebSocket API** - 해외 거래소 실시간 가격 데이터
- **Upbit REST API** - 초기 데이터 로딩
- **Binance REST API** - 초기 데이터 로딩
- **Google Sheets API** - USD/KRW 환율 정보

### 배포 & 분석
- **Vercel** - 호스팅 및 배포
- **Firebase** - 백엔드 서비스
- **Google Analytics (GA4)** - 사용자 분석
- **Google AdSense** - 광고

---

## 🚀 시작하기

### 필수 요구사항

- Node.js 16.x 이상
- npm 또는 yarn

---

## 📁 프로젝트 구조

```
coinSite/
├── public/                 # 정적 파일
│   ├── bitcoin.png        # 파비콘
│   └── ...
├── src/
│   ├── api/               # API 호출 함수
│   │   └── index.ts      # Upbit/Binance API 호출
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── Footer.tsx    # 푸터 컴포넌트
│   │   ├── Header.tsx    # 헤더 컴포넌트
│   │   └── ResetButton.tsx # 리셋 버튼 컴포넌트
│   ├── firebase/          # Firebase 설정
│   │   └── firebase.tsx
│   ├── function/          # 유틸리티 함수
│   │   └── data.ts       # 데이터 포맷팅 함수
│   ├── routes/            # 페이지 컴포넌트
│   │   └── Socket.tsx    # 메인 페이지 (WebSocket 실시간 업데이트)
│   ├── store/             # Redux 스토어
│   │   ├── coinSlice.ts  # 코인 관련 상태
│   │   ├── coinsSlice.ts # 코인 목록 상태
│   │   ├── coinKrwPrice.ts # 한국 가격 상태
│   │   ├── coinUsPrice.ts  # 해외 가격 상태
│   │   ├── upbitCoins.ts  # 업비트 코인 정보
│   │   ├── userSlice.ts   # 사용자 상태
│   │   └── configureStore.ts # 스토어 설정
│   ├── types/             # TypeScript 타입 정의
│   │   └── coin.ts        # 코인 관련 타입
│   ├── App.tsx            # 메인 앱 컴포넌트
│   ├── App.css            # 전역 스타일
│   └── main.tsx           # 엔트리 포인트
├── index.html             # HTML 템플릿
├── package.json           # 프로젝트 의존성
├── tsconfig.json          # TypeScript 설정
├── tsconfig.node.json     # Node.js TypeScript 설정
├── vite.config.ts         # Vite 설정
└── vercel.json            # Vercel 배포 설정
```

---

## 📖 주요 기능 설명

### 1. 실시간 가격 업데이트 (WebSocket)

이 프로젝트는 **WebSocket**을 사용하여 실시간으로 가격 정보를 업데이트합니다.

#### 업비트 WebSocket
- **엔드포인트**: `wss://api.upbit.com/websocket/v1`
- **데이터 타입**: 틱커(ticker) 데이터
- **업데이트 주기**: 가격 변동 시 즉시 업데이트

#### 바이낸스 WebSocket
- **엔드포인트**: `wss://fstream.binance.com/stream`
- **데이터 타입**: 마크 프라이스(mark price)
- **업데이트 주기**: 1초마다 업데이트

> 💡 **장점**: 폴링 방식(700ms 간격) 대비 거의 0ms의 지연으로 즉각적인 가격 반영이 가능합니다.

### 2. 김치프리미엄 계산

김치프리미엄은 다음 공식으로 계산됩니다:

```typescript
kimp = ((krwPrice - usPrice * exchangeRate) / (usPrice * exchangeRate)) * 100
```

- **양수**: 한국 가격이 더 높음 (프리미엄)
- **음수**: 한국 가격이 더 낮음 (디스카운트)

### 3. 정렬 기능

테이블 헤더를 클릭하면 다음 순서로 정렬이 전환됩니다:
1. 오름차순 (↑)
2. 내림차순 (↓)
3. 기본 순서

**지원하는 정렬 기준:**
- 코인 이름 (한글)
- 가격 (KRW)
- 김치프리미엄 (%)
- 전일 종가
- 변동액
- 변동률

### 4. 검색 기능

- 코인의 한글 이름 또는 영문 이름으로 검색 가능
- 대소문자 구분 없이 검색
- 실시간 필터링

### 5. 가격 변동 표시

- **상승**: 빨간색 + ↑ 아이콘
- **하락**: 파란색 + ↓ 아이콘
- **보합**: 회색

---

### 코드 스타일

- TypeScript를 사용하여 타입 안정성 확보
- React 함수형 컴포넌트 사용
- Redux Toolkit을 통한 상태 관리
- 컴포넌트는 PascalCase로 명명

---

## 📊 성능 최적화

- **코드 스플리팅**: Vite의 `manualChunks`를 통한 번들 최적화
- **WebSocket 연결**: 실시간 업데이트로 불필요한 API 호출 감소
- **Redux 상태 관리**: 효율적인 상태 업데이트
- **React Query**: 서버 상태 캐싱 및 자동 리페칭

---

## 👤 작성자

**jaeyonging**

- 배포 사이트: [https://coin-site-tau.vercel.app/](https://coin-site-tau.vercel.app/)
- GitHub: [@jaeyonging](https://github.com/jaeyonging)

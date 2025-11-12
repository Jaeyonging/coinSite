# 🪙 김치프리미엄 (Kimchi Premium) 체크 사이트

한국 거래소(업비트)와 해외 거래소(바이낸스) 간의 암호화폐 가격 차이를 실시간으로 확인할 수 있는 웹 애플리케이션입니다.

🌐 **배포 사이트**: [https://coin-site-tau.vercel.app/](https://coin-site-tau.vercel.app/)

## 📋 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [프로젝트 구조](#프로젝트-구조)
- [주요 기능 설명](#주요-기능-설명)
- [환경 변수](#환경-변수)
- [배포](#배포)

## ✨ 주요 기능

- **실시간 가격 업데이트**: WebSocket을 통한 즉각적인 가격 정보 갱신 (폴링 방식에서 개선)
- **김치프리미엄 계산**: 한국 가격과 해외 가격의 차이를 퍼센트로 표시
- **정렬 기능**: 가격, 김치프리미엄, 변동률 등 다양한 기준으로 정렬 가능
- **검색 기능**: 코인 이름(한글/영문)으로 검색 가능
- **가격 변동 표시**: 상승/하락 여부를 색상과 아이콘으로 시각화
- **반응형 디자인**: 모바일과 데스크톱 환경 모두 지원

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
- **Upbit REST API** - 초기 데이터 및 폴링 방식용
- **Binance REST API** - 초기 데이터 및 폴링 방식용
- **환율 API** - USD/KRW 환율 정보

### 배포
- **Vercel** - 호스팅 및 배포

### 기타
- **Firebase** - 백엔드 서비스
- **Google Analytics (GA4)** - 사용자 분석
- **Google AdSense** - 광고

## 📁 프로젝트 구조

```
coinSite/
├── public/                 # 정적 파일
├── src/
│   ├── api/               # API 호출 함수
│   │   └── index.ts
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── ResetButton.tsx
│   ├── firebase/          # Firebase 설정
│   │   └── firebase.tsx
│   ├── function/          # 유틸리티 함수
│   │   └── data.ts
│   ├── routes/            # 페이지 컴포넌트
│   │   ├── Home.tsx       # 메인 페이지 (폴링 방식 - 700ms 간격)
│   │   ├── Home2.tsx      # 대체 홈 페이지
│   │   └── Socket.tsx     # WebSocket 실시간 업데이트 페이지 (/socket 경로)
│   ├── store/             # Redux 스토어
│   │   ├── coinSlice.ts
│   │   ├── coinsSlice.ts
│   │   ├── coinKrwPrice.ts
│   │   ├── coinUsPrice.ts
│   │   ├── upbitCoins.ts
│   │   ├── userSlice.ts
│   │   └── configureStore.ts
│   ├── types/             # TypeScript 타입 정의
│   │   └── coin.ts
│   ├── App.tsx            # 메인 앱 컴포넌트
│   ├── App.css            # 전역 스타일
│   └── main.tsx           # 엔트리 포인트
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json            # Vercel 배포 설정
```

### 라우트 정보

- `/` - 메인 페이지 (Home.tsx) - 폴링 방식으로 700ms마다 가격 업데이트
- `/socket` - WebSocket 실시간 업데이트 페이지 (Socket.tsx) - 즉각적인 가격 반영 ⭐

> 💡 **권장**: 실시간성이 중요한 투자 결정을 위해서는 `/socket` 경로를 사용하세요.

## 📖 주요 기능 설명

### 1. 실시간 가격 업데이트

이 프로젝트는 두 가지 방식의 가격 업데이트를 지원합니다:

#### 폴링 방식 (Home.tsx)
- React Query의 `refetchInterval`을 사용하여 700ms마다 자동으로 가격 정보를 갱신합니다.
- 업비트와 바이낸스 REST API를 동시에 호출하여 최신 가격을 가져옵니다.

#### WebSocket 방식 (Socket.tsx) ⭐
- **업비트 WebSocket**: `wss://api.upbit.com/websocket/v1`을 통해 실시간 틱커 데이터 수신
- **바이낸스 WebSocket**: `wss://fstream.binance.com/stream`을 통해 실시간 마크 프라이스 수신
- 가격 변동이 발생하는 즉시 업데이트되어 **지연 시간이 거의 없습니다**.
- 투자 결정에 중요한 실시간성을 위해 폴링 방식에서 WebSocket 방식으로 개선했습니다.
  - 폴링 방식: 최대 700ms의 지연 가능
  - WebSocket 방식: 거의 0ms의 지연으로 즉각적인 가격 반영

### 2. 김치프리미엄 계산
```typescript
kimp = ((krwPrice - usPrice * exchangeRate) / (usPrice * exchangeRate)) * 100
```
- 양수: 한국 가격이 더 높음 (프리미엄)
- 음수: 한국 가격이 더 낮음 (디스카운트)

### 3. 정렬 기능
- 클릭 시 오름차순 → 내림차순 → 기본 순서로 전환
- 지원하는 정렬 기준:
  - 코인 이름 (한글)
  - 가격 (KRW)
  - 김치프리미엄 (%)
  - 전일 종가
  - 변동액
  - 변동률

### 4. 검색 기능
- 코인의 한글 이름 또는 영문 이름으로 검색 가능
- 대소문자 구분 없이 검색

## 🔧 환경 변수

프로젝트 루트에 `.env` 파일을 생성하여 다음 변수를 설정하세요:

```env
VITE_GA_PROPERTYID=G-XXXXXXXXXX  # Google Analytics 추적 ID
```

## 📦 배포

이 프로젝트는 Vercel을 통해 배포됩니다.

### Vercel 배포 방법

1. Vercel 계정에 GitHub 저장소 연결
2. 환경 변수 설정 (Vercel 대시보드에서)
3. 자동 배포 활성화

또는 Vercel CLI를 사용하여 배포:

```bash
npm i -g vercel
vercel
```

## 📝 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 👤 작성자

- **jaeyonging**
- 배포 사이트: [https://coin-site-tau.vercel.app/](https://coin-site-tau.vercel.app/)

## 🙏 참고 자료

- [Upbit API 문서](https://docs.upbit.com/)
- [Binance API 문서](https://binance-docs.github.io/apidocs/)
- [Vite 문서](https://vitejs.dev/)
- [React Query 문서](https://tanstack.com/query/latest)

---

**주의**: 이 사이트는 정보 제공 목적으로만 사용되며, 투자 결정에 대한 책임은 사용자에게 있습니다.

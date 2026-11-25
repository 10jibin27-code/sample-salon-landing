# 살롱 뮤즈 — 소상공인 1페이지 홈페이지 샘플 (미용실)

인천 구월동의 **가상 헤어살롱**을 기준으로 제작한 1페이지 랜딩 샘플입니다.
지비스 스튜디오의 '1페이지 홈페이지 제작 대행' 상품을 크몽·당근에서 소개할 때 보여주는 실제 라이브 포트폴리오입니다.

- 라이브: **<https://sample-salon-landing.vercel.app>** (Vercel `parkjibin` 팀 · GitHub `10jibin27-code/sample-salon-landing` 연동 — main 브랜치에 푸시하면 자동 재배포)
- 구성: 정적 HTML + CSS + 바닐라 JS (빌드 도구·외부 라이브러리 없음)
- 폰트: Google Fonts (Gowun Batang / Noto Sans KR / Cormorant Garamond)
- 사진: `images` 명령으로 생성한 가상 매장 이미지 8장 + OG 커버 (`assets/`)

## 구성 요소

| 섹션 | 내용 |
| --- | --- |
| 상단 배지 | `샘플 페이지 · 지비스 스튜디오 제작` 안내 바 |
| 헤더 | 영문 로고·메뉴·예약 접수 상태 표시·예약 CTA·모바일 햄버거 |
| 히어로 | 매장 외관 풀블리드(분할 레이아웃) + 대표 문구 + 예약/가격 CTA + 운영·위치·주차 요약 + 이번 시즌 카드 |
| 키워드 띠 | `CUT · COLOR · PERM · CLINIC` 무한 흐름 (모션 최소화 설정 시 정지) |
| 시술·가격 | 커트·컬러·펌·클리닉 4개 그룹 가격표(소요 시간·대표 표시) + 상담 안내 |
| 디자이너 | 원장·실장 2인 소개(사진·경력·전문 분야) + 해당 디자이너 예약 연결 |
| 스타일 | 최근 시술 갤러리 4장 + 안내 카드, 클릭 시 라이트박스 |
| 오시는 길 | 요일별 영업시간 표(오늘 행 자동 강조·영업중 표시) + 네이버지도·카카오맵 + 주차·편의 안내 |
| 예약 문의 | 이름·연락처·시술·디자이너·날짜·시간·요청 폼 → 입력 검증 후 문의 내용 정리·복사 패널 + 카카오톡 채널·네이버 예약 버튼 |
| FAQ | 6문항 아코디언 |
| 하단 배지 | '지비스 스튜디오 제작 샘플' 안내 |
| 모바일 하단 바 | 시술·가격 / 길찾기 / 예약 문의 고정 바 |

## 동작하는 기능

- 오늘 요일 기준 **영업 중·영업 종료 자동 판정**(화–일 운영, 월 휴무)과 영업시간 표 행 강조
- 예약 폼 **입력 검증**(이름 2자, 연락처 9~11자리, 오늘 이후 날짜)과 오류 메시지
- 문의 내용 자동 정리 → **클립보드 복사**, Esc·배경 클릭으로 닫기
- 갤러리 **라이트박스**(키보드 Esc 닫기, 포커스 복귀)
- 디자이너 카드의 '예약' 링크를 누르면 예약 폼의 담당 디자이너가 자동 선택
- 스크롤 등장 애니메이션, 스티키 헤더, 부드러운 앵커 이동, 모바일 메뉴
- `prefers-reduced-motion` 존중, 시맨틱 마크업·포커스 링·본문 건너뛰기 링크
- 구조화 데이터(`HairSalon` JSON-LD), OG 태그, 파비콘

## 수정 방법

| 바꾸고 싶은 것 | 위치 |
| --- | --- |
| 살롱 이름·소개 | `index.html` 의 `.brand`, `.hero` |
| 시술·가격 | `index.html` 의 `.prices` 목록 |
| 영업시간 | `index.html` 의 `#hoursTable` + `app.js` 의 `SCHEDULE` (둘 다 수정) |
| 주소·지도 링크 | `index.html` 의 `.mapcard` (네이버·카카오 검색 URL) |
| 디자이너 | `index.html` 의 `.dperson` (사진·경력·태그) |
| 사진 | `assets/` 의 jpg 교체 (같은 파일명 유지) |
| 색상 | `styles.css` 의 `:root` 변수 |

## 검수 스크린샷

`screenshots/` 폴더 — 데스크톱(1440) 전체 `desktop-full.jpg`, 히어로 `desktop-hero.jpg`, 섹션별 `desktop-menu.jpg`·`desktop-designer.jpg`·`desktop-style.jpg`·`desktop-visit.jpg`·`desktop-reserve.jpg`·`desktop-faq.jpg`·`desktop-sample-cta.jpg`, 예약 문의 패널 `desktop-reserve-modal.jpg`, 모바일(390) 전체 `mobile-full.jpg`·`mobile-hero.jpg`·`mobile-nav-open.jpg`·`mobile-reserve-modal.jpg` — 모두 실제 라이브 화면 캡처(jpg).

## 배포 (2026-11-25)

| 항목 | 값 |
| --- | --- |
| GitHub | `10jibin27-code/sample-salon-landing` (Public, `main`) |
| Vercel | `parkjibin` 팀 · 프로젝트 `sample-salon-landing` (Framework `Other`, 빌드 없음) |
| 라이브 | <https://sample-salon-landing.vercel.app> |
| 접근 보호 | 없음 — 로그인 없이 누구나 열람(200 OK) |

수정 후 배포는 `git add -A && git commit -m "..." && git push` 만 하면 Vercel이 자동으로 다시 배포합니다.

## 샘플 표기

가상 매장입니다. 상호·대표자·사업자번호·전화번호·주소가 모두 가상이고, 페이지 상단·하단에 '샘플' 표기를 넣었으며 `noindex`로 검색 노출을 막았습니다. 실제 손님에게는 **샘플이라는 점을 먼저 말하고** 링크를 보여주세요.

# openup-cicd-demo

> Open UP × 고려대 입문형 강의 실습용 데모 저장소 (2026-05-07 상반기, 2026-11-13 하반기)
>
> "AI와 사람이 함께 만든 코드를, AI로 검증·자동화하는 흐름"

작은 TypeScript 추론 API. `POST /predict` 로 features 배열을 받아 가짜 점수와 라벨을 돌려줍니다.

이 저장소는 강의 **블록 2(GitHub Actions 따라치기)** 와 **블록 3(AI가 만든 코드 검증·리팩토링, 하반기 추가)** 의 실습 대상입니다. 상반기 강의 시점의 코드는 태그 `2026-05-07`에 남겨 두었습니다.

---

## 0. 강의 시작 전 점검 (1분)

- ✅ 본인 GitHub 계정 (없다면 [github.com/signup](https://github.com/signup))
- ✅ 노트북 + 브라우저
- (선택) 로컬 git, Node.js 22.x(22.13 이상) 또는 24 이상 — **없어도 모든 실습은 GitHub 웹 UI에서 가능합니다**

---

## 1. Fork (3분)

1. 우측 상단 **Fork** 버튼 클릭
2. 본인 계정으로 fork
3. fork된 레포의 **Actions** 탭 클릭
4. "I understand my workflows, go ahead and enable them" → **Enable**
   - 이 단계를 빠뜨리면 워크플로가 실행되지 않습니다.

---

## 2. 코드 한 바퀴 (3분, 강사 화면)

| 파일 | 역할 |
|---|---|
| `src/predict.ts` | 가짜 추론 함수 — features 가중평균 → sigmoid → score/label |
| `src/validate.ts` | 입력 검증 — 배열인가, 길이 1~10인가, 모두 number 인가 |
| `src/app.ts` | Express 앱 — `/health`, `POST /predict`, 에러 핸들러 |
| `tests/*.test.ts` | Jest 테스트 — 단위(predict, validate) + 통합(app + supertest) |
| `.github/workflows/ci.yml` | **이번 실습의 주인공** — push/PR 시 lint + test 자동 실행 |
| `src/gpa.ts` | 블록 3 실습 대상. AI가 만든 학점 계산기 |
| `docs/gpa-spec.md` | 블록 3 실습 대상. 학점 계산기가 지켜야 할 명세 7가지 |
| `eslint.config.mjs` | 블록 3 실습 대상. ESLint 정적 분석 규칙 |

---

## 3. 첫 push, 초록불 받기 (10분)

### 3-1. 작은 변경 만들기

GitHub 웹 UI에서 다음 파일을 엽니다:

`src/predict.ts`

연필 아이콘(✏️) 클릭. 아래 줄을 찾으세요:

```ts
const WEIGHTS = [0.4, 0.3, 0.2, 0.1];
```

다음과 같이 변경합니다:

```ts
const WEIGHTS = [0.5, 0.3, 0.15, 0.05];
```

### 3-2. Commit

페이지 우측 상단 **Commit changes** 클릭 → 메시지 입력 (예: `tweak weights`) → **Commit changes**.

### 3-3. CI 결과 확인

**Actions** 탭으로 이동. 새 워크플로 실행이 보입니다.

- 노란색 ⏳ : 실행 중 (1~2분 소요)
- ✅ 초록색 : 성공
- ❌ 빨간색 : 실패

초록불이 뜨면 **AI가 만들었든 사람이 만들었든, 그 코드가 검증 게이트를 통과한 것**입니다. 이 게이트는 여러분이 직접 정의한 테스트입니다.

---

## 4. 일부러 깨뜨리기 (10분)

이번엔 의도적으로 테스트가 깨지도록 만들어 봅니다.

`tests/predict.test.ts` 를 GitHub 웹 UI에서 엽니다. 다음 부분을 찾으세요:

```ts
it('returns positive label when weighted sum is high', () => {
  const result = predict({ features: [10, 10, 10, 10] });
  expect(result.label).toBe('positive');
```

이 줄을:

```ts
  expect(result.label).toBe('negative');
```

으로 바꿉니다 (positive → negative).

Commit. Actions 탭으로 가서 **빨간불** 을 확인합니다.

> 🛑 **이게 핵심입니다.**
> AI가 자동 생성한 코드를 push해도, 사람이 미리 정의한 테스트가 어긋나면 게이트는 막힙니다.
> "검증 자체"는 AI가 못 만듭니다 — **무엇을 검증할지 결정하는 것은 사람의 몫**입니다. 이게 휴먼인더루프(Human-in-the-Loop)의 본질입니다.

---

## 5. 다시 고쳐서 초록불 (5분)

방금 바꾼 줄을 원래대로 되돌립니다 (`negative` → `positive`).

Commit. Actions 탭에서 다시 초록불 확인.

---

## 6. (강사 시연) Copilot CLI 로 고치기 (블록 1·2 연결)

블록 1에서 본 흐름의 변형. 새 GitHub Copilot CLI(`@github/copilot`) 사용:

1. 강사 노트북에서 `copilot -p "이 jest 실패 메시지를 분석하고 어떤 줄이 잘못됐는지 알려줘" --model auto`
   (비대화형 모드는 확인 창을 띄울 수 없어서, 허용하지 않은 파일 쓰기·명령 실행 요청은 거부합니다. 꼭 필요한 도구만 `--allow-tool`로 허용합니다)
2. CLI 출력 → 강사가 사람의 시각으로 검토 → 적용 여부 판단
3. push → 초록불

> 설치: `npm install -g @github/copilot` (Node.js 22+) · 또는 `brew install copilot-cli` / `winget install GitHub.Copilot`

> 휴먼인더루프 한 줄 요약:
> **"AI가 코드를 쓰는 시대일수록, 무엇을 검증할지 사람이 더 명확하게 정의해야 한다."**

---

## 블록 3 · AI가 만든 코드 검증하고 리팩토링하기 (2026-11-13 추가)

`src/gpa.ts`는 AI 코딩 도구에 "4.5 만점 학점 계산기를 TypeScript로 만들어 줘"라고 요청해 받은 코드입니다. 같은 AI가 만든 테스트(`tests/gpa.test.ts`)도 모두 통과하고 CI도 초록불입니다.

하지만 초록불은 '준비된 테스트를 통과했다'는 뜻입니다. '명세대로 동작한다'는 뜻은 아닙니다. 블록 3에서는 그 차이를 직접 확인합니다.

### 실습 A · 명세에서 테스트 만들기 (15분)

1. `docs/gpa-spec.md`를 열어 규칙 7가지를 읽습니다.
2. `tests` 폴더로 이동해 **Add file → Create new file**을 누릅니다. 파일 이름은 `gpa.spec.test.ts`입니다.
3. 강의 핸드아웃에 있는 코드 블록을 붙여 넣고 커밋합니다. 핸드아웃을 열 수 없으면 `docs/exercise/gpa.spec.test.ts`의 내용을 복사해도 됩니다.
4. Actions 탭에서 빨간불을 확인합니다. 실패한 테스트 이름과 `Expected`·`Received` 값을 읽어 어떤 규칙이 깨졌는지 찾습니다.
5. `src/gpa.ts`를 고칩니다. 직접 고쳐도 되고, 실패 메시지를 평소 쓰는 AI 도구에 붙여 넣어 고쳐도 됩니다. AI에게는 '실패한 규칙과 관련된 부분만 고치고 나머지 코드는 그대로 두라'고 요청합니다(실습 B·C에서 쓸 코드이기 때문입니다). 단 AI가 고친 코드는 커밋하기 전에 한 번 읽습니다. 고칠 대상은 `src/gpa.ts`입니다. AI가 테스트의 기대값을 바꿔서 통과시키자고 하면 받지 않습니다.
6. 초록불이 뜰 때까지 4~5단계를 반복합니다.

> 🛑 **핵심**
> AI가 만든 테스트는 AI가 만든 코드와 같은 가정을 공유합니다. 그래서 같은 곳을 함께 놓칩니다.
> 명세에서 출발한 테스트가 있어야 그 가정 밖의 버그가 드러납니다.

### 실습 B · 경고를 관문으로 올리기 (7분)

1. 가장 최근 Actions 실행에서 `Code quality (ESLint)` 단계를 펼칩니다. 경고(warning)가 여러 개 있지만 CI는 초록불입니다.
2. `eslint.config.mjs`를 열어 `eqeqeq`와 `complexity`의 `'warn'`을 `'error'`로 바꾸고 커밋합니다.
3. 빨간불을 확인합니다. 어떤 줄이 어떤 규칙에 걸렸는지 로그에서 읽습니다.

> 경고는 로그에만 남아 아무도 보지 않기 쉽습니다. 팀이 합의한 규칙은 관문(error)으로 올려야 CI가 실제로 막아 줍니다.

### 실습 C · AI로 리팩토링하고 테스트로 확인하기 (12분)

1. 평소 쓰는 AI 도구(ChatGPT, Claude, Gemini, Copilot 등 무엇이든)에 아래 요청과 `src/gpa.ts` 전체를 함께 붙여 넣습니다.

   ```text
   아래 TypeScript 파일을 리팩토링해 주세요.
   - export하는 이름(Grade, Course, GpaResult, gradeToPoint, calculateGpa)과 입력·출력 형태는 바꾸지 마세요.
   - 등급별 평점은 if/else 대신 조회용 객체로 바꿔 주세요.
   - 재수강 처리는 Map을 써서 배열을 한 번만 돌도록 바꿔 주세요.
   - == 와 != 는 === 와 !== 로 바꿔 주세요.
   - 설명 없이 완성된 파일 전체만 주세요.
   ```

2. 결과를 바로 붙여 넣지 말고 먼저 읽습니다. 요청하지 않은 동작 변경이나 새 기능이 들어가지 않았는지 확인합니다.
3. `src/gpa.ts`에 붙여 넣고 커밋합니다. 테스트와 ESLint를 모두 통과하면 초록불입니다.
4. 빨간불이면 어느 단계(`Type check`, `Code quality (ESLint)`, `Run tests`)가 무엇 때문에 실패했는지 보고 사람이 결정합니다. 의존성 설치가 성공했다면 앞 단계가 실패해도 뒤 단계는 끝까지 실행됩니다. `Type check`가 실패하면 테스트도 같은 타입 오류로 함께 실패하니 타입 오류부터 고칩니다. AI에게 다시 묻기, 직접 고치기, 리팩토링 취소하기 중 하나입니다.

> 리팩토링은 '동작은 그대로 두고 구조만 바꾸는 일'입니다. 동작이 그대로인지 판정하는 기준이 바로 실습 A에서 만든 테스트입니다.

### (강사 시연) 최적화는 측정부터

```bash
npm run bench
```

`scripts/bench.ts`가 과목 수를 늘려 가며 `calculateGpa()`의 실행 시간을 잽니다. 리팩토링 전과 후에 한 번씩 실행해 비교합니다. 과목 수가 적으면 차이가 거의 없고, 수만 개로 늘리면 재수강 처리 방식의 차이가 크게 드러납니다. AI가 "최적화했습니다"라고 말해도 측정하기 전에는 빨라졌는지 알 수 없습니다.

---

## 7. 로컬에서 돌리고 싶다면 (선택)

```bash
git clone https://github.com/<본인계정>/openup-cicd-demo.git
cd openup-cicd-demo
npm install
npm test           # 26 tests passed
npm run lint:quality   # ESLint 정적 분석
npm run bench          # calculateGpa() 실행 시간 측정
npm run dev        # http://localhost:3000
```

다른 터미널에서:

```bash
curl -X POST http://localhost:3000/predict \
  -H 'Content-Type: application/json' \
  -d '{"features": [1, 2, 3, 4]}'
```

---

## 강의 자료

- 강의 사이트: (강의 시작 전 별도 안내)
- Open UP 입문형 프로그램: https://www.oss.kr/

## 라이선스

MIT — 학습 목적의 데모 레포입니다.

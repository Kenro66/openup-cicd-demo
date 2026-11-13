/**
 * 📌 이 파일의 역할: "가짜 ML 추론 함수"
 *
 * 진짜 머신러닝 모델 대신, 입력 숫자들의 "가중평균"을 계산해서
 * 점수(score)와 라벨(positive/negative)을 돌려준다.
 *
 * 🧠 ML 지식이 없어도 OK!
 *   - 이 함수는 "면접 점수표"라고 생각하면 된다.
 *   - 입력 숫자(features)에 항목별 가중치(WEIGHTS)를 곱해 합산 → 총점
 *   - 그 총점을 sigmoid 함수로 0~1 사이 값으로 압축 → "확률처럼 보이는 점수"
 *   - 0.5 이상이면 'positive', 미만이면 'negative'로 분류
 *
 * 💡 이 실습에서 이 파일은 "테스트할 거리가 있는 비즈니스 로직" 역할만 한다.
 *    실제 ML 모델이 아니므로 무거운 라이브러리/GPU 등은 필요 없다.
 */

// 입력 타입: features는 숫자 배열 (예: [1, 2, 3, 4])
export interface PredictInput {
  features: number[];
}

// 출력 타입: 점수 + 라벨
export interface PredictOutput {
  score: number;                       // 0~1 사이 값
  label: 'positive' | 'negative';      // 0.5 기준으로 분류
}

// 각 입력 항목의 중요도 (1번이 가장 중요, 4번이 가장 덜 중요)
const WEIGHTS = [0.5, 0.3, 0.15, 0.05];

export function predict(input: PredictInput): PredictOutput {
  const { features } = input;

  // 1단계: 가중평균 계산
  //   features[i] × WEIGHTS[i]를 모두 더한다.
  //   features가 WEIGHTS보다 길면 초과분은 기본 가중치 0.1을 사용한다.
  const weightedSum = features.reduce((acc, value, idx) => {
    const w = WEIGHTS[idx] ?? 0.1;
    return acc + value * w;
  }, 0);

  // 2단계: sigmoid 함수로 0~1 사이로 압축
  //   - 큰 양수가 들어오면 1에 가까워짐
  //   - 큰 음수가 들어오면 0에 가까워짐
  //   - 0이 들어오면 정확히 0.5
  //   "S자 곡선"이라 sigmoid라고 부른다.
  const normalized = 1 / (1 + Math.exp(-weightedSum));

  // 3단계: 점수와 라벨로 정리해서 반환
  //   score는 보기 좋게 소수 4자리로 반올림한다.
  return {
    score: Number(normalized.toFixed(4)),
    label: normalized >= 0.5 ? 'positive' : 'negative'
  };
}

/**
 * 📌 이 파일의 역할: "predict() 함수의 단위 테스트(Unit Test)"
 *
 * 🧪 단위 테스트(Unit Test)란?
 *   → 함수 하나를 격리해서, 다양한 입력에 대해 기대한 출력이 나오는지 확인.
 *   → 외부(서버, DB, 네트워크) 없이도 빠르게 돌아간다.
 *
 * 이 파일은 predict.ts만 import해서 직접 호출 → 결과를 검증한다.
 * (Express나 HTTP 같은 건 전혀 안 거친다)
 *
 * ✅ 테스트 케이스 흐름:
 *   - 큰 양수 입력 → positive
 *   - 큰 음수 입력 → negative
 *   - score는 소수 4자리 이하
 *   - features가 짧을 때도 동작
 *   - features가 가중치보다 길 때도 기본 가중치로 동작
 */

import { predict } from '../src/predict';

describe('predict', () => {
  it('returns positive label when weighted sum is high', () => {
    const result = predict({ features: [10, 10, 10, 10] });
    expect(result.label).toBe('positive');
    expect(result.score).toBeGreaterThan(0.5);
  });

  it('returns negative label when weighted sum is very low', () => {
    const result = predict({ features: [-10, -10, -10, -10] });
    expect(result.label).toBe('negative');
    expect(result.score).toBeLessThan(0.5);
  });

  it('rounds score to 4 decimal places', () => {
    const result = predict({ features: [1, 2, 3, 4] });
    const decimals = result.score.toString().split('.')[1] ?? '';
    expect(decimals.length).toBeLessThanOrEqual(4);
  });

  it('handles features shorter than weight vector', () => {
    const result = predict({ features: [1] });
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(1);
  });

  it('handles features longer than weight vector with default weight', () => {
    const result = predict({ features: [1, 1, 1, 1, 1, 1, 1, 1] });
    expect(result.score).toBeGreaterThan(0.5);
  });
});

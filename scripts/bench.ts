/**
 * 📌 이 파일의 역할: "calculateGpa() 실행 시간 측정"
 *
 * 블록 3의 '최적화' 시연용입니다. 실행: npm run bench
 *
 * ⏱ 최적화는 '측정'에서 시작합니다.
 *   AI가 "이 코드를 최적화했습니다"라고 말해도, 측정하기 전에는 빨라졌는지 알 수 없습니다.
 *   학생 한 명의 성적표(과목 수십 개)와 학과 전체 이력을 한 번에 넣는 경우(과목 수만 개)를 비교해 봅니다.
 */

import { performance } from 'node:perf_hooks';
import { calculateGpa, Course, Grade } from '../src/gpa';

const GRADES: Grade[] = ['A+', 'A0', 'B+', 'B0', 'C+', 'C0', 'D+', 'D0', 'F', 'P'];

// 과목 수가 n개인 가짜 성적표를 만든다. 과목명이 절반쯤 겹치도록 해서 재수강 처리도 함께 일어나게 한다.
function makeCourses(n: number): Course[] {
  return Array.from({ length: n }, (_, i) => ({
    name: `과목-${i % Math.max(1, Math.floor(n / 2))}`,
    credits: (i % 3) + 1,
    grade: GRADES[i % GRADES.length],
  }));
}

function measure(n: number): void {
  const courses = makeCourses(n);
  calculateGpa(courses); // 첫 실행은 준비 운동 (JIT 컴파일 영향 줄이기)

  const start = performance.now();
  const result = calculateGpa(courses);
  const elapsed = performance.now() - start;

  console.log(`과목 ${n.toLocaleString()}개: ${elapsed.toFixed(2)}ms (gpa=${result.gpa})`);
}

for (const n of [40, 4_000, 20_000]) {
  measure(n);
}

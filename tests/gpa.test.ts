/**
 * 🤖 src/gpa.ts를 만든 AI가 "테스트도 만들어 줘"라는 요청에 함께 만든 테스트입니다.
 *    모두 통과합니다. 그렇다면 src/gpa.ts는 명세대로 동작한다고 말할 수 있을까요?
 */

import { calculateGpa, gradeToPoint } from '../src/gpa';

describe('calculateGpa', () => {
  it('일반 과목들의 평점 평균을 계산한다', () => {
    const result = calculateGpa([
      { name: '자료구조', credits: 3, grade: 'A+' },
      { name: '운영체제', credits: 3, grade: 'B0' },
    ]);

    expect(result.gpa).toBe(3.75);
    expect(result.gradedCredits).toBe(6);
    expect(result.earnedCredits).toBe(6);
  });

  it('F 과목은 0점으로 평점에 들어가고 취득 학점에서는 빠진다', () => {
    const result = calculateGpa([
      { name: '알고리즘', credits: 3, grade: 'A0' },
      { name: '컴퓨터구조', credits: 3, grade: 'F' },
    ]);

    expect(result.gpa).toBe(2);
    expect(result.earnedCredits).toBe(3);
  });

  it('재수강한 과목은 마지막 성적만 반영한다', () => {
    const result = calculateGpa([
      { name: '자료구조', credits: 3, grade: 'C0' },
      { name: '운영체제', credits: 3, grade: 'B+' },
      { name: '자료구조', credits: 3, grade: 'A0' },
    ]);

    expect(result.gpa).toBe(3.75);
    expect(result.gradedCredits).toBe(6);
  });
});

describe('gradeToPoint', () => {
  it('등급을 4.5 만점 평점으로 바꾼다', () => {
    expect(gradeToPoint('A+')).toBe(4.5);
    expect(gradeToPoint('B0')).toBe(3.0);
    expect(gradeToPoint('F')).toBe(0);
  });
});

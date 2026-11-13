
/**
 * 📌 이 파일의 역할: "학점(평점) 계산기"
 *
 * 🤖 블록 3 실습 대상입니다 (2026-11-13 하반기 강의).
 *   AI 코딩 도구에 "4.5 만점 학점 계산기를 TypeScript로 만들어 줘"라고 요청해 받은 코드를
 *   거의 그대로 두었습니다. 테스트(tests/gpa.test.ts)도 같은 AI가 만들었고, CI는 초록불입니다.
 *
 *   그런데 이 코드는 정말 명세(docs/gpa-spec.md)대로 동작할까요?
 *   README의 '블록 3' 절을 따라 직접 확인해 보세요.
 */

export type Grade = 'A+' | 'A0' | 'B+' | 'B0' | 'C+' | 'C0' | 'D+' | 'D0' | 'F' | 'P' | 'NP';

export interface Course {
  name: string;
  credits: number;
  grade: Grade;
}

export interface GpaResult {
  gpa: number | null;
  gradedCredits: number;
  earnedCredits: number;
}

// 등급을 평점으로 바꾼다
export function gradeToPoint(grade: string): number {
  if (grade == 'A+') {
    return 4.5;
  } else if (grade == 'A0') {
    return 4.0;
  } else if (grade == 'B+') {
    return 3.5;
  } else if (grade == 'B0') {
    return 3.0;
  } else if (grade == 'C+') {
    return 2.5;
  } else if (grade == 'C0') {
    return 2.0;
  } else if (grade == 'D+') {
    return 1.5;
  } else if (grade == 'D0') {
    return 1.0;
  } else {
    return 0;
  }
}

// 재수강한 과목은 마지막 기록만 남긴다
function removeRetakes(courses: Course[]): Course[] {
  return courses.filter(
    (course, index) => !courses.slice(index + 1).some((later) => later.name == course.name)
  );
}

// 과목 목록을 받아 평점 평균과 학점 수를 계산한다
export function calculateGpa(courses: Course[]): GpaResult {
  const finalCourses = removeRetakes(courses);

  let totalPoints = 0;
  let gradedCredits = 0;
  let earnedCredits = 0;

  for (const course of finalCourses) {
    if (course.grade != 'F' && course.grade != 'NP') {
      earnedCredits += course.credits;
    }

    // 수정 1: P/NP 과목은 평점 계산에서 제외
    const isPassFail = course.grade === 'P' || course.grade === 'NP';

    if (isPassFail) {
      continue;
    }

    totalPoints += course.credits * gradeToPoint(course.grade);
    gradedCredits += course.credits;
  }

  // 수정 2: 평점 대상 과목이 없으면 null 반환
  if (gradedCredits === 0) {
    return { gpa: null, gradedCredits, earnedCredits };
  }

  // 수정 3: 소수 셋째 자리에서 반올림
  const gpa = Math.round((totalPoints / gradedCredits) * 100) / 100;

  return { gpa, gradedCredits, earnedCredits };
}

// 📌 이 파일의 역할: "ESLint 정적 분석 규칙"
//
// 🔍 정적 분석(static analysis)이란?
//   → 코드를 '실행하지 않고' 읽기만 해서 위험한 패턴을 찾아내는 검사.
//   → 테스트가 '결과가 맞는가'를 본다면, 정적 분석은 '코드 모양이 위험하지 않은가'를 본다.
//
// 🚦 CI의 'Code quality (ESLint)' 단계가 이 설정으로 src 폴더를 검사합니다.
//   'error' 규칙을 어기면 CI가 빨간불, 'warn' 규칙은 로그에 경고만 남기고 통과합니다.

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**'] },

  // 기본 추천 규칙 묶음 (JavaScript + TypeScript)
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.ts'],
    rules: {
      // 이름이 _로 시작하는 매개변수는 '일부러 안 쓰는 값'으로 보고 넘어간다
      // (Express 에러 핸들러는 매개변수 4개를 모두 받아야 동작하기 때문)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // 🧪 블록 3 실습 B: 아래 두 규칙의 'warn'을 'error'로 바꿔 커밋해 보세요.
      //    경고(warn)는 로그에만 남아 아무도 보지 않기 쉽습니다.
      //    관문(error)으로 올려야 CI가 실제로 막아 줍니다.

      // ==, != 대신 ===, !== 를 쓰도록 강제 (타입 변환 때문에 생기는 버그 예방)
      eqeqeq: 'warn',

      // 함수 하나의 분기(if, else if, &&, || 등) 수가 너무 많으면 경고
      // 분기가 많을수록 읽기 어렵고 테스트하기 어렵습니다.
      complexity: ['warn', { max: 8 }],
    },
  },
);

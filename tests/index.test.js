const fs = require('fs');
const assert = require('assert');
const { test } = require('node:test');

// 이 테스트는 코드가 YOUTUBE_API_KEY가 없을 때 프로그램을 종료하도록 작성되어 있는지 확인한다

test('exits if YOUTUBE_API_KEY is missing', () => {
  const code = fs.readFileSync('src/index.ts', 'utf8');
  const hasCheck = /if\s*\(!process\.env\.YOUTUBE_API_KEY\)/.test(code) && /process\.exit\(1\)/.test(code);
  assert.ok(hasCheck);
});

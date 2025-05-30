# AGENTS 안내

이 파일은 Codex와 같은 LLM 에이전트가 `youtube-mcp-server` 저장소를 다룰 때 따라야 할 규칙을 설명합니다.

## 기본 규칙
1. 모든 코드와 문서는 **영어**로 작성합니다. (이 안내 문서만 한국어로 작성되어 있습니다.)
2. 코드를 수정한 후 `npm run build` 를 실행하여 TypeScript 컴파일 오류가 없는지 확인하세요.
3. 커밋 메시지는 영문으로 작성하며 다음과 같은 태그를 사용합니다:
   - `feat`: 새로운 기능 추가
   - `fix`: 버그 수정
   - `docs`: 문서 변경
   - `chore`: 빌드/환경 설정 등 기타 변경
4. `dist/` 디렉터리는 빌드 결과물로, 직접 수정하지 않습니다.

## 프로젝트 구조
- `src/` 폴더에 TypeScript 소스 코드가 위치합니다.
- `functions/` 폴더는 MCP function 그룹 예제가 포함되어 있습니다.
- `smithery.yaml` 은 MCP 서버 실행 명령을 정의합니다.

## 개발 방법
1. 의존성 설치: `npm install`
2. 빌드: `npm run build`
3. 개발 서버 실행: `npm run dev`

현재 테스트나 린트 스크립트는 제공되지 않습니다.

## PR 작성 규칙
- 작은 단위로 커밋하고 명확한 메시지를 남기세요.
- Pull Request 설명에는 변경한 이유와 주요 변경 사항을 간단히 기술합니다.
- CI가 추가되면 반드시 모든 검사를 통과한 후 PR을 생성하세요.


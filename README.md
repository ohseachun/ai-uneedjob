# LangChain TypeScript 프로젝트

이 프로젝트는 LangChain을 사용한 AI 애플리케이션입니다.

## 설치

```bash
npm install
```

## 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 필요한 API 키들을 설정하세요:

```bash
cp .env.example .env
```

## 실행

```bash
# 개발 모드 (TypeScript 직접 실행)
npm run dev

# 개발 모드 (파일 변경 감지)
npm run dev:watch

# 빌드
npm run build

# 프로덕션 모드
npm start
```

## 프로젝트 구조

- `src/chains/`: LangChain 체인 정의
- `src/prompts/`: 프롬프트 템플릿
- `src/agents/`: LangChain 에이전트
- `src/tools/`: 커스텀 도구
- `src/memory/`: 메모리 관리
- `src/models/`: 모델 설정
- `src/config/`: 설정 파일
- `src/utils/`: 유틸리티 함수
- `examples/`: 예제 코드
- `tests/`: 테스트 파일
- `docs/`: 문서

## TypeScript 설정

이 프로젝트는 TypeScript로 작성되었습니다. `tsconfig.json`에서 컴파일러 옵션을 확인할 수 있습니다. 
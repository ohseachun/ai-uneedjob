/**
 * 프롬프트 템플릿 정의
 * 
 * 학습 목표:
 * 1. 구조화된 프롬프트 작성법
 * 2. 변수 바인딩을 통한 동적 프롬프트 생성
 * 3. AI 모델에게 명확한 지시사항 제공
 * 4. 일관된 출력 형식 정의
 */

/**
 * 키워드 추출용 프롬프트 템플릿
 * 
 * 이 프롬프트는 요약된 텍스트를 받아서 구조화된 정보를 추출합니다.
 * {summary} 변수는 PromptTemplate에서 동적으로 바인딩됩니다.
 * 
 * 프롬프트 설계 원칙:
 * - 명확한 지시사항 제공
 * - 구체적인 출력 형식 제시
 * - 예시를 통한 이해도 향상
 */
export const keywordExtractionPrompt = `
다음 프로젝트 내용ㅇㄹ 읽고 핵심 정보를 bullet point로 정리해줘.

요약: {summary}

출력 예시:
- 분야: 
- 주요 스킬:
- 핵심 키워드:
- 투입일자:
- 위치:
- 특이사항:
`;
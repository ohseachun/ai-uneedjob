// ========================================
// 마케팅 문구 생성기 예제
// ========================================
// 
// 이 예제의 목적:
// 1. LangChain의 기본적인 체인(Chain) 사용법 학습
// 2. 프롬프트 템플릿과 LLM 연결 방법 이해
// 3. 동적 입력을 받아 AI 응답 생성하기
//
// 학습해야 할 핵심 개념:
// - LLM (Large Language Model): AI 모델
// - PromptTemplate: 동적 프롬프트 생성
// - Chain: LLM과 프롬프트를 연결하는 파이프라인
// - invoke(): 체인 실행 메서드
//
// 기본 패턴: LLM → PromptTemplate → Chain → invoke()
// ========================================

// ⚠️ 주의: LLMChain은 LangChain v0.1 이후 deprecated 되었어. 
// 이제는 RunnableSequence, RunnablePassthrough, RunnableMap 등 Runnable 기반 체이닝을 써야 해.
// 공식 문서: https://js.langchain.com/docs/guides/updating/v0_1_0

// ========================================
// 1. 필요한 패키지들 import
// ========================================
import { ChatOpenAI } from "@langchain/openai";        // OpenAI의 채팅 모델
import { PromptTemplate } from "@langchain/core/prompts"; // 동적 프롬프트 템플릿
import { LLMChain } from "langchain/chains";           // LLM과 프롬프트를 연결하는 체인
import * as dotenv from "dotenv";                      // 환경변수(.env) 로드

// ========================================
// 2. 환경 설정
// ========================================
dotenv.config();  // .env 파일에서 API 키들을 process.env에 로드

// ========================================
// 3. LLM 모델 설정
// ========================================
const chat = new ChatOpenAI({
    modelName: "gpt-4o-mini",  // 사용할 AI 모델 (GPT-4o-mini)
    temperature: 0.7,          // 창의성 수준 (0~1)
                                 // 0: 일관된 답변, 1: 창의적인 답변
});

// ========================================
// 4. 프롬프트 템플릿 생성
// ========================================
const prompt = new PromptTemplate({
    inputVariables: ["product"],  // 프롬프트에서 사용할 동적 변수들
    template: "다음 제품에 대한 마케팅 문구를 한국어로 작성해줘: {product}"  // 실제 프롬프트 템플릿
    // {product} 부분이 실제 입력값으로 대체됨
})

// ========================================
// 5. 체인 생성 (LLM + 프롬프트 결합)
// ========================================
const chain = new LLMChain({
    llm: chat,    // 사용할 LLM 모델
    prompt        // 사용할 프롬프트 템플릿
})
// 체인은 LLM과 프롬프트를 연결하는 파이프라인 역할

// ========================================
// 6. 실행 함수
// ========================================
const invoke = async() => {
    // 체인 실행: 입력값을 받아서 AI 응답 생성
    const response = await chain.invoke({
        product: "오세천"  // 실제 입력값 (프롬프트의 {product} 부분에 대체됨)
    })

    // 결과 출력
    console.log(`Marketing Response : ${JSON.stringify(response)}`);
}

// ========================================
// 7. 함수 실행
// ========================================
invoke();

// ========================================
// 예상 결과:
// - 입력: "오세천"
// - 출력: "오세천에 대한 마케팅 문구가 AI에 의해 생성됨"
// ========================================
// ========================================
// 마케팅 문구 생성기 예제 (현대적 방식)
// ========================================
// 
// 이 예제의 목적:
// 1. LangChain의 현대적인 Runnable 기반 체이닝 학습
// 2. deprecated된 LLMChain 대신 권장되는 방식 사용
// 3. 동적 입력을 받아 AI 응답 생성하기
//
// 학습해야 할 핵심 개념:
// - Runnable: LangChain v0.1+ 에서 권장하는 기본 인터페이스
// - RunnableSequence: 여러 Runnable을 순차적으로 연결
// - PromptTemplate: 동적 프롬프트 생성
// - invoke(): 실행 메서드
//
// 기본 패턴: PromptTemplate → LLM → invoke()
// ========================================

// ========================================
// 1. 필요한 패키지들 import
// ========================================
import { ChatOpenAI } from "@langchain/openai";        // OpenAI의 채팅 모델
import { PromptTemplate } from "@langchain/core/prompts"; // 동적 프롬프트 템플릿
import { Runnable, RunnableSequence } from "@langchain/core/runnables"; // Runnable 관련 클래스
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
// 5. 현대적 방식: PromptTemplate과 LLM 직접 연결
// ========================================
// LLMChain 대신 PromptTemplate을 LLM에 직접 연결
// 이 방식이 LangChain v0.1+ 에서 권장되는 방식

// ========================================
// 6. 실행 함수
// ========================================
const invoke = async() => {
    // 방법 1: 프롬프트 템플릿을 먼저 포맷하고 LLM에 전달
    const formattedPrompt = await prompt.format({
        product: "오세천"  // 실제 입력값 (프롬프트의 {product} 부분에 대체됨)
    });
    
    const response = await chat.invoke([formattedPrompt]);
    
    // 결과 출력
    console.log(`Marketing Response (Method 1): ${JSON.stringify(response)}`);
    
    // 방법 2: pipe() 메서드를 사용한 체이닝 (더 현대적)
    const chain: Runnable<{ product: string }, unknown> = prompt.pipe(chat);
    
    const response2 = await chain.invoke({
        product: "오세천"
    });
    
    console.log(`Marketing Response (Method 2): ${JSON.stringify(response2)}`);
}

// ========================================
// 7. 함수 실행
// ========================================
invoke();

// ========================================
// 예상 결과:
// - 입력: "오세천"
// - 출력: "오세천에 대한 마케팅 문구가 AI에 의해 생성됨"
// 
// 두 방법 모두 동일한 결과를 생성하지만,
// Method 2 (pipe 방식)가 더 현대적이고 권장되는 방식입니다.
// ======================================== 
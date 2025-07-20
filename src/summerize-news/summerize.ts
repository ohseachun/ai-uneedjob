/**
 * 뉴스 요약 및 키워드 추출 예제
 * 
 * 학습 목표:
 * 1. LangChain의 Document 클래스 사용법 학습
 * 2. loadSummarizationChain을 이용한 텍스트 요약 체인 구현
 * 3. LLMChain을 이용한 구조화된 프롬프트 처리
 * 4. 외부 API (뉴스 웹사이트) 데이터 수집 및 처리
 * 5. 체인 연결 (요약 → 키워드 추출) 워크플로우 구현
 * 6. 환경 변수를 통한 API 키 관리
 */

// 환경 변수 로드 (API 키 등 민감한 정보 관리)
import * as dotenv from "dotenv";
dotenv.config();

// LangChain 핵심 컴포넌트들 import
import { ChatOpenAI } from "@langchain/openai";  // OpenAI GPT 모델 사용
import { loadSummarizationChain } from "langchain/chains";  // 텍스트 요약 체인
import { Document } from "langchain/document";  // 문서 객체 (텍스트를 LangChain 형식으로 변환)
import { PromptTemplate } from "@langchain/core/prompts";  // 구조화된 프롬프트 템플릿
import { LLMChain } from "langchain/chains";  // 기본 LLM 체인 (프롬프트 + 모델)

// 로컬 모듈 import
import { keywordExtractionPrompt } from "./prompts";  // 키워드 추출용 프롬프트
import { fetchNewsText } from "./utils";  // 웹 스크래핑 유틸리티

/**
 * 뉴스 URL을 받아서 요약하고 키워드를 추출하는 메인 함수
 * @param url - 요약할 뉴스 기사의 URL
 */
async function summarizeNews(url: string) {
  // 1단계: 웹 스크래핑으로 뉴스 텍스트 수집
  const rawText = await fetchNewsText(url);

  // 2단계: OpenAI 모델 설정
  const model = new ChatOpenAI({
    temperature: 0.2,  // 낮은 temperature로 일관된 결과 생성
    modelName: "gpt-4o",  // 최신 GPT-4 모델 사용
    openAIApiKey: process.env.OPENAI_API_KEY,  // 환경 변수에서 API 키 로드
  });

  // 3단계: 텍스트를 LangChain Document 객체로 변환
  // Document는 LangChain이 텍스트를 처리할 때 사용하는 표준 형식
  const docs = [new Document({ pageContent: rawText })];
  
  // 4단계: 요약 체인 생성 및 실행
  // loadSummarizationChain의 type에는 여러 방식이 있음:
  // - "map_reduce": 긴 텍스트를 여러 청크로 나누어 각각 요약(map)한 뒤, 그 결과를 다시 합쳐 최종 요약(reduce)함. 대용량 텍스트에 적합.
  // - "stuff": 모든 텍스트를 한 번에 LLM에 입력(stuff)하여 요약. 짧은 텍스트에 빠르고 간단하게 사용.
  // - "refine": 첫 청크를 요약한 뒤, 다음 청크를 순차적으로 추가하며 요약을 점진적으로 개선(refine)함. 맥락을 누적하며 정교하게 요약.
  // 각 방식의 특징:
  //   - map_reduce: 병렬 처리 가능, 대용량에 강함, 다소 요약이 단순해질 수 있음.
  //   - stuff: 가장 빠르고 간단, 입력 길이 제한에 주의.
  //   - refine: 맥락을 누적해 더 정교한 요약 가능, 처리 속도는 느릴 수 있음.
  const chain = await loadSummarizationChain(model, { type: "map_reduce" });
  const summaryResult = await chain.call({ input_documents: docs });
  const summary = summaryResult?.text;
  
  console.log("✅ 요약 결과:\n", summary);

  // 5단계: 키워드 추출을 위한 프롬프트 템플릿 생성
  const prompt = new PromptTemplate({
    inputVariables: ["summary"],  // 프롬프트에서 사용할 변수명
    template: keywordExtractionPrompt,  // prompts.ts에서 정의된 템플릿
  });

  // 6단계: 키워드 추출 체인 생성 및 실행
  // LLMChain: 프롬프트 + 모델을 연결하는 기본 체인
  const extractChain = new LLMChain({ llm: model, prompt });
  const keywordsResult = await extractChain.call({ summary });

  console.log("\n📌 요점 및 키워드 추출:\n", keywordsResult.text);
}

// 테스트 실행
const newsUrl = "https://www.bbc.com/news/technology-66208730";
summarizeNews(newsUrl);
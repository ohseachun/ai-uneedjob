// 오류 원인: langchain/document_loaders/fs/csv 모듈이 존재하지 않거나, 설치된 langchain 버전에 해당 경로가 없음.
// 해결 방법: 최신 langchain에서는 CSVLoader가 "langchain/document_loaders/fs" 또는 "langchain/document_loaders"에 위치함.
// 아래와 같이 경로를 수정해야 함:

// 왜 오류? 
// 최신 langchain 버전에서는 "langchain/document_loaders/fs" 경로에 CSVLoader가 없을 수 있음.
// 보통 "langchain/document_loaders"에서 import해야 함.
// 왜 오류? 
// 최신 langchain 버전에서는 "langchain/document_loaders/fs/csv" 경로에 CSVLoader가 없을 수 있음.
// 보통 "langchain/document_loaders" 또는 "@langchain/community/document_loaders/csv"에서 import해야 함.
// 현재 코드에서는 "@langchain/community/document_loaders/csv"에서 CSVLoader를 import하고 있으므로, 
// 만약 해당 패키지가 설치되어 있지 않거나, 버전이 맞지 않으면 오류가 발생할 수 있음.
// 또한, langchain/document_loaders/fs/csv 경로로 import하려고 하면 모듈을 찾을 수 없다는 오류가 발생함.
// 따라서, 올바른 import 경로와 패키지 설치 여부를 확인해야 함.

import * as dotenv from "dotenv";
dotenv.config();

import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
// langchain 최신 버전에서는 CSVLoader가 "@langchain/community/document_loaders/csv"에 있습니다.
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
dotenv.config();

// 1. 프로젝트 요약 정의
const projectSummary: string = `
React, TypeScript 기반 프론트엔드 웹 애플리케이션 개발. Figma 기반 UI 작업 경험과 API 연동 능력이 중요하며, GraphQL 경험이 있으면 좋음. 디자이너만 구합니다.`;

// 2. 프리랜서 CSV 로드 (name, skills, experience, etc)
const loadFreelancers = async () => {
  const loader = new CSVLoader("src/matching-freelancer/freelancers.csv");
  const documents = await loader.load(); // Document[] 형태로 반환
  return documents;
};

// 3. 벡터스토어 생성 후 유사도 기반 검색
const matchFreelancers = async () => {
  const docs = await loadFreelancers();
  const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());

  // 프로젝트 요약 기준 top 5 프리랜서 유사도 검색
  /**
   * similaritySearchWithScore 메서드에 대한 상세 설명:
   * 
   * 이 메서드는 주어진 쿼리(여기서는 projectSummary)와 벡터스토어에 저장된 문서들 간의 임베딩(embedding) 유사도를 계산하여,
   * 가장 유사한 문서들을 점수와 함께 반환합니다.
   * 
   * 반환값: Promise<[Document, number][]> 형태로, 각 배열 원소는 [문서, 유사도 점수] 쌍입니다.
   * 점수는 일반적으로 "거리" 또는 "유사도"로, 값이 낮을수록(또는 높을수록) 더 유사함을 의미합니다.
   * 
   * 주요 옵션 및 파라미터:
   *   - query: string | 임베딩할 쿼리 텍스트(여기서는 projectSummary)
   *   - k: number | 반환할 top-N 결과 개수 (여기서는 5)
   *   - filter?: object | (선택) 문서 메타데이터 기반 필터링 조건
   *   - callbacks?: Callbacks | (선택) 실행 중 호출할 콜백 함수들
   *   - ...기타 벡터스토어 구현체에 따라 추가 옵션이 있을 수 있음
   * 
   * 예시 옵션 사용법:
   *   await vectorStore.similaritySearchWithScore(query, k, filter, callbacks)
   * 
   * 예시:
   *   const results = await vectorStore.similaritySearchWithScore(
   *     projectSummary, // 쿼리
   *     5,              // top 5 결과
   *     { 분야: "개발" } // (선택) 분야가 "개발"인 문서만
   *   );
   * 
   * 공식 문서 참고: 
   *   https://js.langchain.com/docs/modules/data_connection/vectorstores/interfaces/
   */
  // similaritySearchWithScore는 벡터 임베딩 기반의 "코사인 유사도" 또는 "거리"를 내부적으로 사용하며,
  // 직접 유사도 계산 방식을 지정하는 옵션은 제공하지 않습니다.
  // (벡터스토어 구현체에 따라 다르지만, OpenAIEmbeddings+MemoryVectorStore 조합은 코사인 유사도 기반)
  // 다만, 결과를 후처리하여 내가 원하는 임계값(threshold) 이상/이하만 필터링할 수 있습니다.

  // 예시: 유사도 점수가 0.8 이상(더 유사한) 결과만 필터링
  const rawResults = await vectorStore.similaritySearchWithScore(
    projectSummary,
    10 // 더 넉넉히 받아서 필터링
  );
  const threshold = 0.8; // 내가 원하는 유사도 기준(예: 0.8 이상만)
  const results = rawResults
    .filter(([doc, score]) => score >= threshold)
    .slice(0, 5); // top 5만 사용

  // 결과 출력
  console.log("🔍 프로젝트에 어울리는 프리랜서 추천:");
  results.forEach(([doc, score], index) => {
    console.log(`\n#${index + 1}`);
    console.log(`🧑‍💻 내용: ${doc.pageContent}`);
    console.log(`📊 매칭 점수(유사도): ${score.toFixed(3)}`);
  });
};

// 실행
matchFreelancers();
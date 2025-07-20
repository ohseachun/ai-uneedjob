/**
 * 웹 스크래핑 유틸리티 함수
 * 
 * 학습 목표:
 * 1. node-fetch를 이용한 HTTP 요청 처리
 * 2. HTML 파싱 및 텍스트 추출
 * 3. 정규표현식을 이용한 DOM 요소 추출
 * 4. 비동기 함수 처리 및 에러 핸들링
 * 5. 텍스트 전처리 (길이 제한, HTML 태그 제거)
 */

// node-fetch 모듈이 설치되어 있지 않거나 타입 선언이 없어서 발생하는 오류입니다.
// node-fetch를 설치하려면 터미널에서 다음 명령어를 실행하세요:
// npm install node-fetch
// 타입스크립트 타입이 필요하다면 다음도 실행하세요:
// npm install --save-dev @types/node-fetch

// ESM 환경에서는 import fetch from "node-fetch"; 대신 아래와 같이 사용해야 할 수도 있습니다:
// import fetch from "node-fetch";

// 또는 CommonJS 환경에서는:
// const fetch = require("node-fetch");

import fetch from "node-fetch";

/**
 * 웹페이지에서 텍스트를 추출하는 함수
 * @param url - 스크래핑할 웹페이지 URL
 * @returns 추출된 텍스트 (최대 5000자)
 */
export async function fetchNewsText(url: string) {
    // 1단계: HTTP GET 요청으로 웹페이지 HTML 가져오기
    const response = await fetch(url);

    // 2단계: 응답을 텍스트로 변환
    // response.text()는 Promise<string>을 반환하므로 await를 사용해야 합니다.
    const html = await response.text();
    
    // 3단계: 정규표현식으로 <body> 태그 내용 추출
    // [\s\S]*? 에서 *?는 "비탐욕적"이라는 뜻인데, 
    // 이는 가능한 한 짧게(최소한으로) 일치시키라는 의미야.
    // 예를 들어, <body>와 </body> 사이에 여러 개의 </body>가 있을 때,
    // *?를 쓰면 가장 가까운 </body>까지만 매칭해.
    // 반대로 *만 쓰면(탐욕적), 가능한 한 많이(최대한 길게) 매칭해서 마지막 </body>까지 잡아버려.
    // 즉, "비탐욕적"은 정규표현식이 최소한의 범위만 선택하도록 하는 방식이야.
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

    // 4단계: HTML 태그 제거 및 텍스트 정리
    // <[^>]+> 정규표현식으로 모든 HTML 태그 제거
    const text = bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, '') : '';
    
    // 5단계: 텍스트 정리 및 길이 제한
    // trim(): 앞뒤 공백 제거
    // slice(0, 5000): 최대 5000자로 제한 (토큰 제한 고려)
    return text.trim().slice(0, 5000);
}






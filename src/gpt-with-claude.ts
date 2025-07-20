import { ChatOpenAI } from "@langchain/openai";        // OpenAI의 채팅 모델
import { PromptTemplate } from "@langchain/core/prompts"; // 동적 프롬프트 템플릿
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";                      // 환경변수(.env) 로드
import { ChatAnthropic } from "@langchain/anthropic";


dotenv.config();


const gpt = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.7,
})

const claude = new ChatAnthropic({
    modelName: "claude-3-5-sonnet-20241022",
    temperature: 0.7,
})

const email: string = `
이번 주 금요일 오후 3시에 있을 회의에서는 마케팅 전략과 SNS 인플루언서 캠페인 일정이 주요 안건입니다.
참석 여부를 목요일 오전까지 알려주시기 바랍니다.
`;


const invoke = async() => {

    const gptSummary = await gpt.invoke([
        new HumanMessage(`다음 이메일을 한 문단으로 요약해줘:\n${email}\n\n\n\n\n`)
    ])

    console.log("📝 GPT 요약:", gptSummary.content);

    const claudeSummary = await claude.invoke([
        new HumanMessage(`다음 문장을 더 자연스럽게 정리해줘:\n${email}`)
    ])

    console.log("🤖 Claude 정리:", claudeSummary.content);
}

invoke();
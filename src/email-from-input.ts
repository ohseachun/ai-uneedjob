import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage } from "@langchain/core/messages";
import * as readline from "readline";
import * as dotenv from "dotenv";

dotenv.config();


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const gpt = new ChatOpenAI({modelName: "gpt-4o-mini", temperature: 0.3});
const claude = new ChatAnthropic({modelName: "claude-3-5-sonnet-20241022", temperature: 0.5});

rl.question("이메일 본문을 입력해 주세요.", async (inputstring:string): Promise<void> => {
    
    const gptSummary = await gpt.invoke([
        new HumanMessage(`다음 이메일을 한 문단으로 요약해줘:\n${inputstring}`)
    ])

    console.log("GPT 요약:", gptSummary.content);


    // refined는 "더 다듬어진" 또는 "더 자연스럽게 정리된" 결과를 의미합니다.
    const refined = await claude.invoke([
        new HumanMessage(`다음 문장을 더 자연스럽게 정리해줘:\n${inputstring}`)
    ])

    console.log("\n📝 요약:", refined.content);
    rl.close();

})

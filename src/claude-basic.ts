// 이 코드는 LangChain 라이브러리에서 제공하는 Anthropic(Claude) 챗 모델과 메시지 타입을 불러오는 코드입니다.
// ChatAnthropic는 Claude와의 대화를 위한 클래스이고,
// HumanMessage와 AIMessage는 각각 사람과 AI가 주고받는 메시지를 나타내는 타입입니다.
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";

dotenv.config();

const claude = new ChatAnthropic({
    modelName: "claude-3-5-sonnet-20241022",
    temperature: 0.5,
})

const invoke = async() => {
    const response: AIMessage = await claude.invoke([
        new HumanMessage("꺼져")
    ])

    console.log(`Claude response :: ${JSON.stringify(response)}`);
}

invoke();
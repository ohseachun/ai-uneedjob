import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";

dotenv.config();

const chat = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.7,
    // openAIApiKey를 명시하지 않으면 자동으로 process.env.OPENAI_API_KEY 사용
});


const invoke = async() => {

    const response: AIMessage = await chat.invoke([
        new HumanMessage("오세천 이라는 이름 이상해?")
    ])

    console.log(`ChatGPT Response : ${JSON.stringify(response)}`);
}

invoke();
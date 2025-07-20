import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
// 'dotenv/config'를 import하면 자동으로 .env 파일이 로드되어 process.env에 환경변수가 세팅됩니다.
// 기본적으로 .env 파일만 로드합니다. (경로/이름을 바꾸려면 dotenv를 직접 import해서 config({ path: ... }) 사용)
import * as dotenv from 'dotenv';
import * as fs from "fs";


// dotenv.config()를 호출하면 .env 파일의 환경변수들이 process.env 객체에 자동으로 세팅됩니다.
// 예시:
// .env 파일에 아래와 같이 작성되어 있다면
// OPENAI_API_KEY=sk-xxxx
// ANTHROPIC_API_KEY=sk-ant-xxxx
// 
// dotenv.config() 실행 후에는
// process.env.OPENAI_API_KEY, process.env.ANTHROPIC_API_KEY 등으로 접근할 수 있습니다.
dotenv.config();

// key 값을 명시적으로 입력하지 않아도 되는 이유는, dotenv.config()로 .env 파일이 로드되면
// process.env.OPENAI_API_KEY에 API 키가 자동으로 세팅되고,
// ChatOpenAI 생성자는 내부적으로 process.env에서 해당 키를 자동으로 읽어오기 때문입니다.
const gpt = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.3 });

const claude = new ChatAnthropic({ modelName: "claude-3-5-sonnet-20241022", temperature: 0.5 });

const emailContent = fs.readFileSync("src/email.txt", "utf8");

const summerizeEmail = async () => {

    const messages = [
         new HumanMessage(`다음 이메일 내용을 간단하게 요약해줘:\n\n${emailContent}`)
    ]

    const response = await gpt.call(messages);

    console.log('\n📌 이메일 요약:\n');
    console.log(response.content);

}

summerizeEmail();
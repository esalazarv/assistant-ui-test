import { Client, ThreadState } from "@langchain/langgraph-sdk";
import { LangChainMessage } from "@assistant-ui/react-langgraph";
 
const createClient = () => {
  const apiUrl = process.env["NEXT_PUBLIC_LANGGRAPH_API_URL"] || "/api";
  return new Client({
    apiUrl,
    apiKey: process.env["NEXT_PUBLIC_LANGSMITH_API_KEY"]!,
  });
};
 
export const createThread = async () => {
  const client = createClient();
  return client.threads.create();
};
 
export const getThreadState = async (
  threadId: string,
): Promise<ThreadState<{ messages: LangChainMessage[] }>> => {
  const client = createClient();
  return client.threads.getState(threadId);
};
 
export const sendMessage = async (params: {
  threadId: string;
  messages: LangChainMessage;
}) => {
  const client = createClient();
  return client.runs.stream(
    params.threadId,
    process.env["NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID"]!,
    {
      input: {
        messages: params.messages,
      },
      streamMode: "messages",
    },
  );
};
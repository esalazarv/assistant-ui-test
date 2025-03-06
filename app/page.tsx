"use client";
import { Thread } from "@/components/assistant-ui/thread";
import { useLangGraphRuntime } from "@assistant-ui/react-langgraph";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { createThread, getThreadState, sendMessage } from "@/lib/chatApi";
import { useCallback, useRef, memo } from "react";
import { LangChainMessage } from "@assistant-ui/react-langgraph";
import ModernLeftNav from "@/components/ModernLeftNav";
import ModernTopNav from "@/components/ModernTopNav";

// Main content area with Thread UI and top navigation
const MainContent = memo(() => (
  <div className="flex-1 flex flex-col">
    <ModernTopNav />
    <div className="flex-1 bg-gray-50 overflow-hidden">
      <Thread />
    </div>
  </div>
));

MainContent.displayName = 'MainContent';

export default function Home() {
  const threadIdRef = useRef<string | undefined>(undefined);
  
  const handleStream = useCallback(async (messages: LangChainMessage | LangChainMessage[]) => {
    if (!threadIdRef.current) {
      const { thread_id } = await createThread();
      threadIdRef.current = thread_id;
    }
    const threadId = threadIdRef.current;
    return sendMessage({
      threadId,
      messages: Array.isArray(messages) ? messages[0] : messages,
    });
  }, []);
  
  const handleSwitchToNewThread = useCallback(async () => {
    const { thread_id } = await createThread();
    threadIdRef.current = thread_id;
  }, []);
  
  const handleSwitchToThread = useCallback(async (threadId: string) => {
    const state = await getThreadState(threadId);
    threadIdRef.current = threadId;
    return {
      messages: state.values.messages,
      interrupts: state.tasks[0]?.interrupts,
    };
  }, []);
  
  const runtime = useLangGraphRuntime({
    threadId: threadIdRef.current,
    stream: handleStream,
    onSwitchToNewThread: handleSwitchToNewThread,
    onSwitchToThread: handleSwitchToThread,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-screen bg-white">
        {/* Modern Left Navigation */}
        <ModernLeftNav />
        {/* Main Content */}
        <MainContent />
      </div>
    </AssistantRuntimeProvider>
  );
}

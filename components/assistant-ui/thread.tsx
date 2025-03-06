import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import { FC, useState, useEffect, useRef } from "react";
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";

// Animation variants for smooth transitions
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const Thread: FC = () => {
  const [hasMessages, setHasMessages] = useState(false);
  const [hasBranches, setHasBranches] = useState(false);

  // Check if there are any messages
  useEffect(() => {
    const checkForMessages = () => {
      // Use a MutationObserver to detect when messages are added
      const messagesContainer = document.querySelector('[data-thread-messages]');
      if (messagesContainer) {
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              setHasMessages(true);
              
              // Also check if there are branch controls visible
              const branchControls = document.querySelector('[data-branch-controls]');
              if (branchControls) {
                setHasBranches(true);
              }
            }
          }
        });

        observer.observe(messagesContainer, { childList: true, subtree: true });
        return () => observer.disconnect();
      }
    };

    // Short delay to ensure DOM is ready
    setTimeout(checkForMessages, 500);
  }, []);

  return (
    <ThreadPrimitive.Root
      className="box-border h-full flex flex-col overflow-hidden"
      data-thread-messages
    >
      <ThreadPrimitive.Viewport 
        className={cn(
          "flex h-full flex-col items-center overflow-y-scroll scroll-smooth p-4 md:p-6",
          hasMessages ? "w-full" : "max-w-[650px] mx-auto"
        )}
      >
        <motion.div 
          className={cn(
            "w-full flex flex-col h-full",
            hasMessages ? "" : "items-center justify-center"
          )}
          layout
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30
          }}
        >
          {/* Welcome Screen */}
          <ThreadWelcome />

          {/* Message Thread */}
          <ThreadPrimitive.Messages
            components={{
              UserMessage: UserMessage,
              AssistantMessage: AssistantMessage,
            }}
          />

          <ThreadPrimitive.If empty={false}>
            <div className="min-h-8 flex-grow" />
          </ThreadPrimitive.If>

          {/* Input Area */}
          <motion.div 
            className={cn(
              "mt-0 flex w-full flex-col items-center justify-end",
              hasMessages ? "sticky bottom-0 mt-2" : "max-w-[600px]"
            )}
            layout
            transition={{ duration: 0.2 }}
          >
            {/* Branch Controls */}
            {hasMessages && hasBranches && (
              <motion.div 
                className="w-full flex justify-center mb-2"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <GlobalBranchPicker />
              </motion.div>
            )}
            <ThreadScrollToBottom />
            <Composer hasMessages={hasMessages} />
          </motion.div>
        </motion.div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

// Global branch picker that appears once near the composer
const GlobalBranchPicker: FC = () => {
  return (
    <div data-branch-controls>
      <BranchPicker className="mb-2" />
    </div>
  );
};

// Scroll to bottom button
const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <TooltipIconButton
          tooltip="Scroll to bottom"
          variant="outline"
          className="absolute -top-8 rounded-full disabled:invisible z-10 shadow-sm"
        >
          <ArrowDownIcon />
        </TooltipIconButton>
      </motion.div>
    </ThreadPrimitive.ScrollToBottom>
  );
};

// Welcome screen that shows when there are no messages
const ThreadWelcome: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <motion.div 
        className="flex w-full h-full flex-grow flex-col items-center justify-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Logo and welcome message */}
        <motion.div 
          className="flex w-full flex-col items-center justify-center text-center"
          variants={scaleIn}
        >
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 mb-6 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Sparkles className="text-white h-6 w-6" />
          </motion.div>
          <h2 className="text-3xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Welcome to Chat</h2>
          <p className="mt-1 font-medium text-gray-600 mb-8 max-w-md">How can I help you today?</p>
        </motion.div>
        
        {/* Suggestion cards */}
        <ThreadWelcomeSuggestions />
      </motion.div>
    </ThreadPrimitive.Empty>
  );
};

// Suggestion cards in the welcome screen
const ThreadWelcomeSuggestions: FC = () => {
  return (
    <motion.div 
      className="mt-2 flex w-full items-stretch justify-center gap-4 max-w-[700px] mb-4 px-4"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <SuggestionCard 
        prompt="What is the weather in Tokyo?"
        delay={0.2}
      />
      <SuggestionCard 
        prompt="What is assistant-ui?"
        delay={0.3}
      />
    </motion.div>
  );
};

// Individual suggestion card component
const SuggestionCard: FC<{ prompt: string; delay: number }> = ({ prompt, delay }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            delay,
            duration: 0.4, 
            ease: "easeOut" 
          }
        }
      }}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)"
      }}
      whileTap={{ scale: 0.98 }}
      className="rounded-xl overflow-hidden"
    >
      <ThreadPrimitive.Suggestion
        className="hover:bg-gray-50 flex grow basis-0 flex-col items-center justify-center rounded-xl border border-gray-200 p-4 transition-all duration-200 ease-in hover:shadow-sm bg-white"
        prompt={prompt}
        method="replace"
        autoSend
      >
        <span className="line-clamp-2 text-ellipsis text-sm font-medium">
          {prompt}
        </span>
      </ThreadPrimitive.Suggestion>
    </motion.div>
  );
};

// Chat input component
const Composer: FC<{ hasMessages: boolean }> = ({ hasMessages }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Only expand when there are messages (an active thread), not when typing
  const shouldExpand = hasMessages;
  
  // Show send button when there's text or an active thread
  const showSendButton = hasMessages || inputValue.trim().length > 0;

  // Add delayed focus handling to prevent flickering
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    // Small delay to prevent flickering when focus transitions to send button
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setIsFocused(false);
      }
    }, 100);
  };

  return (
    <motion.div 
      className="w-full"
      layout
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        mass: 0.8
      }}
    >
      <ComposerPrimitive.Root 
        className={cn(
          "flex w-full flex-wrap items-end rounded-xl border bg-white px-3 shadow-sm transition-all duration-300 ease-in-out",
          shouldExpand 
            ? "focus-within:ring-1 focus-within:ring-purple-200 border-gray-200 shadow-md" 
            : "hover:border-gray-300 border-gray-100 hover:shadow-sm",
          isFocused && !shouldExpand ? "border-gray-300" : ""
        )}
      >
        <motion.div 
          className="flex-grow"
          layout
          transition={{ duration: 0.2 }}
        >
          <ComposerPrimitive.Input
            rows={shouldExpand ? 2 : 1}
            autoFocus
            placeholder="Message..."
            className={cn(
              "placeholder:text-gray-400 w-full resize-none border-none bg-transparent px-2 py-3 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed transition-all duration-300",
              shouldExpand ? "h-10 max-h-40" : "h-8 max-h-8"
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setInputValue(e.target.value)}
            ref={inputRef}
          />
        </motion.div>
        <AnimatePresence>
          {showSendButton && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                duration: 0.2,
                ease: "easeOut" 
              }}
            >
              <ComposerAction />
            </motion.div>
          )}
        </AnimatePresence>
      </ComposerPrimitive.Root>
    </motion.div>
  );
};

// Send and cancel buttons for the composer
const ComposerAction: FC = () => {
  return (
    <>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TooltipIconButton
              tooltip="Send"
              variant="default"
              className="my-2 size-8 p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors ease-in shadow-sm"
            >
              <SendHorizontalIcon />
            </TooltipIconButton>
          </motion.div>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TooltipIconButton
              tooltip="Cancel"
              variant="default"
              className="my-2 size-8 p-1.5 bg-red-100 text-red-600 rounded-lg transition-colors ease-in"
            >
              <CircleStopIcon />
            </TooltipIconButton>
          </motion.div>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  );
};

// User message bubble component
const UserMessage: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MessagePrimitive.Root className="w-full py-3">
        <div className="flex flex-col">
          <div className="flex items-start justify-end gap-3">
            <div className="bg-purple-600 text-white rounded-xl p-3 prose prose-sm prose-invert max-w-[85%] shadow-sm">
              <MessagePrimitive.Content />
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <span className="text-purple-700 font-medium text-sm">A</span>
            </div>
          </div>
        </div>
      </MessagePrimitive.Root>
    </motion.div>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="flex flex-col items-end mr-3 mt-2"
    >
      {/* Edit icon removed as requested */}
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <ComposerPrimitive.Root className="bg-gray-50 my-4 flex w-full flex-col gap-2 rounded-xl border border-gray-200 shadow-sm">
      <ComposerPrimitive.Input className="text-gray-800 flex h-8 w-full resize-none bg-transparent p-4 pb-0 outline-none" />

      <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
        <ComposerPrimitive.Cancel asChild>
          <Button variant="ghost" className="text-gray-600">Cancel</Button>
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send asChild>
          <Button className="bg-purple-600 hover:bg-purple-700 shadow-sm">Send</Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
};

// Assistant message bubble component
const AssistantMessage: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MessagePrimitive.Root className="relative w-full py-3">
        <div className="flex flex-col">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <span className="text-indigo-700 font-medium text-sm">AI</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3 prose prose-sm max-w-[85%] shadow-sm">
              <MessagePrimitive.Content components={{ Text: MarkdownText }} />
            </div>
          </div>
          <AssistantActionBar />
        </div>
      </MessagePrimitive.Root>
    </motion.div>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="text-gray-500 flex gap-1 ml-11 data-[floating]:bg-white data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:border-gray-200 data-[floating]:p-1 data-[floating]:shadow-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <TooltipIconButton tooltip="Copy">
            <MessagePrimitive.If copied>
              <CheckIcon size={16} />
            </MessagePrimitive.If>
            <MessagePrimitive.If copied={false}>
              <CopyIcon size={16} />
            </MessagePrimitive.If>
          </TooltipIconButton>
        </motion.div>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <TooltipIconButton tooltip="Refresh">
            <RefreshCwIcon size={16} />
          </TooltipIconButton>
        </motion.div>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      className={cn("flex items-center", className)}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="icon"
            variant="outline"
            className="size-6 rounded-full p-0 border-gray-200"
          >
            <ChevronLeftIcon className="size-3" />
          </Button>
        </motion.div>
      </BranchPickerPrimitive.Previous>
      <div className="text-gray-500 mx-2 flex size-6 select-none items-center justify-center text-xs">
        <BranchPickerPrimitive.Count />
      </div>
      <BranchPickerPrimitive.Next asChild>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="icon"
            variant="outline"
            className="size-6 rounded-full p-0 border-gray-200"
          >
            <ChevronRightIcon className="size-3" />
          </Button>
        </motion.div>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

const CircleStopIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M15 9L9 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9L15 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

import Layout from "../components/Layout";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your Finity AI Coach. I'm here to help you with your financial questions and provide personalized advice based on your profile. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    "How should I start investing?",
    "Help me create a budget",
    "What's an emergency fund?",
    "Explain mutual funds",
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: Replace with actual API call
    setTimeout(() => {
      const aiResponse = {
        role: "assistant",
        content:
          "That's a great question! Based on your profile, I'd recommend starting with index funds or ETFs for diversification. Since you're a beginner, focus on understanding the basics before diving into individual stocks. Would you like me to explain more about index funds?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);

      // Award achievement for first chat
      const achievements = JSON.parse(
        localStorage.getItem("achievements") || "[]"
      );
      if (!achievements.some((a) => a.name === "First Chat")) {
        achievements.push({
          icon: "💬",
          name: "First Chat",
          description: "Asked your first question!",
          date: new Date().toISOString(),
        });
        localStorage.setItem("achievements", JSON.stringify(achievements));
      }
    }, 1500);
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <Layout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-dark-800 bg-white dark:bg-dark-900">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-600/10 rounded-xl">
              <Bot className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                AI Financial Coach
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Powered by advanced AI • Available 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-500" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-gray-100"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span
                  className={`text-xs mt-2 block ${
                    message.role === "user"
                      ? "opacity-70"
                      : "text-gray-500 dark:opacity-70"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-dark-800 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-500" />
              </div>
              <div className="bg-gray-100 dark:bg-dark-800 rounded-2xl px-4 py-3">
                <div className="flex gap-2">
                  <div
                    className="w-2 h-2 bg-gray-500 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
              <Sparkles className="w-4 h-4" />
              <span>Quick questions to get started:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="px-4 py-2 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-full text-sm text-gray-700 dark:text-gray-300 transition-all border border-gray-300 dark:border-dark-700 hover:border-primary-600 dark:hover:border-primary-600"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-gray-200 dark:border-dark-800 bg-white dark:bg-dark-900">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything about finance..."
              className="flex-1 input-field"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default ChatBot;

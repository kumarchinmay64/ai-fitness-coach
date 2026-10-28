import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { askAICoach } from '../services/aiService';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  Volume2,
  VolumeX
} from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'Hello! How can I help you with your training or nutrition today?',
    timestamp: 'Just now'
  }
];
const normalizeMarkdown = (text) => {
  if (!text) return '';

  return text
    .replace(/^(\s*)#{1,6}(\d+\.)/gm, '$1### $2')
    .replace(/\*\*\*(.*?)\*\*:/g, '**$1:**');
};
export default function ChatAssistantPage({ isDrawer = false, onClose }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStatus, setThinkingStatus] = useState('Searching fitness evidence...');
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await api.onboarding.getHealthProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to load fitness profile:', error);
      }
    };

    loadProfile();
  }, []);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isThinking) return;

    const userMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setThinkingStatus('Searching fitness evidence...');
    setIsThinking(true);

    try {
      const aiResponse = await askAICoach(query, userProfile, (status) => setThinkingStatus(status));
      const aiMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (speechEnabled && 'speechSynthesis' in window) {
        const plainText = aiResponse.replace(/[*_#]/g, '');
        const utter = new SpeechSynthesisUtterance(plainText);
        utter.rate = 1.05;
        window.speechSynthesis.speak(utter);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'msg-' + Date.now(),
        sender: 'ai',
        text: 'Chat history cleared. How can I help you elevate your lifts today?',
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div
      className={`${isDrawer ? 'h-full flex flex-col' : 'max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fadeIn'
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-electric-green flex items-center justify-center text-dark-950 shadow-md shadow-electric-green/20">
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-display">
                AI Fitness Coach Assistant
              </h2>
              <Badge variant="success" size="sm" dot>
                Online
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-2 rounded-xl border transition-colors ${speechEnabled
              ? 'bg-electric-green/10 border-electric-green text-electric-green'
              : 'bg-dark-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            title={speechEnabled ? 'Mute AI voice' : 'Enable voice narration'}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={clearChat}
            className="p-2 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>


      {/* Message Stream Area */}
      <Card
        variant="glass"
        className={`flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 ${isDrawer ? 'max-h-[calc(100vh-280px)]' : 'min-h-[440px] max-h-[580px]'
          }`}
      >
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-xl bg-electric-green/20 text-electric-green border border-electric-green/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-1 ${isAI
                  ? 'bg-dark-850/90 border border-slate-800 text-slate-200'
                  : 'bg-gradient-to-r from-emerald-600 to-electric-green text-dark-950 font-medium shadow-md shadow-electric-green/10'
                  }`}
              >
                <div
                  className={`text-xs leading-relaxed ${isAI ? 'text-slate-200' : 'text-dark-950'
                    }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-base font-bold text-white mt-2 mb-2">
                          {children}
                        </h1>
                      ),

                      h2: ({ children }) => (
                        <h2 className="text-sm font-bold text-white mt-3 mb-2">
                          {children}
                        </h2>
                      ),

                      h3: ({ children }) => (
                        <h3 className="text-sm font-bold text-electric-green mt-3 mb-1">
                          {children}
                        </h3>
                      ),

                      p: ({ children }) => (
                        <p className="mb-3 last:mb-0">
                          {children}
                        </p>
                      ),

                      strong: ({ children }) => (
                        <strong className="font-bold text-white">
                          {children}
                        </strong>
                      ),

                      ul: ({ children }) => (
                        <ul className="list-disc ml-5 mb-3 space-y-1">
                          {children}
                        </ul>
                      ),

                      ol: ({ children }) => (
                        <ol className="list-decimal ml-5 mb-3 space-y-1">
                          {children}
                        </ol>
                      ),

                      li: ({ children }) => (
                        <li className="pl-1">
                          {children}
                        </li>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
                <span
                  className={`block text-[9px] pt-1 text-right ${isAI ? 'text-slate-500' : 'text-dark-900/70'
                    }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-electric-green/20 text-electric-green border border-electric-green/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-electric-green animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-electric-green animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-electric-green animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px] font-mono text-slate-300">{thinkingStatus}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </Card>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          placeholder="Ask about squat depth, pushup elbow angles, post-workout protein..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={isThinking}
          className="flex-1 bg-dark-900 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-green focus:border-electric-green transition-all"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={Send}
          disabled={!inputQuery.trim() || isThinking}
        >
          Send
        </Button>
      </form>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Send, ChefHat, Sparkles } from 'lucide-react';
import recipeAPI from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AskAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Claudia, your AI Sous-Chef. Tell me what ingredients you have, or ask me for a recipe idea!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev: Message[]) => [...prev, { id: Date.now().toString(), role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await recipeAPI.askSousChef(userMessage, null);
      setMessages((prev: Message[]) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.answer || 'Sorry, I do not have a response.'
      }]);
    } catch (err) {
      setMessages((prev: Message[]) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while trying to help you. Are you sure I have access to the ingredients or API?'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col h-[calc(100vh-4rem)] p-4 sm:p-6 max-w-4xl mx-auto w-full'>
      <div className='bg-card border border-border rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm'>
        {/* Chat header */}
        <div className='h-16 border-b border-border flex items-center px-6 bg-muted/30'>
          <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3'>
            <ChefHat className='w-5 h-5 text-primary' />
          </div>
          <div>
            <h2 className='font-medium'>Claudia AI</h2>
            <p className='text-xs text-muted-foreground'>Powered by advanced recipe intelligence</p>
          </div>
        </div>

        {/* Messages area */}
        <div className='flex-1 overflow-y-auto p-6 space-y-6'>
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted/50 border border-border text-foreground rounded-tl-sm'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className='flex items-center gap-2 mb-2'>
                    <Sparkles className='w-4 h-4 text-primary' />
                    <span className='text-xs font-semibold text-primary'>Claudia</span>
                  </div>
                )}
                <div className='whitespace-pre-wrap leading-relaxed'>{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className='flex justify-start'>
              <div className='bg-muted/50 border border-border rounded-2xl px-5 py-4 rounded-tl-sm'>
                <div className='flex space-x-2'>
                  <div className='w-2 h-2 bg-primary/40 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                  <div className='w-2 h-2 bg-primary/60 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                  <div className='w-2 h-2 bg-primary/80 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className='p-4 border-t border-border bg-background'>
          <form onSubmit={handleSubmit} className='relative flex items-center'>
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='What ingredients do you have? e.g. "I have chicken, rice, and broccoli..."'
              className='w-full bg-muted/50 border border-border rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow'
              disabled={isLoading}
            />
            <button
              type='submit'
              disabled={!input.trim() || isLoading}
              className='absolute right-2.5 p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors'
            >
              <Send className='w-4 h-4' />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

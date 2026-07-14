import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language, t } = useLanguage();
  const messagesEndRef = useRef(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'api',
        text: language === 'ar' ? 'مرحباً! أنا ميزان الذكاء الاصطناعي. كيف يمكنني مساعدتك في تطبيقنا اليوم؟' :
              language === 'en' ? 'Hello! I am Mizan AI. How can I assist you with using our app today?' :
              'Bonjour ! Je suis Mizan IA. Comment puis-je vous aider avec l\'application aujourd\'hui ?'
      }]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Construction de l'historique complet pour un meilleur contexte de prompt
      const conversationHistory = messages.map(m => (m.role === 'user' ? 'Client: ' : 'Mizan: ') + m.text).join('\n') + `\nClient: ${userMessage}`;

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/chat`, {
        message: conversationHistory,
        lang: language
      });
      
      setMessages(prev => [...prev, { role: 'api', text: res.data.response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'api', text: 'Une erreur est survenue lors de la communication.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const isRtl = language === 'ar';

  return (
    <>
      <div className={`fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} z-50`}>
        {isOpen && (
          <div className={`absolute bottom-20 ${isRtl ? 'left-0' : 'right-0'} w-80 md:w-96 bg-surface/95 backdrop-blur-xl border border-outline-variant/30 shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-2 duration-300`} style={{ height: '500px', maxHeight: '80vh' }}>
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 bg-primary text-on-primary ${isRtl ? 'flex-row-reverse' : ''}`}>
               <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                 <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>robot_2</span>
                 <h3 className="font-serif font-bold tracking-widest text-sm uppercase">Mizan AI Assistant</h3>
               </div>
               <button onClick={toggleOpen} className="text-on-primary/70 hover:text-on-primary transition-colors cursor-pointer p-1">
                 <span className="material-symbols-outlined text-lg">close</span>
               </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative bg-[#fcf9f5]/50 dark:bg-[#1c1c1a]/50">
              {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={idx} className={`flex w-full ${isUser ? (isRtl ? 'justify-start' : 'justify-end') : (isRtl ? 'justify-end' : 'justify-start')}`}>
                    <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed rounded-2xl shadow-sm border ${
                      isUser 
                        ? 'bg-primary text-on-primary border-transparent rounded-br-sm' 
                        : 'bg-surface-container border-outline-variant/20 text-on-surface rounded-bl-sm'
                    }`} dir={isRtl ? 'rtl' : 'ltr'}>
                      {msg.text}
                    </div>
                  </div>
                )
              })}
              {isLoading && (
                <div className={`flex w-full ${isRtl ? 'justify-end' : 'justify-start'}`}>
                  <div className="px-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/20 rounded-bl-sm flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{animationDelay: '0ms'}}></span>
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay: '300ms'}}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-outline-variant/10 bg-surface flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={isRtl ? "اكتب رسالتك هنا..." : (language === 'en' ? "Type your message..." : "Écrivez votre message...")}
                className={`flex-1 bg-surface-container-low text-sm px-4 py-3 rounded-full border border-outline-variant/20 focus:outline-none focus:border-primary/50 text-on-surface transition-colors`}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 shrink-0 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary disabled:opacity-50 disabled:hover:bg-primary/10 disabled:hover:text-primary rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className={`material-symbols-outlined text-lg ${isRtl ? 'rotate-180' : ''}`} style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
              </button>
            </form>
          </div>
        )}

        {/* Toggle Button */}
        <button 
          onClick={toggleOpen}
          className={`w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-primary/20 ${isOpen ? 'rotate-90 scale-90' : ''}`}
        >
          <span className="material-symbols-outlined text-2xl transition-all duration-300" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isOpen ? 'close' : 'chat_bubble'}
          </span>
        </button>
      </div>
    </>
  );
};

export default ChatbotWidget;

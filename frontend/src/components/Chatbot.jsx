import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

const faqs = [
  "Why TalentSphere is important?",
  "How this TalentSphere works?",
  "What features do you offer?"
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am TalentSphere Assistant. How can I help you with your career or job search today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send only previous messages as history
      const history = messages.filter(msg => msg.role !== 'assistant' || msg.content !== 'Hi there! I am TalentSphere Assistant. How can I help you with your career or job search today?');
      
      const response = await axios.post(`${import.meta.env.VITE_FASTAPI_URL}/chat/`, {
        message: userMessage.content,
        history: history
      });

      const assistantMessage = { role: 'assistant', content: response.data.reply };
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Sorry, I am having trouble connecting right now. Please try again later.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
        >
          <FaRobot size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col h-[500px] overflow-hidden border border-gray-100 transition-all duration-300">
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <FaRobot size={24} />
              <h3 className="font-semibold text-lg">TalentSphere Assistant</h3>
            </div>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 custom-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-2" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold" {...props} />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-none p-3 shadow-sm flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            
            {/* FAQ Chips */}
            {messages.length === 1 && !isLoading && (
              <div className="flex flex-col mt-4">
                <p className="text-xs text-gray-500 font-medium mb-2 ml-1">Frequently Asked Questions:</p>
                <div className="flex flex-wrap gap-2">
                  {faqs.map((faq, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(faq)}
                      className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 text-xs py-2 px-3 rounded-full transition-colors text-left shadow-sm"
                    >
                      {faq}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-gray-100"
          >
            <div className="flex items-center space-x-2 bg-gray-50 rounded-full border border-gray-200 p-1 px-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm py-2 px-3 text-gray-700"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaPaperPlane size={14} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquareQuote, X, Send, Bot, Sparkles, Copy, Edit2, Check } from "lucide-react";
import { askChatbot } from "@/api/chatbotCient";

export function ClinicBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string; timestamp: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: "user", content: input, timestamp: time };
    const currentInput = input;
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await askChatbot(currentInput, messages.map(m => ({ role: m.role, content: m.content })));
      const resTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [...prev, { role: "assistant", content: res.answer, timestamp: resTime }]);

      // Auto-navigation logic if user intent is to go to a page
      if (/pergi ke|buka|arahkan|ke halaman/i.test(currentInput)) {
        const linkMatch = res.answer.match(/\[.*?\]\((.*?)\)/);
        if (linkMatch && linkMatch[1] && linkMatch[1].startsWith("/")) {
          setTimeout(() => {
            navigate(linkMatch[1]);
          }, 800); // slight delay to feel natural
        }
      }
    } catch {
      const errTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [...prev, { role: "assistant", content: "Mohon maaf, koneksi ke asisten analitik terputus.", timestamp: errTime }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleEdit = (text: string) => {
    setInput(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window (Hidden instead of unmounted) */}
      <div 
        className={`mb-4 w-[380px] sm:w-[450px] md:w-[500px] h-[600px] max-h-[80vh] bg-[#F9FEFC]/95 dark:bg-[#0B131A]/95 backdrop-blur-md shadow-2xl rounded-[24px] border border-[#DFE6EB] dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none absolute bottom-16 right-0"
        }`}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1B9C90] to-[#12796f] dark:from-[#157D73] dark:to-[#0D5750] p-5 flex justify-between items-center text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <Sparkles size={80} />
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-white/20 dark:bg-black/20 rounded-xl backdrop-blur-sm">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight leading-tight">ClinicBot</h2>
              <p className="text-xs text-teal-100 dark:text-teal-200 font-medium">Asisten Analitik Keuangan</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors relative z-10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-[#DFE6EB] dark:scrollbar-thumb-slate-700">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 mt-8">
              <div className="w-20 h-20 bg-[#1B9C90]/10 dark:bg-[#1B9C90]/20 rounded-full flex items-center justify-center">
                <Bot size={40} className="text-[#1B9C90] dark:text-[#2DD4BF]" />
              </div>
              <div className="text-[#13222D] dark:text-slate-200">
                <p className="font-semibold text-lg">Ada yang bisa dibantu?</p>
                <p className="text-sm mt-2 text-gray-500 dark:text-slate-400 max-w-[250px] mx-auto leading-relaxed">
                  Tanyakan soal omzet, laporan kasir, atau tren pasien hari ini.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} group/chat`}>
              <div
                className={`relative p-4 max-w-[90%] text-sm leading-relaxed shadow-sm flex flex-col gap-2 ${
                  msg.role === "user" 
                    ? "bg-[#1B9C90] dark:bg-[#157D73] text-white rounded-[20px] rounded-br-sm" 
                    : "bg-white dark:bg-[#13222D] border border-[#DFE6EB] dark:border-slate-700 text-[#13222D] dark:text-slate-200 rounded-[20px] rounded-bl-sm overflow-hidden"
                }`}
              >
                {msg.role === "assistant" ? (
                  <>
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#DFE6EB] dark:scrollbar-thumb-slate-700">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => (
                            <Link 
                              to={props.href!} 
                              className="inline-flex items-center gap-1 font-semibold text-[#1B9C90] dark:text-[#2DD4BF] bg-[#1B9C90]/10 dark:bg-[#2DD4BF]/10 px-2 py-0.5 rounded-md hover:bg-[#1B9C90]/20 dark:hover:bg-[#2DD4BF]/20 transition-colors no-underline my-1"
                            >
                              {props.children}
                            </Link>
                          ),
                          p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-semibold text-[#13222D] dark:text-white" {...props} />,
                          table: ({ node, ...props }) => <table className="w-full text-left border-collapse my-3 min-w-[300px] text-[13px]" {...props} />,
                          thead: ({ node, ...props }) => <thead className="bg-[#F4F7F9] dark:bg-slate-800/50 border-b border-[#DFE6EB] dark:border-slate-700" {...props} />,
                          th: ({ node, ...props }) => <th className="p-2 font-semibold text-[#13222D] dark:text-slate-200 whitespace-nowrap" {...props} />,
                          td: ({ node, ...props }) => <td className="p-2 border-b border-[#DFE6EB] dark:border-slate-700" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">{msg.timestamp}</div>
                  </>
                ) : (
                  <>
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                    <div className="flex items-end justify-between mt-1 pt-2 border-t border-white/20 gap-4">
                      <div className="text-[10px] text-white/80 whitespace-nowrap">{msg.timestamp}</div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button 
                          onClick={() => handleCopy(msg.content, i)}
                          className="flex items-center gap-1 text-[11px] text-white/90 hover:text-white transition-colors bg-white/10 dark:bg-black/10 px-2 py-1 rounded-md"
                          title="Salin"
                        >
                          {copiedIndex === i ? <Check size={12} /> : <Copy size={12} />}
                          <span>Salin</span>
                        </button>
                        <button 
                          onClick={() => handleEdit(msg.content)}
                          className="flex items-center gap-1 text-[11px] text-white/90 hover:text-white transition-colors bg-white/10 dark:bg-black/10 px-2 py-1 rounded-md"
                          title="Edit"
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-[#13222D] border border-[#DFE6EB] dark:border-slate-700 p-4 rounded-[20px] rounded-bl-sm shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-[#1B9C90]/40 dark:bg-[#2DD4BF]/40 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#1B9C90]/60 dark:bg-[#2DD4BF]/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-[#1B9C90] dark:bg-[#2DD4BF] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-[#0B131A] border-t border-[#DFE6EB] dark:border-slate-800">
          <div className="flex items-end gap-2 bg-[#F4F7F9] dark:bg-[#13222D] rounded-[20px] p-2 border border-transparent focus-within:border-[#1B9C90]/30 dark:focus-within:border-[#2DD4BF]/30 transition-all shadow-inner">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ketik pertanyaan analitik (Shift+Enter untuk baris baru)..."
              className="flex-1 bg-transparent px-4 py-2 text-[#13222D] dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none text-sm resize-none min-h-[40px] max-h-[120px] scrollbar-thin dark:scrollbar-thumb-slate-700 overflow-y-auto"
              rows={1}
              ref={(el) => {
                if (el) {
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-3 bg-[#1B9C90] dark:bg-[#157D73] text-white rounded-full hover:bg-[#12796f] dark:hover:bg-[#0D5750] disabled:opacity-50 disabled:hover:bg-[#1B9C90] dark:disabled:hover:bg-[#157D73] transition-colors shadow-md flex-shrink-0 mb-0.5"
            >
              <Send size={16} className={input.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-[#1B9C90] to-[#20b8a9] dark:from-[#157D73] dark:to-[#0D5750] text-white rounded-[20px] shadow-[0_8px_30px_rgb(27,156,144,0.3)] dark:shadow-[0_8px_30px_rgb(20,100,90,0.5)] hover:shadow-[0_8px_30px_rgb(27,156,144,0.5)] hover:-translate-y-1 transition-all duration-300 z-50 ${isOpen ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"}`}
      >
        <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity" />
        <Sparkles size={16} className="absolute top-3 right-3 text-white/70 animate-pulse" />
        <MessageSquareQuote size={28} className="group-hover:scale-110 transition-transform duration-300" />
      </button>
    </div>
  );
}

"use client";

import { Bot, Info, AlertTriangle, Lightbulb, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AiInsightDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  insightText?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const AiInsightDetailModal = ({ 
  isOpen, 
  onClose, 
  insightText,
  onRefresh,
  isLoading
}: AiInsightDetailModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl p-6 rounded-[28px] max-h-[85vh] overflow-y-auto bg-white border-none shadow-2xl animate-in fade-in-50 duration-200">
        <DialogHeader className="flex flex-row gap-4 items-start pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1B9C90] to-[#2cd5c4] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#1B9C90]/10">
            <Bot className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <DialogTitle className="text-xl font-black text-[#13222D] text-left">
              Analisis AI Insight Keuangan
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-[#67737C] text-left">
              Ringkasan performa dan rekomendasi operasional dari asisten AI berdasarkan data transaksi terkini.
            </DialogDescription>
          </div>
          {onRefresh && (
            <Button
              onClick={onRefresh}
              disabled={isLoading}
              variant="outline"
              className="rounded-full h-9 px-3.5 border border-[#DFE6EB] hover:border-[#1B9C90]/30 text-[#67737C] hover:text-[#1B9C90] font-bold text-xs transition-colors flex items-center gap-1.5 self-center bg-white cursor-pointer"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
              Refresh
            </Button>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4 min-h-[120px] flex flex-col justify-center">
          {isLoading ? (
            <div className="space-y-4 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-100 flex items-start gap-4 bg-slate-50/50">
                  <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3 rounded-md" />
                    <Skeleton className="h-3 w-5/6 rounded-md" />
                    <Skeleton className="h-3 w-2/3 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : !insightText ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-slate-400 text-center bg-slate-50/50 rounded-[24px] border border-dashed border-slate-200">
              <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100">
                <Info className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-[#67737C]">Belum ada data insight. Silakan klik tombol Refresh.</p>
            </div>
          ) : (
            <div className="p-6 md:p-8 rounded-[24px] bg-white border border-[#DFE6EB] shadow-sm text-left text-[15px] leading-[1.8] text-[#334155]">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h3: ({ node, children, ...props }) => (
                    <h3 className="text-lg font-black mt-8 mb-4 text-[#13222D] flex items-center border-b border-slate-100 pb-3" {...props}>
                      <span className="w-1.5 h-5 bg-gradient-to-b from-[#1B9C90] to-[#2cd5c4] rounded-full mr-3 inline-block shadow-sm"></span>
                      {children}
                    </h3>
                  ),
                  p: ({ node, ...props }) => <p className="mb-4 text-[#475569]" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2.5 mb-6 marker:text-[#1B9C90]" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-2.5 mb-6 marker:text-[#1B9C90] marker:font-bold" {...props} />,
                  li: ({ node, children, ...props }) => <li className="pl-1 text-[#475569]" {...props}>{children}</li>,
                  strong: ({ node, ...props }) => <strong className="font-bold text-[#0F172A] bg-[#1B9C90]/[0.08] px-1.5 py-0.5 rounded-md" {...props} />,
                  code: ({ node, className, children, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="font-mono text-[13px] bg-slate-100 text-[#1B9C90] px-1.5 py-0.5 rounded-md font-semibold" {...props}>{children}</code>
                    ) : (
                      <div className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <code className="block font-mono text-sm text-slate-700 p-4 overflow-x-auto" {...props}>{children}</code>
                      </div>
                    );
                  },
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-[#1B9C90] bg-[#1B9C90]/5 p-4 rounded-r-xl my-4 italic text-slate-600" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto w-full my-6 rounded-xl border border-[#DFE6EB] shadow-sm">
                      <table className="w-full text-left border-collapse" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => <thead className="bg-[#F4F7F9] border-b border-[#DFE6EB]" {...props} />,
                  th: ({ node, ...props }) => <th className="px-4 py-3 font-bold text-[#13222D] text-[13px] uppercase tracking-wider whitespace-nowrap" {...props} />,
                  td: ({ node, ...props }) => <td className="px-4 py-3 border-b border-slate-100 text-[14px] text-[#475569]" {...props} />,
                  tr: ({ node, ...props }) => <tr className="hover:bg-[#F9FEFC] transition-colors" {...props} />,
                }}
              >
                {insightText}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
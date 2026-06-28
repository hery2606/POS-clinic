import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#13222D]/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-xl border border-[#DFE6EB] p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center p-2">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="font-bold text-sm text-[#13222D] mb-1">Hapus Pengguna?</h3>
          <p className="text-xs text-[#67737C] leading-relaxed mb-6">
            Apakah Anda yakin ingin menghapus akun pengguna <span className="font-bold text-[#13222D]">{userName}</span>? Tindakan ini tidak dapat dibatalkan.
          </p>
          
          <div className="flex gap-2 w-full">
            <Button
              onClick={onConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold h-10 text-xs rounded-xl"
            >
              Hapus
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-2 border-[#DFE6EB] h-10 text-xs rounded-xl hover:bg-slate-50"
            >
              Batal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

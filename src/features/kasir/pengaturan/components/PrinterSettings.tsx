import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface PrinterSettings {
  name: string;
  model: string;
  status: 'connected' | 'disconnected';
}

interface PrinterSettingsProps {
  settings: PrinterSettings;
  onUpdate: (settings: PrinterSettings) => void;
}

export const PrinterSettings: React.FC<PrinterSettingsProps> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <div className="bg-[#F9FEFC] border border-[#DFE6EB] rounded-lg p-6">
      <h3 className="text-lg font-bold text-[#13222D] mb-4">Printer Terpasang</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-[#DFE6EB] rounded-lg bg-white">
          <div>
            <p className="font-semibold text-[#13222D]">{settings.name}</p>
            <p className="text-sm text-[#67737C]">{settings.model}</p>
          </div>
          <Badge className={cn(
            "rounded-full",
            settings.status === 'connected'
              ? "bg-[#DFF6F2] text-[#1B9C90]"
              : "bg-[#FFF9EB] text-[#F2A618]"
          )}>
            {settings.status === 'connected' ? '✓ Terhubung' : '⚠ Terputus'}
          </Badge>
        </div>
      </div>
      <Separator className="my-6 bg-[#DFE6EB]" />
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#13222D] mb-2">Nama Printer</label>
          <Input
            value={settings.name}
            onChange={(e) => onUpdate({ ...settings, name: e.target.value })}
            className="border-[#DFE6EB] focus-visible:ring-[#1B9C90]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#13222D] mb-2">Model Printer</label>
          <select className="w-full px-3 py-2 border border-[#DFE6EB] rounded-md text-[#13222D] focus:outline-none focus:ring-2 focus:ring-[#1B9C90]">
            <option>Thermal Printer 80mm</option>
            <option>Thermal Printer 58mm</option>
            <option>Inkjet Printer</option>
            <option>Laser Printer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#13222D] mb-2">Format Laporan Default</label>
          <select className="w-full px-3 py-2 border border-[#DFE6EB] rounded-md text-[#13222D] focus:outline-none focus:ring-2 focus:ring-[#1B9C90]">
            <option>Thermal (80mm)</option>
            <option>A4 Portrait</option>
            <option>A4 Landscape</option>
          </select>
        </div>
      </div>
    </div>

    <Button className="w-full bg-[#1B9C90] hover:bg-[#169B8A] text-white font-bold h-10 rounded-md">
      Tes Printer
    </Button>
  </div>
);

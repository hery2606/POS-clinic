import React from 'react';
import { Input } from '@/components/ui/input';

interface BillingSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  taxId: string;
  invoicePrefix: string;
  receiptFormat: 'thermal' | 'a4';
}

interface BillingSettingsProps {
  settings: BillingSettings;
  onUpdate: (settings: BillingSettings) => void;
}

export const BillingSettings: React.FC<BillingSettingsProps> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <div className="bg-[#F9FEFC] border border-[#DFE6EB] rounded-lg p-6">
      <h3 className="text-lg font-bold text-[#13222D] mb-4">Informasi Perusahaan</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#13222D] mb-2">Nama Perusahaan</label>
          <Input
            value={settings.companyName}
            onChange={(e) => onUpdate({ ...settings, companyName: e.target.value })}
            className="border-[#DFE6EB]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#13222D] mb-2">Alamat</label>
          <textarea
            value={settings.companyAddress}
            onChange={(e) => onUpdate({ ...settings, companyAddress: e.target.value })}
            className="w-full px-3 py-2 border border-[#DFE6EB] rounded-md text-[#13222D] focus:outline-none focus:ring-2 focus:ring-[#1B9C90]"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#13222D] mb-2">Nomor Telepon</label>
            <Input
              value={settings.companyPhone}
              onChange={(e) => onUpdate({ ...settings, companyPhone: e.target.value })}
              className="border-[#DFE6EB]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#13222D] mb-2">NPWP/NIK Pajak</label>
            <Input
              value={settings.taxId}
              onChange={(e) => onUpdate({ ...settings, taxId: e.target.value })}
              className="border-[#DFE6EB]"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="bg-[#F9FEFC] border border-[#DFE6EB] rounded-lg p-6">
      <h3 className="text-lg font-bold text-[#13222D] mb-4">Format Invoice</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#13222D] mb-2">Prefix Invoice</label>
          <Input
            value={settings.invoicePrefix}
            onChange={(e) => onUpdate({ ...settings, invoicePrefix: e.target.value })}
            className="border-[#DFE6EB]"
            placeholder="INV"
          />
          <p className="text-xs text-[#67737C] mt-1">Contoh: INV-230814-001</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#13222D] mb-2">Format Struk</label>
          <div className="space-y-3">
            {['thermal', 'a4'].map((format) => (
              <label key={format} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="receiptFormat"
                  value={format}
                  checked={settings.receiptFormat === format}
                  onChange={() => onUpdate({ ...settings, receiptFormat: format as 'thermal' | 'a4' })}
                  className="w-4 h-4 accent-[#1B9C90]"
                />
                <span className="font-semibold text-[#13222D] capitalize">
                  {format === 'thermal' ? 'Thermal (80mm)' : 'A4 Portrait'}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

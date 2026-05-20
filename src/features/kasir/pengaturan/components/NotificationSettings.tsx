import React from 'react';

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  lowStockAlert: boolean;
  paymentConfirmation: boolean;
}

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onUpdate: (settings: NotificationSettings) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <div className="bg-[#F9FEFC] border border-[#DFE6EB] rounded-lg p-6">
      <h3 className="text-lg font-bold text-[#13222D] mb-4">Preferensi Notifikasi</h3>
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'Email Notifikasi', description: 'Terima notifikasi melalui email' },
          { key: 'smsNotifications', label: 'SMS Notifikasi', description: 'Terima notifikasi melalui SMS' },
          { key: 'lowStockAlert', label: 'Alert Stok Rendah', description: 'Notifikasi ketika stok obat mulai menipis' },
          { key: 'paymentConfirmation', label: 'Konfirmasi Pembayaran', description: 'Notifikasi konfirmasi pembayaran transaksi' },
        ].map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between p-4 border border-[#DFE6EB] rounded-lg bg-white">
            <div>
              <p className="font-semibold text-[#13222D]">{label}</p>
              <p className="text-sm text-[#67737C]">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[key as keyof NotificationSettings] as boolean}
                onChange={(e) => onUpdate({ ...settings, [key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#DFE6EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1B9C90] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B9C90]"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

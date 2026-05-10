import React from 'react';
import { Card } from '@/components/ui/card';
import { Activity, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

/**
 * Dashboard Analitik Admin
 * Menampilkan statistik dan grafik bisnis
 */
export const AnalitikDashboard: React.FC = () => {
  const stats = [
    {
      label: 'Total Penjualan',
      value: 'Rp 125.5M',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Total Pasien',
      value: '1,234',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Transaksi Hari Ini',
      value: '42',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Pertumbuhan',
      value: '+12.5%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const recentTransactions = [
    { id: 1, patient: 'John Doe', amount: 250000, time: '10:30 AM' },
    { id: 2, patient: 'Jane Smith', amount: 150000, time: '11:15 AM' },
    { id: 3, patient: 'Budi Santoso', amount: 320000, time: '12:00 PM' },
    { id: 4, patient: 'Siti Nurhaliza', amount: 180000, time: '01:45 PM' },
    { id: 5, patient: 'Ahmad Wijaya', amount: 420000, time: '02:30 PM' },
  ];

  const performanceData = [
    { label: 'Target Penjualan', value: 85 },
    { label: 'Target Kunjungan', value: 72 },
    { label: 'Kepuasan Pasien', value: 92 },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#13222D]">Dashboard Analitik</h1>
          <p className="text-[#67737C] mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Periode: 1 - 30 Mei 2026
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#67737C] mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#13222D]">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="p-6 border-0 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-[#13222D] mb-6">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b border-[#DFE6EB] last:border-b-0 hover:bg-[#F9FEFC] px-2 rounded transition-colors">
                <div>
                  <p className="font-medium text-[#13222D]">Transaksi #{12340 + tx.id}</p>
                  <p className="text-sm text-[#67737C]">Pasien: {tx.patient}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#1B9C90]">Rp {tx.amount.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-[#67737C]">{tx.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="p-6 border-0 shadow-sm">
          <h2 className="text-lg font-bold text-[#13222D] mb-6">Performa</h2>
          <div className="space-y-6">
            {performanceData.map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-[#67737C]">{metric.label}</span>
                  <span className="font-bold text-[#13222D]">{metric.value}%</span>
                </div>
                <div className="w-full bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#1B9C90] h-2 rounded-full transition-all"
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-lg font-bold text-[#13222D] mb-4">Ringkasan Hari Ini</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-[#1B9C90] pl-4">
            <p className="text-sm text-[#67737C] mb-1">Total Transaksi</p>
            <p className="text-3xl font-bold text-[#13222D]">42</p>
            <p className="text-xs text-green-600 mt-2">↑ 8% dari kemarin</p>
          </div>
          <div className="border-l-4 border-blue-600 pl-4">
            <p className="text-sm text-[#67737C] mb-1">Total Pendapatan</p>
            <p className="text-3xl font-bold text-[#13222D]">Rp 5.2M</p>
            <p className="text-xs text-green-600 mt-2">↑ 5% dari kemarin</p>
          </div>
          <div className="border-l-4 border-purple-600 pl-4">
            <p className="text-sm text-[#67737C] mb-1">Pasien Baru</p>
            <p className="text-3xl font-bold text-[#13222D]">12</p>
            <p className="text-xs text-green-600 mt-2">↑ 3 dari kemarin</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalitikDashboard;

"use client"

import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, UserCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

// Data Dummy Komparasi Pasien
const retentionData = [
  { name: 'Lama', value: 65, color: '#1B9C90' }, // Mireco Teal
  { name: 'Baru', value: 35, color: '#DFF6F2' },  // Soft Tint Teal
]

// Data Dummy Top Spender
const topSpenders = [
  { name: 'Budi Santoso', initial: 'B', amount: 'Rp 4.2M' },
  { name: 'Siti Aminah', initial: 'S', amount: 'Rp 3.8M' },
  { name: 'Andi Wijaya', initial: 'A', amount: 'Rp 2.9M' },
]

export function PatientAnalysisDashboard() {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      
      <h2 className="text-xl font-bold text-[#13222D] px-1">
        Analisis Pasien
      </h2>

      {/* 1. TOP CARD: TOTAL PASIEN UNIK */}
      <Card className="bg-[#F0FAF8] border border-[#DFF6F2] rounded-[24px] shadow-sm overflow-hidden">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#67737C] tracking-wide block">
              Total Pasien Unik
            </span>
            <span className="text-3xl font-bold text-[#13222D] tracking-tight block">
              1,240
            </span>
          </div>
          {/* Right Icon Box */}
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-[#DFE6EB] text-[#1B9C90] shadow-sm">
            <Users className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>

      {/* 2. BOTTOM ROW GRID: RETENTION vs TOP SPENDER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-[#13222D] mb-4">
            Pasien Baru vs Lama
          </h3>
          
          <div className="flex flex-col items-center justify-center flex-1 py-4">
            <div className="relative w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={retentionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={58}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {retentionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-[#1B9C90]">65%</span>
                <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider">Lama</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1B9C90]" />
                <span className="text-xs font-bold text-[#13222D]">Lama (65%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#DFF6F2] border border-[#DFE6EB]" />
                <span className="text-xs font-bold text-[#67737C]">Baru (35%)</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-[#13222D] mb-4">
            Top Spender
          </h3>

          <div className="flex-1 flex flex-col justify-center space-y-4">
            {topSpenders.map((spender, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F9FEFC] border border-[#DFE6EB]/50 hover:border-[#1B9C90]/30 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#EFF4F8] text-[#67737C] font-bold text-sm flex items-center justify-center border border-[#DFE6EB] shrink-0 group-hover:bg-[#DFF6F2] group-hover:text-[#1B9C90] transition-colors">
                    {spender.initial}
                  </div>
                  <span className="font-bold text-[#13222D] text-sm truncate">
                    {spender.name}
                  </span>
                </div>
                <span className="font-bold text-[#13222D] text-sm pl-4 shrink-0">
                  {spender.amount}
                </span>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  )
}
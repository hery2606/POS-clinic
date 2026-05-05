import { Card, CardContent } from '@/components/ui/card'
import { Building2 } from 'lucide-react'

export function InsuranceSimulation() {
  const totalBilling = 220000
  const insuranceAmount = 150000
  const userAmount = totalBilling - insuranceAmount

  return (
    <Card className="border-0 bg-white shadow-sm">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-teal-100 p-2 rounded-lg">
            <Building2 className="h-6 w-6 text-teal-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Simulasi Penjaminan</h3>
        </div>

        {/* Total Tagihan */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <span className="text-gray-600">Total Tagihan</span>
          <span className="font-semibold text-gray-900">Rp {totalBilling.toLocaleString('id-ID')}</span>
        </div>

        {/* Ditanggung Penjamin */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-600">Ditanggung Penjamin</span>
          <span className="font-semibold text-teal-600">-Rp {insuranceAmount.toLocaleString('id-ID')}</span>
        </div>

        {/* Sisa Bayar */}
        <div className="bg-orange-50 rounded-lg p-4 flex justify-between items-center">
          <span className="font-semibold text-gray-900">Sisa Bayar (Iur Mandiri)</span>
          <span className="text-xl font-bold text-orange-500">Rp {userAmount.toLocaleString('id-ID')}</span>
        </div>
      </CardContent>
    </Card>
  )
}
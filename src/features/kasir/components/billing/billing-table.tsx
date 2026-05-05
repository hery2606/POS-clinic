import { Stethoscope, Pill } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'

const billingItems = [
  {
    id: 1,
    name: 'Konsultasi Dokter Umum',
    service: 'Jasa Medis',
    qty: 1,
    price: 150000,
    total: 150000,
    icon: 'stethoscope',
  },
  {
    id: 2,
    name: 'Amoxicillin 500mg',
    service: 'Obat-obatan',
    qty: 10,
    price: 2500,
    total: 25000,
    icon: 'pill',
  },
  {
    id: 3,
    name: 'Paracetamol 500mg',
    service: 'Obat-obatan',
    qty: 10,
    price: 1000,
    total: 10000,
    icon: 'pill',
  },
  {
    id: 4,
    name: 'Vitamin C',
    service: 'Obat-obatan',
    qty: 1,
    price: 35000,
    total: 35000,
    icon: 'pill',
  },
]

export function BillingTable() {
  const total = billingItems.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-gray-700">Item</TableHead>
            <TableHead className="text-center text-gray-700">Qty</TableHead>
            <TableHead className="text-right text-gray-700">Harga</TableHead>
            <TableHead className="text-right text-gray-700">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {billingItems.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell className="py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {item.icon === 'stethoscope' ? (
                      <Stethoscope className="h-5 w-5 text-green-600" />
                    ) : (
                      <Pill className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.service}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center py-4 text-gray-900">
                {item.qty}
              </TableCell>
              <TableCell className="text-right py-4 text-gray-900">
                Rp {item.price.toLocaleString('id-ID')}
              </TableCell>
              <TableCell className="text-right py-4 font-semibold text-gray-900">
                Rp {item.total.toLocaleString('id-ID')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-white border-t">
          <TableRow>
            <TableCell colSpan={3} className="text-right py-4">
              <span className="font-semibold text-gray-700">Total Tagihan</span>
            </TableCell>
            <TableCell className="text-right py-4">
              <span className="text-xl font-bold text-gray-900">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
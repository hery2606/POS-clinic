import { Stethoscope, Pill, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { type BillingItem } from '@/features/kasir/data/billing-items'

interface BillingTableProps {
  items?: BillingItem[]
  onRemoveItem?: (itemId: number) => void
  onUpdateQty?: (itemId: number, qty: number) => void
}

export function BillingTable({ 
  items = [],
  onRemoveItem,
  onUpdateQty
}: BillingTableProps) {
  const billingItems = items.length > 0 ? items : []
  const total = billingItems.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <Table>
        <TableHeader>
          <TableRow className="bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <TableHead className="text-slate-700 font-semibold">Item</TableHead>
            <TableHead className="text-center text-slate-700 font-semibold">Qty</TableHead>
            <TableHead className="text-right text-slate-700 font-semibold">Harga</TableHead>
            <TableHead className="text-right text-slate-700 font-semibold">Total</TableHead>
            {onRemoveItem && <TableHead className="text-center text-slate-700 font-semibold">Aksi</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {billingItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={onRemoveItem ? 5 : 4} className="py-8 text-center">
                <p className="text-slate-500 text-sm">Tidak ada item yang ditambahkan</p>
              </TableCell>
            </TableRow>
          ) : (
            billingItems.map((item, index) => (
              <TableRow 
                key={item.id}
                className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                }`}
              >
                <TableCell className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {item.icon === 'stethoscope' ? (
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Stethoscope className="h-5 w-5 text-[#29B5A8]" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Pill className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.service}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center py-4">
                  <div className="flex items-center justify-center gap-2">
                    {onUpdateQty && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0 text-xs"
                        onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))}
                      >
                        -
                      </Button>
                    )}
                    <span className="w-8 text-center font-medium text-gray-900 text-sm">
                      {item.qty}
                    </span>
                    {onUpdateQty && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0 text-xs"
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      >
                        +
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right py-4 text-gray-900 text-sm font-medium">
                  Rp {item.price.toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="text-right py-4 font-semibold text-gray-900 text-sm">
                  Rp {item.total.toLocaleString('id-ID')}
                </TableCell>
                {onRemoveItem && (
                  <TableCell className="text-center py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter className="bg-linear-to-r from-slate-50 to-slate-100 border-t border-slate-200">
          <TableRow>
            <TableCell colSpan={onRemoveItem ? 3 : 2} className="text-right py-4">
              <span className="font-semibold text-gray-700">Total Tagihan</span>
            </TableCell>
            <TableCell className="text-right py-4">
              <span className="text-lg font-bold text-[#29B5A8]">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </TableCell>
            {onRemoveItem && <TableCell></TableCell>}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
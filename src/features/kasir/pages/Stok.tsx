import { StockInventoryTable } from '@/features/kasir/components/StokObat/StockInventoryTable'
import { StockStatistics } from '@/features/kasir/components/StokObat/StockStatistics'

export const Stok = () => {
  try {
    return (
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <section>
          <StockStatistics />
          <StockInventoryTable />
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error in Stok:', error)
    return (
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
        <section>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900">Stok Obat</h1>
            <p className="text-sm text-slate-500">Daftar stok obat di apotek</p>
          </div>
        </section>
        <div className="bg-red-50 border border-red-200 rounded-[24px] p-6">
          <p className="text-red-700 font-semibold">Error loading stock data</p>
          <p className="text-red-600 text-sm mt-2">{String(error)}</p>
        </div>
      </div>
    )
  }
}

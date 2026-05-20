import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Calendar, Phone, Stethoscope, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PatientCardProps {
  initials?: string
  name?: string
  phone?: string
  insurance?: string
  registrationNo?: string
  age?: number
}

export function PatientCard({ 
  initials = 'BS', 
  name = 'Budi Santoso', 
  phone = '+62 812-3456-7890',
  insurance = 'BPJS Kesehatan',
  registrationNo = 'RM-001',
  age = 45
}: PatientCardProps) {
  // Determine badge styling based on insurance type
  const isBPJS = insurance.toLowerCase().includes('bpjs');
  const badgeColor = isBPJS 
    ? 'bg-blue-100 text-blue-700 border border-blue-200'
    : 'bg-emerald-100 text-emerald-700 border border-emerald-200';

  return (
    <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-slate-50/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 flex-1">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#29B5A8] to-emerald-600 flex items-center justify-center font-medium text-white text-lg shadow-md flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-base">{name}</h3>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Stethoscope className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">{registrationNo}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{age} tahun</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{phone}</span>
                </div>
              </div>
            </div>
          </div>
          <Badge className={cn(
            "flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 text-xs font-bold",
            badgeColor
          )}>
            <Shield className="h-3.5 w-3.5" />
            {isBPJS ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                <span>BPJS</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3" />
                <span>Pribadi</span>
              </>
            )}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

interface PatientCardProps {
  initials?: string
  name?: string
  phone?: string
  insurance?: string
}

export function PatientCard({ 
  initials = 'BS', 
  name = 'Budi Santoso', 
  phone = '+62 812-3456-7890',
  insurance = 'BPJS Kesehatan'
}: PatientCardProps) {
  return (
    <Card className="border-1">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center font-bold text-green-700 text-sm">
              {initials}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-500">{phone}</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {insurance}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

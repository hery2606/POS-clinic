import React, { createContext, useContext, useState } from 'react'

export type RightPanelContentType = 'payment' | 'transaction-detail' | 'patient-detail' | 'notification' | 'stock-detail' | null

export interface RightPanelContextType {
  contentType: RightPanelContentType
  data: Record<string, any>
  setContent: (contentType: RightPanelContentType, data?: Record<string, any>) => void
  clearContent: () => void
}

const RightPanelContext = createContext<RightPanelContextType | undefined>(undefined)

export function RightPanelProvider({ children }: { children: React.ReactNode }) {
  const [contentType, setContentType] = useState<RightPanelContentType>('payment')
  const [data, setData] = useState<Record<string, any>>({})

  const setContent = (newContentType: RightPanelContentType, newData?: Record<string, any>) => {
    setContentType(newContentType)
    if (newData) {
      setData(newData)
    }
  }

  const clearContent = () => {
    setContentType(null)
    setData({})
  }

  return (
    <RightPanelContext.Provider value={{ contentType, data, setContent, clearContent }}>
      {children}
    </RightPanelContext.Provider>
  )
}

export function useRightPanel() {
  const context = useContext(RightPanelContext)
  if (!context) {
    throw new Error('useRightPanel must be used within RightPanelProvider')
  }
  return context
}


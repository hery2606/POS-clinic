import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogOutIcon } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleConfirmLogout = () => {
    logout()
    setShowLogoutDialog(false)
    navigate("/login")
  }

  const handleCancelLogout = () => {
    setShowLogoutDialog(false)
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-3 px-3 py-3">
            <Avatar className="h-10 w-10 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg bg-[#1B9C90] text-white font-semibold">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-sm text-white">{user.name}</span>
              <span className="truncate text-xs text-[#8B96A3]">{user.email}</span>
            </div>
          </div>
          <SidebarMenuButton 
            onClick={handleLogoutClick}
            className="w-full mt-2 mx-0 h-9 px-3 text-[#FF6B6B] hover:text-white hover:bg-[#FF6B6B]/20 transition-colors duration-200"
          >
            <LogOutIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="border border-[#DFE6EB] bg-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#13222D] text-lg font-bold">
              Konfirmasi Logout
            </DialogTitle>
            <DialogDescription className="text-[#67737C] font-medium mt-2">
              Apakah Anda yakin ingin keluar dari sistem?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-6">
            <Button 
              variant="outline"
              onClick={handleCancelLogout}
              className="bg-[#EFF4F8] text-[#13222D] border-[#DFE6EB] hover:bg-[#DFE6EB] font-semibold"
            >
              Batal
            </Button>
            <Button 
              onClick={handleConfirmLogout}
              className="bg-[#FF6B6B] text-white hover:bg-[#E53E3E] font-semibold"
            >
              Ya, Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

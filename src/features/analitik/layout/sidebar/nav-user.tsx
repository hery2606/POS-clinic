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

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
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
          onClick={handleLogout}
          className="w-full mt-2 mx-0 h-9 px-3 text-[#FF6B6B] hover:text-white hover:bg-[#FF6B6B]/20 transition-colors duration-200"
        >
          <LogOutIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Logout</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

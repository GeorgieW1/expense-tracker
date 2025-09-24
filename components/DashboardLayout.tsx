"use client"

import type React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User, Settings, Home, Receipt, BarChart3, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as Popover from "@radix-ui/react-popover"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { currentUser, logout } = useAuth()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  const userInitials = currentUser?.email?.charAt(0).toUpperCase() || "U"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">GeoLedger</h1>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center space-x-4 ml-8">
                <Link href="/dashboard">
                  <Button
                    variant={pathname === "/dashboard" ? "default" : "ghost"}
                    size="sm"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>

                <Link href="/transactions">
                  <Button
                    variant={pathname === "/transactions" ? "default" : "ghost"}
                    size="sm"
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    Transactions
                  </Button>
                </Link>

                <Link href="/analytics">
                  <Button
                    variant={pathname === "/analytics" ? "default" : "ghost"}
                    size="sm"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
              </nav>

              {/* Mobile Hamburger */}
              <div className="md:hidden">
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </Popover.Trigger>

                  <Popover.Content
                    align="start"
                    side="bottom"
                    sideOffset={8}
                    className="w-48 rounded-lg border bg-card p-2 shadow-md z-50"
                  >
                    <Link href="/dashboard">
                      <button
                        className={`flex items-center w-full px-2 py-1.5 rounded hover:bg-muted ${
                          pathname === "/dashboard" ? "bg-muted font-medium" : ""
                        }`}
                      >
                        <Home className="mr-2 h-4 w-4" /> Dashboard
                      </button>
                    </Link>

                    <Link href="/transactions">
                      <button
                        className={`flex items-center w-full px-2 py-1.5 rounded hover:bg-muted ${
                          pathname === "/transactions" ? "bg-muted font-medium" : ""
                        }`}
                      >
                        <Receipt className="mr-2 h-4 w-4" /> Transactions
                      </button>
                    </Link>

                    <Link href="/analytics">
                      <button
                        className={`flex items-center w-full px-2 py-1.5 rounded hover:bg-muted ${
                          pathname === "/analytics" ? "bg-muted font-medium" : ""
                        }`}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" /> Analytics
                      </button>
                    </Link>
                  </Popover.Content>
                </Popover.Root>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Welcome back, {currentUser?.email?.split("@")[0]}
              </span>

              {/* Profile Popover */}
              <Popover.Root>
                <Popover.Trigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </Popover.Trigger>

                <Popover.Content
                  align="end"
                  side="bottom"
                  sideOffset={8}
                  className="w-56 rounded-lg border bg-card p-2 shadow-md z-50"
                >
                  <div className="px-2 pb-2 border-b mb-2">
                    <p className="text-sm font-medium leading-none">Account</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentUser?.email}
                    </p>
                  </div>

                  <button className="flex items-center w-full px-2 py-1.5 rounded hover:bg-muted">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </button>

                  <button className="flex items-center w-full px-2 py-1.5 rounded hover:bg-muted">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-2 py-1.5 rounded hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </button>
                </Popover.Content>
              </Popover.Root>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useTransactions } from "@/contexts/TransactionContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff } from "lucide-react"

export default function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false)
  const { currentUser } = useAuth()
  const { transactions, loading } = useTransactions()

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Eye className="h-4 w-4" />
          Debug
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-80">
      <Card className="bg-background/95 backdrop-blur-sm border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Debug Panel</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="h-6 w-6 p-0">
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-xs">Troubleshooting information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div>
            <div className="font-medium mb-1">Authentication Status</div>
            <Badge variant={currentUser ? "default" : "destructive"}>
              {currentUser ? "Authenticated" : "Not Authenticated"}
            </Badge>
            {currentUser && <div className="mt-1 text-muted-foreground">User ID: {currentUser.uid.slice(0, 8)}...</div>}
          </div>

          <div>
            <div className="font-medium mb-1">Transactions</div>
            <div className="space-y-1">
              <div>Count: {transactions.length}</div>
              <div>Loading: {loading ? "Yes" : "No"}</div>
              {transactions.length > 0 && (
                <div className="text-muted-foreground">Latest: {transactions[0]?.description}</div>
              )}
            </div>
          </div>

          <div>
            <div className="font-medium mb-1">Firebase Config</div>
            <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "default" : "destructive"}>
              {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Configured" : "Missing"}
            </Badge>
          </div>

          {!currentUser && (
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-yellow-800 dark:text-yellow-200">
              ⚠️ Please log in to add transactions
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

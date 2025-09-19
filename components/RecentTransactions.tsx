"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useTransactions } from "@/contexts/TransactionContext"
import TransactionSkeleton from "./TransactionSkeleton"

export default function RecentTransactions() {
  const { transactions, deleteTransaction, loading } = useTransactions()

  // Show only the 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5)

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id)
    } catch (error) {
      console.error("Failed to delete transaction:", error)
    }
  }

  if (loading && transactions.length === 0) {
    return <TransactionSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{transaction.description}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {transaction.amount > 0 ? "+" : ""}₦{Math.abs(transaction.amount).toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {transaction.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && recentTransactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions yet</p>
            <p className="text-sm">Add your first transaction to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

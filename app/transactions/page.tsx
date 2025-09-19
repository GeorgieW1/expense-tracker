"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import DashboardLayout from "@/components/DashboardLayout"
import { useTransactions } from "@/contexts/TransactionContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, Search } from "lucide-react"
import { useState, useMemo } from "react"
import AddTransactionForm from "@/components/AddTransactionForm"

export default function TransactionsPage() {
  const { transactions, deleteTransaction, loading } = useTransactions()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = Array.from(new Set(transactions.map((t) => t.category)))
    return cats.sort()
  }, [transactions])

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction) => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter
      return matchesSearch && matchesCategory
    })

    // Sort transactions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "amount":
          return Math.abs(b.amount) - Math.abs(a.amount)
        case "description":
          return a.description.localeCompare(b.description)
        default:
          return 0
      }
    })

    return filtered
  }, [transactions, searchTerm, categoryFilter, sortBy])

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id)
    } catch (error) {
      console.error("Failed to delete transaction:", error)
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">All Transactions</h1>
            <AddTransactionForm />
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date (Newest First)</SelectItem>
                      <SelectItem value="amount">Amount (Highest First)</SelectItem>
                      <SelectItem value="description">Description (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {loading && transactions.length === 0 ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  `Transactions (${filteredTransactions.length} of ${transactions.length})`
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && transactions.length === 0 ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-5 w-40" />
                          <div className="flex items-center space-x-3">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-8 w-8 rounded" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{transaction.description}</h4>
                          <div className="flex items-center space-x-3">
                            <span
                              className={`font-bold text-lg ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                            >
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
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{transaction.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString("en-NG", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredTransactions.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg">No transactions found</p>
                  <p className="text-sm">
                    {searchTerm || categoryFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Add your first transaction to get started"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

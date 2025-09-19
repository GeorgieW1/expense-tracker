"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import DashboardLayout from "@/components/DashboardLayout"
import ExpenseCategoryChart from "@/components/ExpenseCategoryChart"
import MonthlyOverviewChart from "@/components/MonthlyOverviewChart"
import { useTransactions } from "@/contexts/TransactionContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, PieChart, BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  const { transactions, totalBalance, totalIncome, totalExpenses } = useTransactions()

  // Calculate additional analytics
  const avgDailySpending = totalExpenses / 30
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  // Most expensive category
  const expensesByCategory = transactions
    .filter((t) => t.amount < 0)
    .reduce(
      (acc, transaction) => {
        const category = transaction.category
        const amount = Math.abs(transaction.amount)
        acc[category] = (acc[category] || 0) + amount
        return acc
      },
      {} as Record<string, number>,
    )

  const topCategory = Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a)[0]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          </div>

          {/* Key Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Daily Spending</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(avgDailySpending)}</div>
                <p className="text-xs text-muted-foreground">Last 30 days average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {savingsRate > 20 ? "Excellent!" : savingsRate > 10 ? "Good" : "Needs improvement"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{topCategory?.[0] || "N/A"}</div>
                <p className="text-xs text-muted-foreground">
                  {topCategory ? formatCurrency(topCategory[1]) : "No expenses yet"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{transactions.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            <ExpenseCategoryChart />
            <MonthlyOverviewChart />
          </div>

          {/* Additional Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Insights</CardTitle>
              <CardDescription>Smart insights based on your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savingsRate < 0 && totalIncome > 0 && (
                  <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20">
                    <h4 className="font-medium text-red-800 dark:text-red-200">🚨 Critical Alert</h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      You're spending more than you earn. Your expenses exceed income by{" "}
                      {formatCurrency(Math.abs(totalBalance))}. Immediate budget review needed.
                    </p>
                  </div>
                )}

                {savingsRate >= 0 && savingsRate < 10 && totalIncome > 0 && (
                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">💡 Improvement Needed</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Low savings rate of {savingsRate.toFixed(1)}%. Try to reduce spending in{" "}
                      {topCategory?.[0] || "your top categories"}
                      to improve your financial health.
                    </p>
                  </div>
                )}

                {savingsRate >= 10 && savingsRate < 20 && (
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">👍 Good Progress</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Decent savings rate of {savingsRate.toFixed(1)}%. You're on the right track! Consider increasing
                      to 20% for optimal financial security.
                    </p>
                  </div>
                )}

                {savingsRate >= 20 && (
                  <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                    <h4 className="font-medium text-green-800 dark:text-green-200">🎉 Excellent!</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Outstanding savings rate of {savingsRate.toFixed(1)}%! You're building strong financial security.
                      Keep up the great work!
                    </p>
                  </div>
                )}

                {transactions.length === 0 && (
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">📊 Get Started</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Add your first transaction to start seeing personalized insights and analytics.
                    </p>
                  </div>
                )}

                {totalIncome === 0 && transactions.length > 0 && (
                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
                    <h4 className="font-medium text-orange-800 dark:text-orange-200">📈 Add Income</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      You've recorded expenses but no income yet. Add your income transactions to get accurate financial
                      insights.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

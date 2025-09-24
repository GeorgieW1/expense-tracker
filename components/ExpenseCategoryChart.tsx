"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactions } from "@/contexts/TransactionContext"
import { formatCurrency } from "@/lib/utils"

const CATEGORY_COLORS = {
  Food: "#FF6B6B", // Red
  Transportation: "#4ECDC4", // Teal
  Shopping: "#45B7D1", // Light Blue
  Bills: "#96CEB4", // Green
  Entertainment: "#FFEAA7", // Yellow
  Healthcare: "#DDA0DD", // Plum
  Education: "#98D8C8", // Mint
  Other: "#F39C12", // Orange
  Groceries: "#BB8FCE", // Purple
  Rent: "#85C1E9", // Sky Blue
  Income: "#2ECC71", // Emerald (shouldn't appear in expenses but just in case)
}

export default function ExpenseCategoryChart() {
  const { transactions } = useTransactions()

  // Filter only expenses (negative amounts) and group by category
  const expensesByCategory = transactions
    .filter((t) => t.amount < 0)
    .reduce(
      (acc, transaction) => {
        const category = transaction.category
        const amount = Math.abs(transaction.amount)

        if (acc[category]) {
          acc[category] += amount
        } else {
          acc[category] = amount
        }

        return acc
      },
      {} as Record<string, number>,
    )

  // Convert to chart data format
  const chartData = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      name: category, // Changed from 'category' to 'name' for Recharts compatibility
      value: amount, // Changed from 'amount' to 'value' for Recharts compatibility
      percentage: 0,
      fill: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || "#8884d8", // Use 'fill' property for Recharts
    }))
    .sort((a, b) => b.value - a.value)

  // Calculate percentages
  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0)
  chartData.forEach((item) => {
    item.percentage = totalExpenses > 0 ? (item.value / totalExpenses) * 100 : 0
  })

  if (chartData.length === 0) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
          <CardDescription>Breakdown of your spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            No expense data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-background p-3 shadow-lg">
          <div className="space-y-1">
            <p className="font-medium">{data.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(data.value)} ({data.percentage.toFixed(1)}%)
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
        <CardDescription>Breakdown of your spending by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percentage }) =>
                    percentage > 8
                      ? `${name}\n${percentage.toFixed(1)}%`
                      : percentage > 5
                        ? `${percentage.toFixed(1)}%`
                        : ""
                  }
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <CustomTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Category Breakdown</h4>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: item.fill }} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{formatCurrency(item.value)}</div>
                    <div className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
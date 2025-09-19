"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useTransactions } from "@/contexts/TransactionContext"
import { formatCurrency } from "@/lib/utils"
import { format, subDays } from "date-fns"

export default function SpendingTrendsChart() {
  const { transactions } = useTransactions()

  // Get last 30 days of data
  const thirtyDaysAgo = subDays(new Date(), 30)

  // Create daily spending data for the last 30 days
  const dailyData = []
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const dateStr = format(date, "yyyy-MM-dd")

    // Calculate daily totals
    const dayTransactions = transactions.filter((t) => {
      const transactionDate = format(new Date(t.date), "yyyy-MM-dd")
      return transactionDate === dateStr
    })

    const dailyIncome = dayTransactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)

    const dailyExpenses = Math.abs(dayTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))

    const dailyNet = dailyIncome - dailyExpenses

    dailyData.push({
      date: dateStr,
      displayDate: format(date, "MMM dd"),
      income: dailyIncome,
      expenses: dailyExpenses,
      net: dailyNet,
    })
  }

  // Calculate running balance
  let runningBalance = 0
  const chartData = dailyData.map((day) => {
    runningBalance += day.net
    return {
      ...day,
      balance: runningBalance,
    }
  })

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Trends</CardTitle>
          <CardDescription>Your financial trends over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No transaction data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Trends</CardTitle>
        <CardDescription>Your financial trends over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            balance: {
              label: "Balance",
              color: "hsl(var(--chart-1))",
            },
            income: {
              label: "Income",
              color: "hsl(var(--chart-2))",
            },
            expenses: {
              label: "Expenses",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value)} />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-sm">
                        <div className="mb-2 font-medium">{label}</div>
                        <div className="grid gap-2">
                          {payload.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-sm text-muted-foreground">{entry.name}:</span>
                              <span className="font-medium">{formatCurrency(entry.value as number)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="var(--color-balance)"
                strokeWidth={2}
                name="Running Balance"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="var(--color-income)"
                strokeWidth={2}
                name="Daily Income"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="var(--color-expenses)"
                strokeWidth={2}
                name="Daily Expenses"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

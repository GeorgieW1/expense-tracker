"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useTransactions } from "@/contexts/TransactionContext"
import { formatCurrency } from "@/lib/utils"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subMonths,
} from "date-fns"

export default function MonthlyOverviewChart() {
  const { transactions } = useTransactions()

  // Get last 6 months
  const sixMonthsAgo = subMonths(new Date(), 5)
  const months = eachMonthOfInterval({
    start: sixMonthsAgo,
    end: new Date(),
  })

  // Calculate monthly data
  const monthlyData = months.map((month) => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)

    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      return transactionDate >= monthStart && transactionDate <= monthEnd
    })

    const income = monthTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = Math.abs(
      monthTransactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0),
    )

    return {
      month: format(month, "MMM yyyy"),
      income,
      expenses,
      net: income - expenses,
    }
  })

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
          <CardDescription>
            Income vs Expenses over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            No transaction data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>
          Income vs Expenses over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Scrollable container to prevent overflow */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[500px] h-[250px]">
            <ChartContainer
              config={{
                income: { label: "Income", color: "#22C55E" },
                expenses: { label: "Expenses", color: "#EF4444" },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-3 shadow-sm">
                            <div className="mb-2 font-medium">{label}</div>
                            <div className="grid gap-2">
                              {payload.map((entry, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    {entry.name}:
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(entry.value as number)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey="income"
                    fill="var(--color-income)"
                    name="Income"
                  />
                  <Bar
                    dataKey="expenses"
                    fill="var(--color-expenses)"
                    name="Expenses"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

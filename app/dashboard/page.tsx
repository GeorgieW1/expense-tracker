"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import DashboardLayout from "@/components/DashboardLayout"
import DashboardStats from "@/components/DashboardStats"
import RecentTransactions from "@/components/RecentTransactions"
import AddTransactionForm from "@/components/AddTransactionForm"
import DebugPanel from "@/components/DebugPanel"
import ExpenseCategoryChart from "@/components/ExpenseCategoryChart"
import MonthlyOverviewChart from "@/components/MonthlyOverviewChart"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <AddTransactionForm />
          </div>

          <DashboardStats />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ExpenseCategoryChart />
            <MonthlyOverviewChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentTransactions />
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">How Balance Works</h2>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg bg-card">
                  <h3 className="font-medium text-card-foreground mb-2">💰 Income (Positive Numbers)</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter positive amounts for money you receive (salary, freelance, gifts, etc.)
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <h3 className="font-medium text-card-foreground mb-2">💸 Expenses (Negative Numbers)</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter negative amounts for money you spend (groceries, bills, entertainment, etc.)
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <h3 className="font-medium text-card-foreground mb-2">📊 Balance Calculation</h3>
                  <p className="text-sm text-muted-foreground">
                    Your balance = Total Income - Total Expenses. No initial balance needed!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DebugPanel />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

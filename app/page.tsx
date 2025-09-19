"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  const { currentUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard")
    }
  }, [currentUser, router])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">GeoLedger</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take control of your finances. Track income, monitor expenses, and see your financial progress at a glance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Track Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Easily log your daily expenses and categorize them for better insights.</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monitor Income</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Keep track of all your income sources and see your earning patterns.</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">View Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get a clear overview of your financial health with real-time balance updates.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-x-4">
          <Button asChild size="lg">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

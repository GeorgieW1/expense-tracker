"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface Transaction {
  id: string
  userId: string
  description: string
  amount: number
  category: string
  date: string
  createdAt: string | Timestamp
}

interface TransactionContextType {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id" | "userId" | "createdAt">) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>
  loading: boolean
  totalBalance: number
  totalIncome: number
  totalExpenses: number
}

const TransactionContext = createContext<TransactionContextType>({} as TransactionContextType)

export function useTransactions() {
  return useContext(TransactionContext)
}

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      console.log("[v0] No current user, clearing transactions")
      setTransactions([])
      return
    }

    console.log("[v0] Setting up transaction listener for user:", currentUser.uid)
    setLoading(true)

    const q = query(collection(db, "transactions"), where("userId", "==", currentUser.uid))

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        console.log("[v0] Received transaction snapshot, docs:", querySnapshot.size)
        const transactionData: Transaction[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          console.log("[v0] Processing transaction doc:", doc.id, data)
          transactionData.push({
            id: doc.id,
            userId: data.userId,
            description: data.description,
            amount: data.amount,
            category: data.category,
            date: data.date,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          })
        })

        transactionData.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA // Most recent first
        })

        console.log("[v0] Setting transactions:", transactionData.length)
        setTransactions(transactionData)
        setLoading(false)
      },
      (error) => {
        console.error("[v0] Error fetching transactions:", error)
        setLoading(false)
      },
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [currentUser])

  const addTransaction = async (transactionData: Omit<Transaction, "id" | "userId" | "createdAt">) => {
    if (!currentUser) {
      console.error("[v0] Cannot add transaction: no current user")
      return
    }

    console.log("[v0] Adding transaction:", transactionData)
    setLoading(true)
    try {
      const docRef = await addDoc(collection(db, "transactions"), {
        ...transactionData,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      })
      console.log("[v0] Transaction added successfully with ID:", docRef.id)
      // Note: The onSnapshot listener will automatically update the local state
    } catch (error) {
      console.error("[v0] Error adding transaction:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteTransaction = async (id: string) => {
    setLoading(true)
    try {
      await deleteDoc(doc(db, "transactions", id))
      // Note: The onSnapshot listener will automatically update the local state
    } catch (error) {
      console.error("Error deleting transaction:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    setLoading(true)
    try {
      const { id: _, userId: __, createdAt: ___, ...updateData } = updates as any
      await updateDoc(doc(db, "transactions", id), updateData)
      // Note: The onSnapshot listener will automatically update the local state
    } catch (error) {
      console.error("Error updating transaction:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals
  const totalIncome = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = Math.abs(transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
  const totalBalance = totalIncome - totalExpenses

  const value = {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    loading,
    totalBalance,
    totalIncome,
    totalExpenses,
  }

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
}

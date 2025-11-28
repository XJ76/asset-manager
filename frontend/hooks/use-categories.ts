"use client"

import { useState, useCallback } from "react"
import type { Category } from "@/types"
import type { CategoryFormData } from "@/types/forms"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    // TODO: Replace with actual API call
    setIsLoading(false)
  }, [])

  const createCategory = useCallback(async (data: CategoryFormData) => {
    // TODO: Replace with actual API call
    const newCategory: Category = { id: crypto.randomUUID(), ...data }
    setCategories((prev) => [...prev, newCategory])
    return newCategory
  }, [])

  return { categories, isLoading, fetchCategories, createCategory, setCategories }
}

"use client"

import { useEffect } from "react"
import { useCategoriesStore } from "@/stores/categories-store"

export function useCategories() {
  const { categories, isLoading, error, fetchCategories, createCategory, deleteCategory } = useCategoriesStore()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, isLoading, error, fetchCategories, createCategory, deleteCategory }
}

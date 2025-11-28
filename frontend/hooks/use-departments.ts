"use client"

import { useEffect } from "react"
import { useDepartmentsStore } from "@/stores/departments-store"

export function useDepartments() {
  const { departments, isLoading, error, fetchDepartments, createDepartment, updateDepartment, deleteDepartment } = useDepartmentsStore()

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  return { departments, isLoading, error, fetchDepartments, createDepartment, updateDepartment, deleteDepartment }
}

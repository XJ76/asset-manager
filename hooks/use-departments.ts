"use client"

import { useState, useCallback } from "react"
import type { Department } from "@/types"
import type { DepartmentFormData } from "@/types/forms"

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true)
    // TODO: Replace with actual API call
    setIsLoading(false)
  }, [])

  const createDepartment = useCallback(async (data: DepartmentFormData) => {
    // TODO: Replace with actual API call
    const newDept: Department = { id: crypto.randomUUID(), ...data }
    setDepartments((prev) => [...prev, newDept])
    return newDept
  }, [])

  return { departments, isLoading, fetchDepartments, createDepartment, setDepartments }
}

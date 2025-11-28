export interface AssetFormData {
  name: string
  categoryId: string
  departmentId: string
  datePurchased: string
  cost: number
}

export interface UserFormData {
  name: string
  email: string
  password: string
  role: "admin" | "user"
}

export interface CategoryFormData {
  name: string
  description?: string
}

export interface DepartmentFormData {
  name: string
  description?: string
}

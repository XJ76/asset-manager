"use client"

import { useEffect } from "react"
import { useAssetsStore } from "@/stores/assets-store"

export function useAssets(userId?: string) {
  const { assets, isLoading, error, fetchAssets, createAsset, deleteAsset } = useAssetsStore()

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  return { assets, isLoading, error, fetchAssets, createAsset, deleteAsset }
}

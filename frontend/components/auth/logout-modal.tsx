"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LogOutIcon } from "@/components/icons"

interface LogoutModalProps {
  onLogout: () => void
  trigger: React.ReactNode
}

export function LogoutModal({ onLogout, trigger }: LogoutModalProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onLogout()
    setOpen(false)
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <LogOutIcon className="w-6 h-6 text-primary" />
            </div>
            <AlertDialogTitle className="text-center">Sign Out</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to sign out? You'll need to log in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-3">
            <AlertDialogCancel onClick={() => setOpen(false)} className="px-6">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="gradient-primary hover:opacity-90 px-6"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}


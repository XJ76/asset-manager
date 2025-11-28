"use client"

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
import { TrashIcon } from "@/components/icons"

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  variant?: "default" | "destructive"
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  variant = "default",
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive"

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          {isDestructive && (
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <TrashIcon className="w-6 h-6 text-destructive" />
            </div>
          )}
          <AlertDialogTitle className={isDestructive ? "text-center" : ""}>{title}</AlertDialogTitle>
          <AlertDialogDescription className={isDestructive ? "text-center" : ""}>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={isDestructive ? "sm:justify-center gap-3" : ""}>
          <AlertDialogCancel onClick={onClose} className="px-6">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              isDestructive ? "bg-destructive hover:bg-destructive/90 px-6" : "gradient-primary hover:opacity-90 px-6"
            }
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

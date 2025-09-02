import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export function generateInvoiceNumber() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `INV-${timestamp}-${random}`
}
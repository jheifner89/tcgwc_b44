import { useState } from 'react'

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState({
    title: '',
    description: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'default',
    onConfirm: () => {},
    onCancel: () => {}
  })

  const confirm = ({
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    onConfirm = () => {},
    onCancel = () => {}
  }) => {
    setConfig({
      title,
      description,
      confirmText,
      cancelText,
      variant,
      onConfirm,
      onCancel
    })
    setIsOpen(true)
  }

  const handleConfirm = () => {
    config.onConfirm()
    setIsOpen(false)
  }

  const handleCancel = () => {
    config.onCancel()
    setIsOpen(false)
  }

  return {
    isOpen,
    config,
    confirm,
    handleConfirm,
    handleCancel,
    setIsOpen
  }
}
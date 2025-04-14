import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, XCircle, AlertTriangle, LucideIcon } from 'lucide-react'
import React from 'react'

interface ConfirmDialogProps
{
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    icon?: LucideIcon
    cancelText?: string
    confirmText?: string
    onConfirm: () => Promise<{ success: boolean; message?: string }>
    danger?: boolean
}

export const ConfirmDialog = ({
    isOpen,
    onClose,
    title,
    description = 'Вы уверены, что хотите выполнить это действие?',
    icon: Icon = AlertTriangle,
    cancelText = 'Отмена',
    confirmText = 'Подтвердить',
    onConfirm,
    danger = false,
}: ConfirmDialogProps) =>
{
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleConfirm = async () =>
    {
        setIsLoading(true)
        setError('')

        try
        {
            const response = await onConfirm()
            if (response.success)
            {
                setSuccess(true)
                setTimeout(() =>
                {
                    setSuccess(false)
                    setIsLoading(false)
                    onClose()
                }, 1500)
            } else
            {
                setError(response.message || 'Произошла ошибка')
                setIsLoading(false)
            }
        } catch (err)
        {
            console.error(err)
            setError('Ошибка соединения')
            setIsLoading(false)
        }
    }

    useEffect(() =>
    {
        if (!isOpen)
        {
            setError('')
            setSuccess(false)
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl"
                    >
                        {success ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center justify-center gap-4 text-center py-8"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 0.7 }}
                                >
                                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                                </motion.div>
                                <h3 className="text-xl font-semibold text-white">Успешно!</h3>
                                <p className="text-gray-400">Действие выполнено</p>
                            </motion.div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                        <Icon className={`w-5 h-5 ${danger ? 'text-red-500' : 'text-yellow-500'}`} />
                                        {title}
                                    </h3>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-white transition-colors"
                                        disabled={isLoading}
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-gray-300">{description}</p>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-red-400 text-sm bg-red-900/20 rounded-md p-2 border border-red-800 flex items-center gap-2"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            onClick={onClose}
                                            disabled={isLoading}
                                            className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
                                        >
                                            {cancelText}
                                        </button>
                                        <button
                                            onClick={handleConfirm}
                                            disabled={isLoading}
                                            className={`px-4 py-2 rounded-lg ${danger
                                                    ? 'bg-red-600 hover:bg-red-700'
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                } text-white font-medium disabled:opacity-50 transition-colors flex items-center justify-center gap-2 min-w-24`}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                confirmText
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

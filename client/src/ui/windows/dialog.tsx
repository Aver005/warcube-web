import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, XCircle, UserCircle2, LucideIcon } from 'lucide-react'
import React from 'react'

interface DialogProps
{
    isOpen: boolean
    onClose: () => void
    onSuccessClose?: () => void
    title: string
    initialValue?: string
    maxLength?: number
    placeholder?: string
    validation?: (value: string) => string | null
    onSubmit: (value: string) => Promise<{ success: boolean; message?: string }>
    successMessage?: string
    icon?: LucideIcon
    inputType?: 'text' | 'password' | 'email' | 'number'
    cancelText?: string
    submitText?: string
    allowKeyboardInput?: boolean
    children?: React.ReactNode
}

export const Dialog = ({
    isOpen,
    onClose,
    onSuccessClose,
    title,
    initialValue = '',
    maxLength = 16,
    placeholder = '',
    validation,
    onSubmit,
    successMessage = 'Изменения успешно сохранены!',
    icon: Icon = UserCircle2,
    inputType = 'text',
    cancelText = 'Отмена',
    submitText = 'Сохранить',
    allowKeyboardInput = true,
    children,
}: DialogProps) =>
{
    const [value, setValue] = useState(initialValue)
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async () =>
    {
        if (!value.trim())
        {
            setError('Поле не может быть пустым')
            return
        }

        if (validation)
        {
            const validationError = validation(value)
            if (validationError)
            {
                setError(validationError)
                return
            }
        }

        setIsLoading(true)
        setError('')

        try
        {
            const response = await onSubmit(value)
            if (response.success)
            {
                setSuccess(true)
                setTimeout(() =>
                {
                    setSuccess(false)
                    setIsLoading(false)
                    
                    if (onSuccessClose) 
                    {
                        onSuccessClose()
                        return
                    }

                    setValue(initialValue)
                }, 1500)
            } else
            {
                setError(response.message || 'Произошла ошибка')
                setIsLoading(false)
            }
        } catch (err)
        {
            setError('Ошибка соединения')
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        setValue(e.target.value)
        if (error) setError('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) =>
    {
        if (e.key === 'Enter')
        {
            handleSubmit()
            return
        }

        if (!allowKeyboardInput) return

        if (e.key === 'Backspace')
        {
            setValue(prev => prev.slice(0, -1))
            return
        }

        if (e.key.length > 1) return
        setValue(prev => prev + e.key)
    }

    useEffect(() =>
    {
        if (!isOpen)
        {
            setValue(initialValue)
            setError('')
            setSuccess(false)
        }
    }, [isOpen, initialValue])

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
                                <h3 className="text-xl font-semibold text-white">Успех!</h3>
                                <p className="text-gray-400">{successMessage}</p>
                            </motion.div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                        <Icon className="w-5 h-5" />
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

                                <div className="space-y-4">
                                    {children || (
                                        <div>
                                            <label htmlFor="modal-input" className="block text-sm font-medium text-gray-300 mb-1">
                                                {placeholder}
                                            </label>
                                            <input
                                                id="modal-input"
                                                type={inputType}
                                                value={value}
                                                onChange={handleChange}
                                                onKeyDown={handleKeyDown}
                                                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-white outline-none transition"
                                                placeholder={placeholder}
                                                maxLength={maxLength}
                                                disabled={isLoading}
                                                autoFocus
                                            />
                                        </div>
                                    )}

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
                                            onClick={handleSubmit}
                                            disabled={isLoading}
                                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:bg-blue-600/50 transition-colors flex items-center justify-center gap-2 min-w-24"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                submitText
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

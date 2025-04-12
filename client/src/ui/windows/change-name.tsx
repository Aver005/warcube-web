import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, XCircle, UserCircle2 } from 'lucide-react'
import React from 'react'
import { useNetworkStore } from '@/stores/network-store'

interface ChangeNameModalProps
{
    isOpen: boolean
    onClose: () => void
}

export const ChangeNameModal = ({ isOpen, onClose }: ChangeNameModalProps) =>
{
    const { socket } = useNetworkStore();
    const [newName, setNewName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSave = async () => 
    {
        if (!newName.trim()) 
        {
            setError('Имя не может быть пустым')
            return
        }

        if (newName.length > 16)
        {
            setError('Максимальная длина имени - 16 символов')
            return
        }

        if (!socket || socket === null || socket.disconnected)
        {
            setError('Ошибка соединения')
            return
        }

        setIsLoading(true)
        setError('')

        try
        {
            socket.emit('playerRename', newName, (response: { success: boolean, message?: string }) =>
            {
                if (response.success)
                {
                    setSuccess(true)
                    setTimeout(() =>
                    {
                        setSuccess(false)
                        setIsLoading(false)
                        onClose()
                        setNewName('')
                    }, 1500)
                } 
                else
                {
                    setError(response.message || 'Это имя уже занято')
                    setIsLoading(false)
                }
            })
        } 
        catch (err)
        {
            setError('Ошибка соединения')
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.KeyboardEvent) => 
    {
        if (e.key === 'Enter')
        {
            handleSave()
            return
        }
        
        if (e.key === 'Backspace')
        {
            setNewName(prev => prev.slice(0, -1))
            return
        }

        if (e.key.length > 1) return
        setNewName(prev => prev + e.key)
    }

    useEffect(() =>
    {
        if (!isOpen)
        {
            setNewName('')
            setError('')
            setSuccess(false)
        }
    }, 
    [isOpen])

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
                                <h3 className="text-xl font-semibold text-white">Имя изменено!</h3>
                                <p className="text-gray-400">Новое имя успешно сохранено</p>
                            </motion.div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                        <UserCircle2 className="w  -5 h-5" />
                                        Смена имени
                                    </h3>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                                            Новое имя
                                        </label>
                                        <input
                                            id="username"
                                            type="text"
                                            value={newName}
                                            // onChange={(e) => setNewName(e.target.value)}
                                            className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-white outline-none transition"
                                            placeholder="Введите новое имя"
                                            maxLength={16}
                                            onKeyDown={handleChange}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            Допустимые символы: буквы, цифры, _ (макс. 16 символов)
                                        </p>
                                    </div>

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
                                            Отмена
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:bg-blue-600/50 transition-colors flex items-center justify-center gap-2 min-w-24"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                'Сохранить'
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

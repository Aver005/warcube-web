'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OverlayType, useUIStore } from '@/stores/ui-store';
import { Play, Settings, User, LogOut, Menu, X, ServerIcon, UserCircle2 } from 'lucide-react';
import { Dialog } from './dialog';
import { useNetworkStore } from '@/stores/network-store';
import { ConfirmDialog } from './confirmation-dialog';
import PlayerProfile, { Player } from './player-profile';
import { mockPlayer } from '@/mockdata/player';

const overlayVariants = 
{
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

const menuVariants = 
{
    hidden: { opacity: 0, x: 100 },
    visible: 
    {
        opacity: 1,
        x: 0,
        transition: 
        {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    },
    exit: { opacity: 0, x: 100 }
};

const itemVariants = 
{
    hidden: { opacity: 0, y: "20%" },
    visible: { opacity: 1, y: 0 },
    hover: { x: -8 }
};

const PauseMenu: React.FC = () =>
{
    const { scene } = useNetworkStore();
    const { setOverlayWindow } = useUIStore();

    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    const [profilePlayer, setProfilePlayer] = useState<Player | null>(null);

    const [popup, setPopup] = useState<
        'connect-dialog' | 'exit-dialog' | 'player-profile' | null
    >(null);

    const onClose = () => setOverlayWindow(OverlayType.NONE);
    const onPopupClose = () => setPopup(null);

    const menuItems = 
    [
        { id: 1, label: "Continue", icon: <Play className="w-5 h-5" />, action: onClose },
        { id: 2, label: "Connect", icon: <ServerIcon className="w-5 h-5" />, action: () => setPopup('connect-dialog') },
        { id: 3, label: "Settings", icon: <Settings className="w-5 h-5" />, action: () => console.log("Settings") },
        { id: 4, label: "Profile", icon: <User className="w-5 h-5" />, action: () => { setProfilePlayer(mockPlayer); setPopup('player-profile') } },
        { id: 5, label: "Exit", icon: <LogOut className="w-5 h-5" />, action: () => setPopup('exit-dialog') },
    ];

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-200 flex justify-end items-center pointer-events-auto"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
                {/* Затемненный фон */}
                <motion.div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                />

                {popup === 'player-profile' && <PlayerProfile 
                    player={profilePlayer!} 
                    onClose={onPopupClose} 
                />}

                <Dialog
                    isOpen={popup === 'connect-dialog'}
                    onClose={onPopupClose}
                    onSuccessClose={onClose}
                    title="Адрес сервера"
                    placeholder="IP (например, 127.0.0.1:3301)"
                    successMessage="Соединение установлено!"
                    submitText="Подключиться"
                    maxLength={32}
                    icon={ServerIcon}
                    initialValue={'127.0.0.1:3000'}
                    validation={(value) => 
                    {
                        if (!value.trim()) return 'IP не может быть пустым'
                        if (value.length > 32) return 'IP не может быть длиннее - 32 символов'
                        return null
                    }}
                    onSubmit={async (value) => 
                    {
                        if (!scene) return { success: false, message: 'Сцена не найдена' }
                        scene.disconnect()
                        scene.connect(value)
                        return { success: true }
                    }}
                />

                <ConfirmDialog 
                    isOpen={popup === 'exit-dialog'}
                    onClose={onPopupClose}
                    onSuccessClose={onClose}
                    title="Вы уверены?"
                    description="Вы уверены, что хотите выйти из матча?"
                    icon={UserCircle2}
                    confirmText="Да"
                    cancelText="Нет"
                    onConfirm={async () => 
                    {
                        if (!scene) return { success: false, message: 'Сцена не найдена' }
                        scene.disconnect()
                        return { success: true }
                    }}
                />

                {/* Основное меню */}
                <motion.div
                    className="relative h-full w-80 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col px-8 py-16"
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Заголовок */}
                    <motion.div
                        className="flex items-center gap-3 mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Menu className="w-8 h-8 text-white" />
                        <h2 className="text-3xl font-medium text-white tracking-wide">
                            MENU
                        </h2>
                    </motion.div>

                    {/* Линия-разделитель */}
                    <motion.div
                        className="w-full h-px bg-gradient-to-r from-transparent via-gray-500/30 to-transparent mb-8"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                    />

                    {/* Кнопки меню */}
                    <div className="space-y-3 flex flex-col">
                        {menuItems.map((item, index) => (
                            <motion.button
                                key={item.id}
                                className="relative group text-white text-lg py-4 px-6 rounded-lg flex items-center gap-4 transition-colors hover:bg-white/5"
                                onClick={item.action}
                                variants={itemVariants}
                                onHoverStart={() => setHoveredItem(index)}
                                onHoverEnd={() => setHoveredItem(null)}
                            >
                                {/* Подсветка при наведении */}
                                {hoveredItem === index && (
                                    <motion.span
                                        className="absolute left-0 top-0 h-full w-1 bg-indigo-400 rounded-r-md"
                                        layoutId="menuHighlight"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    />
                                )}

                                {/* Иконка */}
                                <motion.span
                                    className="text-gray-300 group-hover:text-indigo-300 group-hover:scale-110 transition-transform"
                                    animate={{
                                        x: hoveredItem === index ? [0, 4, -4, 0] : 0
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        ease: "easeInOut",
                                        repeat: hoveredItem === index ? Infinity : 0
                                    }}
                                >
                                    {item.icon}
                                </motion.span>

                                {/* Текст кнопки */}
                                <span className="font-medium tracking-wide">{item.label}</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Версия игры */}
                    <motion.div
                        className="mt-auto pt-4 text-gray-500 text-sm self-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        v1.0.0
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PauseMenu;

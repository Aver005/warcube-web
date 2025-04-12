'use client'

import React from 'react';
import { MiniMap, ActionsBar, HealthBar, WeaponBar } from './index';
import { motion } from 'framer-motion';

const containerVariants = 
{
    hidden: { opacity: 0 },
    visible: 
    {
        opacity: 1,
        transition: 
        {
            staggerChildren: 0.2,
            delayChildren: 0.3
        }
    }
};

const itemVariants = 
{
    hidden: { opacity: 0, y: 20 },
    visible: 
    {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const HUD: React.FC = () =>
{
    return (
        <motion.div
            className="fixed inset-0 pointer-events-none p-4 flex flex-col justify-between z-50"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div className="flex justify-between w-full" variants={containerVariants}>
                <motion.div variants={itemVariants}>
                    <MiniMap />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <ActionsBar />
                </motion.div>
            </motion.div>

            <motion.div className="flex justify-between w-full items-end" variants={containerVariants}>
                <motion.div variants={itemVariants}>
                    <HealthBar />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <WeaponBar />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

export default HUD;

import
{
    User,
    Skull,
    Swords,
    HeartPulse,
    Coins,
    Trophy,
    BarChart2,
    Zap,
    Clock,
    Target,
    XIcon,
    UserPlus,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from './player-list';
import { StatCard, StatItem } from './stats/stat-item';

interface SmallPlayerProfileProps
{
    player: Player;
    onClose: () => void;
}

const SmallPlayerProfile = ({ player, onClose }: SmallPlayerProfileProps) =>
{
    const [isReporting, setIsReporting] = useState(false);
    const [isAddingFriend, setIsAddingFriend] = useState(false);
    const [isReported, setIsReported] = useState(false);
    const [isFriendAdded, setIsFriendAdded] = useState(false);

    const stats =
    [
        {
            icon: <HeartPulse className="w-4 h-4" />,
            value: player.damage,
            label: "Total Damage",
            additional: `${Math.round(player.damage / (player.kills || 1))} per kill`
        },
        {
            icon: <Coins className="w-4 h-4" />,
            value: `$${player.money}`,
            label: "Current Money",
            additional: `Earned: $${player.money + player.spent || 0}`
        },
        {
            icon: <Target className="w-4 h-4" />,
            value: `${player.accuracy}%`,
            label: "Accuracy",
            additional: `${player.headshots} headshots`
        },
        {
            icon: <Zap className="w-4 h-4" />,
            value: player.currentStreak,
            label: "Current Streak",
            additional: `Best: ${player.bestStreak}`
        },
        {
            icon: <Clock className="w-4 h-4" />,
            value: player.timePlayed,
            label: "Time Played",
            additional: "This session"
        },
        {
            icon: <BarChart2 className="w-4 h-4" />,
            value: `#${player.rank || 'N/A'}`,
            label: "Leaderboard",
            additional: `Top ${player.percentile || '?'}%`
        }
    ]

    const handleReport = () =>
    {
        setIsReporting(true);
        // Simulate API call
        setTimeout(() =>
        {
            setIsReporting(false);
            setIsReported(true);
            setTimeout(() => setIsReported(false), 2000);
        }, 1500);
    };

    const handleAddFriend = () =>
    {
        setIsAddingFriend(true);
        // Simulate API call
        setTimeout(() =>
        {
            setIsAddingFriend(false);
            setIsFriendAdded(true);
            setTimeout(() => setIsFriendAdded(false), 2000);
        }, 1500);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 flex items-center justify-center z-150 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="relative bg-gray-900 rounded-xl w-1/3 min-w-[400px] max-w-[600px] overflow-hidden"
                >
                    <div className='absolute right-2 top-2'>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className='cursor-pointer text-white p-1 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors'
                            onClick={onClose}
                        >
                            <XIcon className='size-4' />
                        </motion.button>
                    </div>

                    {/* Header */}
                    <div className={`p-4 ${player.team === 'blue' ? 'bg-blue-900/80' : 'bg-red-900/80'}`}>
                        <div className="flex justify-between items-center mt-4">
                            <div className='flex gap-4 items-center'>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden shadow-lg"
                                >
                                    {player.avatar ? (
                                        <img
                                            src={player.avatar}
                                            alt={player.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-8 h-8 text-gray-400" />
                                    )}
                                </motion.div>
                                <h1 className='text-3xl font-bold text-white'>
                                    {player.name}
                                </h1>
                            </div>
                            <div className="flex space-x-6 mr-4">
                                <StatItem
                                    icon={<Swords className="w-4 h-4" />}
                                    value={player.kills}
                                    label="Kills"
                                />
                                <StatItem
                                    icon={<Skull className="w-4 h-4" />}
                                    value={player.deaths}
                                    label="Deaths"
                                />
                                <StatItem
                                    icon={<Trophy className="w-4 h-4" />}
                                    value={player.kdRatio.toFixed(2)}
                                    label="K/D"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Detailed Stats */}
                    <div className="p-4 grid grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <StatCard {...stat} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer with buttons */}
                    <div className="border-t border-gray-800 p-3 flex justify-end space-x-2">
                        <AnimatePresence mode='wait'>
                            {isReported ? (
                                <motion.div
                                    key="reported"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm flex items-center gap-2"
                                >
                                    <AlertTriangle className="size-4" /> Reported
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="report"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleReport}
                                    disabled={isReporting}
                                    initial={{ opacity: 0, }}
                                    animate={{ opacity: 1, }}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm text-white transition-all flex items-center gap-2"
                                >
                                    {isReporting ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" /> Reporting...
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="size-4" /> Report
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode='wait'>
                            {isFriendAdded ? (
                                <motion.div
                                    key="added"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`px-4 py-2 rounded-md text-sm text-white flex items-center gap-2 bg-green-600`}
                                >
                                    <UserPlus className="size-4" /> Friend added!
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="add"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleAddFriend}
                                    disabled={isAddingFriend}
                                    initial={{ opacity: 0, }}
                                    animate={{ opacity: 1, }}
                                    className={`px-4 py-2 rounded-md text-sm text-white transition-all flex items-center gap-2 ${player.team === 'blue'
                                        ? 'bg-blue-700 hover:bg-blue-600'
                                        : 'bg-red-700 hover:bg-red-600'
                                        }`}
                                >
                                    {isAddingFriend ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" /> Adding...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="size-4" /> Add Friend
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SmallPlayerProfile;

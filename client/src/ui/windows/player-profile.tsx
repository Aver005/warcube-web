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
    Loader2,
    MessageSquare,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AchievementCard, CommentCard, ExtendedStatCard, FriendItem, MatchCard, StatItem, StatusBadge, TabButton } from './stats/stat-item';

export interface Player
{
    id: string;
    name: string;
    avatar?: string;
    team: 'blue' | 'red';
    status: 'online' | 'offline' | 'away' | 'menu' | 'in-match';
    lastOnline?: string;
    description?: string;
    kills: number;
    deaths: number;
    kdRatio: number;
    damage: number;
    money: number;
    spent: number;
    accuracy: number;
    headshots: number;
    currentStreak: number;
    bestStreak: number;
    timePlayed: string;
    rank?: number;
    percentile?: number;
    achievements?: Achievement[];
    recentMatches?: Match[];
    comments?: Comment[];
    friends?: Friend[];
}

export interface Achievement
{
    id: string;
    icon: React.ReactNode;
    title: string;
    date: string;
    description: string;
}

export interface Match
{
    id: string;
    result: 'win' | 'loss' | 'draw' | 'top';
    date: string;
    duration: string;
    kills: number;
    deaths: number;
    kdRatio: number;
    position?: number;
}

export interface Comment
{
    id: string;
    author: {
        name: string;
        avatar?: string;
    };
    date: string;
    text: string;
    reactions: {
        like: number;
        dislike: number;
        smile: number;
    };
}

export interface Friend
{
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline' | 'away' | 'menu' | 'in-match';
}

interface PlayerProfileProps
{
    player: Player;
    onClose: () => void;
}

const PlayerProfile = ({ player, onClose }: PlayerProfileProps) =>
{
    const [isReporting, setIsReporting] = useState(false);
    const [isAddingFriend, setIsAddingFriend] = useState(false);
    const [isReported, setIsReported] = useState(false);
    const [isFriendAdded, setIsFriendAdded] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'stats' | 'matches' | 'achievements' | 'comments'>('stats');

    const stats = [
        {
            icon: <HeartPulse className="w-4 h-4" />,
            value: player.damage,
            label: "Total Damage",
            additional: `${Math.round(player.damage / (player.kills || 1))} per kill`,
            chart: true
        },
        {
            icon: <Coins className="w-4 h-4" />,
            value: `$${player.money}`,
            label: "Current Money",
            additional: `Earned: $${player.money + player.spent || 0}`,
            chart: true
        },
        {
            icon: <Target className="w-4 h-4" />,
            value: `${player.accuracy}%`,
            label: "Accuracy",
            additional: `${player.headshots} headshots`,
            chart: true
        },
        {
            icon: <Zap className="w-4 h-4" />,
            value: player.currentStreak,
            label: "Current Streak",
            additional: `Best: ${player.bestStreak || 0}`,
            chart: true
        },
        {
            icon: <Clock className="w-4 h-4" />,
            value: player.timePlayed,
            label: "Time Played",
            additional: "This session",
            chart: false
        },
        {
            icon: <BarChart2 className="w-4 h-4" />,
            value: `#${player.rank || 'N/A'}`,
            label: "Leaderboard",
            additional: `Top ${player.percentile || '?'}%`,
            chart: false
        }
    ];

    const extendedStats = [
        ...stats,
        {
            icon: <Swords className="w-4 h-4" />,
            value: player.kills,
            label: "Total Kills",
            additional: `${Math.round((player.kills / (player.kills + player.deaths)) * 100)}% kill participation`,
            chart: true
        },
        {
            icon: <Skull className="w-4 h-4" />,
            value: player.deaths,
            label: "Total Deaths",
            additional: `${Math.round(player.deaths / (player.kills || 1))} deaths per kill`,
            chart: true
        }
    ];

    const handleReport = () =>
    {
        setIsReporting(true);
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
                className="fixed inset-0 bg-black/90 flex items-center justify-center z-150 backdrop-blur-sm overflow-y-auto py-10"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="relative bg-gray-900 rounded-xl w-11/12 overflow-hidden max-h-screen"
                >
                    <div className='absolute right-2 top-2 z-10'>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className='cursor-pointer text-white p-1 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors'
                            onClick={onClose}
                        >
                            <XIcon className='size-5' />
                        </motion.button>
                    </div>

                    {/* Header */}
                    <div className={`p-6 ${player.team === 'blue' ? 'bg-blue-900/80' : 'bg-red-900/80'} relative`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className='flex gap-6 items-center'>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-24 h-24 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden shadow-lg"
                                >
                                    {player.avatar ? (
                                        <img
                                            src={player.avatar}
                                            alt={player.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-12 h-12 text-gray-400" />
                                    )}
                                </motion.div>
                                <div className="space-y-2">
                                    <h1 className='text-4xl font-bold text-white'>
                                        {player.name}
                                    </h1>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <StatusBadge status={player.status} lastOnline={player.lastOnline} />
                                        {player.description && (
                                            <p className="text-gray-300 text-sm max-w-lg">{player.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-6 mr-4">
                                <StatItem
                                    icon={<Swords className="w-5 h-5" />}
                                    value={player.kills}
                                    label="Kills"
                                />
                                <StatItem
                                    icon={<Skull className="w-5 h-5" />}
                                    value={player.deaths}
                                    label="Deaths"
                                />
                                <StatItem
                                    icon={<Trophy className="w-5 h-5" />}
                                    value={player.kdRatio.toFixed(2)}
                                    label="K/D"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row">
                        {/* Main Content */}
                        <div className="flex-1 p-6">
                            {/* Navigation Tabs */}
                            <div className="flex border-b border-gray-800 mb-6">
                                <TabButton
                                    active={selectedTab === 'stats'}
                                    onClick={() => setSelectedTab('stats')}
                                >
                                    Statistics
                                </TabButton>
                                <TabButton
                                    active={selectedTab === 'matches'}
                                    onClick={() => setSelectedTab('matches')}
                                >
                                    Recent Matches
                                </TabButton>
                                <TabButton
                                    active={selectedTab === 'achievements'}
                                    onClick={() => setSelectedTab('achievements')}
                                >
                                    Achievements
                                </TabButton>
                                <TabButton
                                    active={selectedTab === 'comments'}
                                    onClick={() => setSelectedTab('comments')}
                                >
                                    Comments ({player.comments?.length || 0})
                                </TabButton>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[400px]">
                                {selectedTab === 'stats' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {extendedStats.map((stat, index) => (
                                            <ExtendedStatCard
                                                key={index}
                                                {...stat}
                                                chart={stat.chart}
                                            />
                                        ))}
                                    </div>
                                )}

                                {selectedTab === 'matches' && (
                                    <div className="space-y-3">
                                        {player.recentMatches?.length ? (
                                            player.recentMatches.map((match) => (
                                                <MatchCard key={match.id} match={match} />
                                            ))
                                        ) : (
                                            <div className="text-gray-400 text-center py-10">
                                                No recent matches found
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedTab === 'achievements' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {player.achievements?.length ? (
                                            player.achievements.map((achievement) => (
                                                <AchievementCard key={achievement.id} achievement={achievement} />
                                            ))
                                        ) : (
                                            <div className="text-gray-400 col-span-full text-center py-10">
                                                No achievements unlocked yet
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedTab === 'comments' && (
                                    <div className="space-y-4">
                                        {player.comments?.length ? (
                                            <>
                                                {player.comments.map((comment) => (
                                                    <CommentCard key={comment.id} comment={comment} />
                                                ))}
                                                <button className="w-full py-2 border border-gray-800 rounded-md text-gray-400 hover:text-white transition-colors">
                                                    Load more comments...
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-gray-400 text-center py-10">
                                                No comments yet
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-800 p-6 space-y-6">
                            {/* Friends Section */}
                            {player.friends && player.friends.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-white">Friends ({player.friends.length})</h3>
                                        <button className="text-xs text-gray-400 hover:text-white">View all</button>
                                    </div>
                                    <div className="space-y-2">
                                        {player.friends.slice(0, 5).map((friend) => (
                                            <FriendItem key={friend.id} friend={friend} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-white">Actions</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <AnimatePresence mode='wait'>
                                        {isFriendAdded ? (
                                            <motion.div
                                                key="added"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className={`col-span-2 px-4 py-2 rounded-md text-sm text-white flex items-center justify-center gap-2 bg-green-600`}
                                            >
                                                <UserPlus className="size-4" /> Friend added!
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                key="add"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleAddFriend}
                                                disabled={isAddingFriend}
                                                initial={{ opacity: 0, }}
                                                animate={{ opacity: 1, }}
                                                className={`col-span-full px-4 py-2 rounded-md text-sm text-white transition-all flex items-center justify-center gap-2 ${player.team === 'blue'
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

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm text-white flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare className="size-4" /> Message
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm text-white flex items-center justify-center gap-2"
                                    >
                                        <Users className="size-4" /> Invite
                                    </motion.button>

                                    <AnimatePresence mode='wait'>
                                        {isReported ? (
                                            <motion.div
                                                key="reported"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="col-span-2 px-4 py-2 bg-gray-700 text-white rounded-md text-sm flex items-center justify-center gap-2"
                                            >
                                                <AlertTriangle className="size-4" /> Reported
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                key="report"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleReport}
                                                disabled={isReporting}
                                                initial={{ opacity: 0, }}
                                                animate={{ opacity: 1, }}
                                                className="col-span-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm text-white transition-all flex items-center justify-center gap-2"
                                            >
                                                {isReporting ? (
                                                    <>
                                                        <Loader2 className="size-4 animate-spin" /> Reporting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertTriangle className="size-4" /> Report Player
                                                    </>
                                                )}
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-white">Player Info</h3>
                                <div className="text-sm text-gray-400 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Registered</span>
                                        <span className="text-white">Jan 2022</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Playtime</span>
                                        <span className="text-white">342 hours</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Favorite Weapon</span>
                                        <span className="text-white">AK-47</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Favorite Map</span>
                                        <span className="text-white">Dust II</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PlayerProfile;
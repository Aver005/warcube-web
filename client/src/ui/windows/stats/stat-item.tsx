import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, Friend, Match, Comment } from "../player-profile";
import { Smile, Frown, Meh, Star, Award, Calendar, User, MoreHorizontal, ThumbsUp, ChevronRight } from "lucide-react";

export const StatItem = ({ icon, value, label }: {
    icon: React.ReactNode;
    value: number | string;
    label: string;
}) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className='space-y-2'
    >
        <div className="flex items-center space-x-1 text-gray-400 text-xs">
            {icon}
            <span>{label}</span>
        </div>
        <div className={`text-xl font-semibold text-white`}>{value}</div>
    </motion.div>
);

export const StatCard = ({ icon, value, label, additional }: {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    additional?: string;
}) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-gray-800 rounded-lg p-3 transition-colors cursor-default"
    >
        <div className="flex items-center space-x-2 text-gray-400">
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </div>
        <div className="text-xl font-bold text-white mt-1">{value}</div>
        {additional && (
            <div className="text-xs text-gray-500 mt-1">{additional}</div>
        )}
    </motion.div>
);

export const StatusBadge = ({ status, lastOnline }: { status: string, lastOnline?: string }) => {
    const statusMap = {
        online: { color: 'bg-green-500', text: 'Online', icon: <div className="w-2 h-2 rounded-full bg-green-500 mr-1" /> },
        offline: { color: 'bg-gray-500', text: lastOnline ? `Last online ${lastOnline}` : 'Offline', icon: <div className="w-2 h-2 rounded-full bg-gray-500 mr-1" /> },
        away: { color: 'bg-yellow-500', text: 'Away', icon: <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1" /> },
        'in-match': { color: 'bg-purple-500', text: 'In Match', icon: <div className="w-2 h-2 rounded-full bg-purple-500 mr-1" /> },
        menu: { color: 'bg-blue-500', text: 'In Menu', icon: <div className="w-2 h-2 rounded-full bg-blue-500 mr-1" /> }
    };

    const currentStatus = statusMap[status as keyof typeof statusMap] || statusMap.offline;

    return (
        <div className="flex items-center text-sm">
            {currentStatus.icon}
            <span>{currentStatus.text}</span>
        </div>
    );
};

// Компонент для кнопки вкладки
export const TabButton = ({ 
    children, 
    active, 
    onClick 
}: { 
    children: React.ReactNode, 
    active: boolean, 
    onClick: () => void 
}) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium relative ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
    >
        {children}
        {active && (
            <motion.div
                layoutId="tabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
        )}
    </button>
);

// Расширенная карточка статистики с возможностью отображения графика
export const ExtendedStatCard = ({ 
    icon, 
    value, 
    label, 
    additional, 
    chart = false 
}: { 
    icon: React.ReactNode, 
    value: string | number, 
    label: string, 
    additional?: string,
    chart?: boolean 
}) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-gray-800 rounded-lg p-4 transition-colors cursor-default h-full"
    >
        <div className="flex items-center space-x-2 text-gray-400">
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="text-2xl font-bold text-white mt-2">{value}</div>
        {additional && (
            <div className="text-xs text-gray-500 mt-1">{additional}</div>
        )}
        {chart && (
            <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${Math.min(100, Math.random() * 100)}%` }}
                />
            </div>
        )}
    </motion.div>
);

export const MatchCard = ({ match }: { match: Match }) => {
    const resultColors = {
        win: 'bg-green-900/50 border-green-500',
        loss: 'bg-red-900/50 border-red-500',
        draw: 'bg-yellow-900/50 border-yellow-500',
        top: 'bg-purple-900/50 border-purple-500'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className={`p-4 rounded-lg border ${resultColors[match.result]} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3`}
        >
            <div className="flex items-center gap-3">
                {match.result === 'win' && <Smile className="text-green-400" />}
                {match.result === 'loss' && <Frown className="text-red-400" />}
                {match.result === 'draw' && <Meh className="text-yellow-400" />}
                {match.result === 'top' && <Star className="text-purple-400" />}
                
                <div>
                    <div className="text-white font-medium">
                        {match.result === 'win' && 'Victory'}
                        {match.result === 'loss' && 'Defeat'}
                        {match.result === 'draw' && 'Draw'}
                        {match.result === 'top' && `Top ${match.position}`}
                    </div>
                    <div className="text-gray-400 text-sm">{match.date}</div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-center">
                    <div className="text-white font-bold">{match.kills}</div>
                    <div className="text-gray-400 text-xs">KILLS</div>
                </div>
                <div className="text-center">
                    <div className="text-white font-bold">{match.deaths}</div>
                    <div className="text-gray-400 text-xs">DEATHS</div>
                </div>
                <div className="text-center">
                    <div className="text-white font-bold">{match.kdRatio.toFixed(2)}</div>
                    <div className="text-gray-400 text-xs">K/D</div>
                </div>
                <div className="text-center min-w-[60px]">
                    <div className="text-white font-bold">{match.duration}</div>
                    <div className="text-gray-400 text-xs">TIME</div>
                </div>
            </div>
        </motion.div>
    );
};

export const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-gray-800 rounded-lg p-4 transition-colors cursor-default h-full"
    >
        <div className="flex items-start gap-3">
            <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-400">
                {achievement.icon || <Award className="w-5 h-5" />}
            </div>
            <div>
                <h4 className="text-white font-medium">{achievement.title}</h4>
                <p className="text-gray-400 text-sm mt-1">{achievement.description}</p>
                <div className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {achievement.date}
                </div>
            </div>
        </div>
    </motion.div>
);

// Карточка комментария
export const CommentCard = ({ comment }: { comment: Comment }) => (
    <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-gray-800 rounded-lg p-4 transition-colors"
    >
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                {comment.author.avatar ? (
                    <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                ) : (
                    <User className="w-5 h-5 text-gray-400" />
                )}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-white font-medium">{comment.author.name}</h4>
                        <div className="text-gray-500 text-xs">{comment.date}</div>
                    </div>
                    <button className="text-gray-500 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-gray-300 mt-2 text-sm">{comment.text}</p>
                <div className="flex items-center gap-3 mt-3">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white text-xs">
                        <ThumbsUp className="w-3 h-3" /> {comment.reactions.like}
                    </button>
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white text-xs">
                        <ThumbsUp className="w-3 h-3 rotate-180" /> {comment.reactions.dislike}
                    </button>
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white text-xs">
                        <Smile className="w-3 h-3" /> {comment.reactions.smile}
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
);

// Карточка друга
export const FriendItem = ({ friend }: { friend: Friend }) => {
    const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-gray-500',
        away: 'bg-yellow-500',
        'in-match': 'bg-purple-500',
        menu: 'bg-blue-500'
    };

    return (
        <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
        >
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {friend.avatar ? (
                        <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-5 h-5 text-gray-400" />
                    )}
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${statusColors[friend.status]}`} />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{friend.name}</h4>
                <div className="text-gray-500 text-xs capitalize">
                    {friend.status === 'in-match' ? 'In Game' : friend.status}
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
        </motion.div>
    );
};

import { useState } from 'react';
import
{
    Skull,
    User,
    MapPin,
    Clock,
    Swords,
    HeartPulse,
    Coins,
    Map,
    VoteIcon,
    UserCircle2Icon,
    UserXIcon,
    ShieldIcon,
    UserCircle2
} from 'lucide-react';
import React from 'react';
import PlayerProfile from './player-profile';
import { useUIStore } from '@/stores/ui-store';
import { AnimatePresence, motion } from 'framer-motion';
import { useNetworkStore } from '@/stores/network-store';
import { Dialog } from './dialog';

export interface Player
{
    id: number;
    name: string;
    isAlive: boolean;
    kills: number;
    deaths: number;
    damage: number;
    money: number;
    team: 'blue' | 'red';
    kdRatio: number;
    accuracy: number;
    headshots: number;
    currentStreak: number;
    bestStreak: number;
    timePlayed: string;
    rank: number;
    percentile: number;
    spent: number;
    avatar?: string;
}

interface MatchInfo
{
    mapName: string;
    gameMode: string;
    timeLeft: string;
}

const PlayerList: React.FC = () =>
{
    const { socket } = useNetworkStore();
    const { toggleOverlayHold } = useUIStore();

    const [matchInfo] = useState<MatchInfo>({
        mapName: 'de_dust2',
        gameMode: 'Deathmatch',
        timeLeft: '05:24'
    });

    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [isNameModalOpen, setIsNameModalOpen] = useState(false)

    const [players] = useState<Player[]>([
        {
            id: 1,
            name: 'Player1',
            isAlive: true,
            kills: 12,
            deaths: 3,
            damage: 1560,
            money: 4200,
            team: 'blue',
            kdRatio: 4.0,
            accuracy: 75,
            headshots: 5,
            currentStreak: 3,
            bestStreak: 5,
            timePlayed: '2h 30m',
            rank: 1,
            percentile: 95,
            spent: 1500
        },
        {
            id: 2,
            name: 'Player2',
            isAlive: true,
            kills: 8,
            deaths: 5,
            damage: 980,
            money: 3100,
            team: 'blue',
            kdRatio: 1.6,
            accuracy: 65,
            headshots: 2,
            currentStreak: 1,
            bestStreak: 4,
            timePlayed: '1h 45m',
            rank: 2,
            percentile: 85,
            spent: 800
        },
        {
            id: 3,
            name: 'Player3',
            isAlive: false,
            kills: 4,
            deaths: 7,
            damage: 540,
            money: 1800,
            team: 'blue',
            kdRatio: 0.57,
            accuracy: 50,
            headshots: 1,
            currentStreak: 0,
            bestStreak: 2,
            timePlayed: '1h 20m',
            rank: 3,
            percentile: 70,
            spent: 600
        },
        {
            id: 4,
            name: 'Player4',
            isAlive: true,
            kills: 15,
            deaths: 2,
            damage: 2100,
            money: 6500,
            team: 'blue',
            kdRatio: 7.5,
            accuracy: 80,
            headshots: 8,
            currentStreak: 4,
            bestStreak: 6,
            timePlayed: '3h 10m',
            rank: 1,
            percentile: 90,
            spent: 2000
        },
        {
            id: 5,
            name: 'Player5',
            isAlive: true,
            kills: 6,
            deaths: 6,
            damage: 720,
            money: 2400,
            team: 'red',
            kdRatio: 1.0,
            accuracy: 60,
            headshots: 3,
            currentStreak: 2,
            bestStreak: 3,
            timePlayed: '1h 50m',
            rank: 4,
            percentile: 75,
            spent: 900
        },
        {
            id: 6,
            name: 'Player6',
            isAlive: false,
            kills: 3,
            deaths: 9,
            damage: 360,
            money: 1200,
            team: 'red',
            kdRatio: 0.33,
            accuracy: 45,
            headshots: 0,
            currentStreak: 0,
            bestStreak: 1,
            timePlayed: '1h 10m',
            rank: 5,
            percentile: 60,
            spent: 300
        },
        {
            id: 7,
            name: 'Player7',
            isAlive: true,
            kills: 10,
            deaths: 4,
            damage: 1280,
            money: 3800,
            team: 'red',
            kdRatio: 2.5,
            accuracy: 70,
            headshots: 4,
            currentStreak: 3,
            bestStreak: 5,
            timePlayed: '2h 00m',
            rank: 3,
            percentile: 80,
            spent: 1200
        },
        {
            id: 8,
            name: 'Player8',
            isAlive: true,
            kills: 7,
            deaths: 5,
            damage: 890,
            money: 2900,
            team: 'red',
            kdRatio: 1.4,
            accuracy: 68,
            headshots: 2,
            currentStreak: 1,
            bestStreak: 3,
            timePlayed: '1h 30m',
            rank: 4,
            percentile: 72,
            spent: 700
        },
    ]);

    const [mapMarkers] = useState([
        { id: 1, name: 'Bomb Plant A', icon: '💣', color: 'bg-red-500' },
        { id: 2, name: 'Bomb Plant B', icon: '💣', color: 'bg-red-500' },
        { id: 3, name: 'CT Spawn', icon: '🛡️', color: 'bg-blue-500' },
        { id: 4, name: 'T Spawn', icon: '☠️', color: 'bg-red-500' },
        { id: 5, name: 'Player', icon: '⭐', color: 'bg-yellow-400' },
    ]);


    const handleSelectPlayer = (player: Player | null) =>
    {
        toggleOverlayHold()
        setSelectedPlayer(player)
    }

    const handleRename = () =>
    {
        toggleOverlayHold()
        setIsNameModalOpen(true)
    }

    return <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 pointer-events-auto"
        >
            {selectedPlayer && (
                <PlayerProfile
                    player={selectedPlayer}
                    onClose={() => handleSelectPlayer(null)}
                />
            )}

            <Dialog
                isOpen={isNameModalOpen}
                onClose={() => setIsNameModalOpen(false)}
                title="Смена имени"
                placeholder="Введите новое имя"
                maxLength={16}
                icon={UserCircle2}
                initialValue={''}
                validation={(value) => 
                {
                    if (!value.trim()) return 'Имя не может быть пустым'
                    if (value.length > 16) return 'Максимальная длина имени - 16 символов'
                    return null
                }}
                onSubmit={async (newName) => 
                {
                    if (!socket || socket === null || socket.disconnected) 
                        return { success: false, message: 'Ошибка соединения' }

                    return new Promise((resolve) => 
                    {
                        socket.emit('playerRename', newName, (response: { success: boolean, message?: string }) => {
                            resolve(response)
                        })
                    })
                }}
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, duration: 0.1 }}
                className="bg-gray-900 bg-opacity-90 rounded-lg w-4/5 h-4/5 flex overflow-hidden"
            >
                {/* Левая часть - Карта */}
                <div className="w-2/5 p-4 flex flex-col">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700"
                    >
                        <div className="flex items-center space-x-4">
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center text-gray-300"
                            >
                                <MapPin className="w-4 h-4 mr-2" /> {matchInfo.mapName}
                            </motion.span>
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                className="text-gray-400"
                            >
                                {matchInfo.gameMode}
                            </motion.span>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center text-gray-300"
                        >
                            <Clock className="w-4 h-4 mr-2" /> {matchInfo.timeLeft}
                        </motion.div>
                    </motion.div>

                    {/* Контейнер карты */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative flex-1 bg-gray-800 rounded-md overflow-hidden"
                    >
                        {/* Здесь будет мини-карта уровня */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Map className="w-32 h-32 text-gray-600 opacity-30" />
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                Mini-map will be here
                            </div>
                        </div>

                        {/* Анимированные маркеры на карте */}
                        {[
                            { position: 'top-1/4 left-1/4', color: 'bg-blue-500' },
                            { position: 'top-1/3 right-1/4', color: 'bg-red-500' },
                            { position: 'bottom-1/4 left-1/2', color: 'bg-yellow-400' }
                        ].map((marker, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.3 + index * 0.1,
                                    type: 'spring',
                                    stiffness: 500,
                                    damping: 15
                                }}
                                whileHover={{ scale: 1.5 }}
                                className={`absolute ${marker.position} w-2 h-2 rounded-full ${marker.color}`}
                            />
                        ))}
                    </motion.div>

                    {/* Легенда карты */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 bg-gray-800 rounded-md p-3 "
                    >
                        <h3 className="text-gray-300 text-sm font-semibold mb-4">Map Legend</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {mapMarkers.map((marker, index) => (
                                <motion.div
                                    key={marker.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.05 }}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center text-xs"
                                >
                                    <span className={`${marker.color} size-6 rounded-full mr-2 flex items-center justify-center`}>
                                        {marker.icon}
                                    </span>
                                    <span className="text-gray-400">{marker.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Правая часть - Список игроков */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.1 }}
                    className="relative w-3/5 bg-gray-800 bg-opacity-70 p-4 overflow-y-auto"
                >
                    {/* Заголовки столбцов */}
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-12 gap-2 pb-4 mb-4 border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider"
                    >
                        <div className="col-span-4">Player</div>
                        <div className="col-span-2 flex justify-center">
                            <Swords className="size-4" />
                        </div>
                        <div className="col-span-2 flex justify-center">
                            <Skull className="size-4" />
                        </div>
                        <div className="col-span-2 flex justify-center">
                            <HeartPulse className="size-4" />
                        </div>
                        <div className="col-span-2 flex justify-center">
                            <Coins className="size-4" />
                        </div>
                    </motion.div>

                    {/* Список игроков */}
                    <div className="space-y-1">
                        {players.map((player, index) => (
                            <motion.div
                                key={player.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.03, duration: 0.2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSelectPlayer(player)}
                                className={`grid grid-cols-12 gap-2 p-2 px-4 rounded-md group
                                    text-md cursor-pointer text-gray-500 hover:text-white hover:bg-white/4 
                                    ${player.team === 'blue' ? 'bg-blue-900/20' : 'bg-red-900/20'}`}
                            >
                                <div className="col-span-4 flex items-center">
                                    <motion.div
                                        animate={{
                                            scale: player.isAlive ? [1, 1.2, 1] : 1,
                                            transition: player.isAlive ? {
                                                repeat: Infinity,
                                                duration: 2
                                            } : {}
                                        }}
                                        className="mr-2"
                                    >
                                        {player.isAlive ? (
                                            <User className="size-4 text-white" />
                                        ) : (
                                            <Skull className="size-4" />
                                        )}
                                    </motion.div>
                                    <span className={`truncate group-hover:text-white
                                        ${player.isAlive ?
                                            (player.team === 'blue' ? 'text-blue-400' : 'text-red-400') : ''}`}
                                    >
                                        {player.name}
                                    </span>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="col-span-2 text-center text-gray-300"
                                >
                                    {player.kills}
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="col-span-2 text-center text-gray-300"
                                >
                                    {player.deaths}
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="col-span-2 text-center text-gray-300"
                                >
                                    {player.damage}
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="col-span-2 text-center text-yellow-400"
                                >
                                    ${player.money}
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Кнопки в правом нижнем углу */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-4 flex space-x-2"
                    >
                        <motion.button
                            initial={{ scale: 0.95 }}
                            whileHover={{ scale: 1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleRename}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            <UserCircle2Icon className="w-4 h-4" />
                            Change Name
                        </motion.button>

                        <motion.button
                            initial={{ scale: 0.95 }}
                            whileHover={{ scale: 1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            <VoteIcon className="w-4 h-4" />
                            Start Vote
                        </motion.button>

                        <motion.button
                            initial={{ scale: 0.95 }}
                            whileHover={{ scale: 1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled
                            className="flex items-center justify-center gap-2 bg-gray-600 text-gray-400 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed"
                        >
                            <Map className="w-4 h-4" />
                            Change Map
                        </motion.button>

                        <motion.button
                            initial={{ scale: 0.95 }}
                            whileHover={{ scale: 1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled
                            className="flex items-center justify-center gap-2 bg-gray-600 text-gray-400 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed"
                        >
                            <UserXIcon className="w-4 h-4" />
                            Kick Player
                        </motion.button>

                        <motion.button
                            initial={{ scale: 0.95 }}
                            whileHover={{ scale: 1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled
                            className="flex items-center justify-center gap-2 bg-gray-600 text-gray-400 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed"
                        >
                            <ShieldIcon className="w-4 h-4" />
                            Admin Panel
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    </AnimatePresence>
};

export default PlayerList;

import { Player } from "@/ui/windows/player-profile";
import { Coins, Target, Trophy, Zap } from "lucide-react";
import React from "react";

export const mockPlayer: Player = 
{
    id: 'player-123',
    name: 'ProGamer2000',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    team: 'blue',
    status: 'online',
    lastOnline: '2 hours ago',
    description: 'Competitive player specializing in tactical shooters. Currently grinding for top 100 global rank.',
    kills: 2456,
    deaths: 1872,
    kdRatio: 1.31,
    damage: 1258432,
    money: 12500,
    spent: 32000,
    accuracy: 42.5,
    headshots: 876,
    currentStreak: 8,
    bestStreak: 15,
    timePlayed: '143 hours',
    rank: 127,
    percentile: 3.2,
    achievements: [
        {
            id: 'ach-1',
            icon: <Trophy className="w-5 h-5" />,
            title: 'First Blood',
            date: '2023-01-15',
            description: 'Get 100 first kills in matches'
        },
        {
            id: 'ach-2',
            icon: <Target className="w-5 h-5" />,
            title: 'Sharpshooter',
            date: '2023-03-22',
            description: 'Achieve 40% headshot ratio in 10 consecutive matches'
        },
        {
            id: 'ach-3',
            icon: <Zap className="w-5 h-5" />,
            title: 'Unstoppable',
            date: '2023-05-10',
            description: 'Win 10 matches in a row'
        },
        {
            id: 'ach-4',
            icon: <Coins className="w-5 h-5" />,
            title: 'Millionaire',
            date: '2023-07-18',
            description: 'Earn $1,000,000 in total'
        }
    ],
    recentMatches: [
        {
            id: 'match-1',
            result: 'win',
            date: '10 min ago',
            duration: '00:22:45',
            kills: 24,
            deaths: 12,
            kdRatio: 2.0
        },
        {
            id: 'match-2',
            result: 'top',
            date: '1 hour ago',
            duration: '00:18:32',
            kills: 18,
            deaths: 8,
            kdRatio: 2.25,
            position: 3
        },
        {
            id: 'match-3',
            result: 'loss',
            date: '3 hours ago',
            duration: '00:15:10',
            kills: 10,
            deaths: 16,
            kdRatio: 0.63
        },
        {
            id: 'match-4',
            result: 'win',
            date: '5 hours ago',
            duration: '00:25:41',
            kills: 22,
            deaths: 14,
            kdRatio: 1.57
        },
        {
            id: 'match-5',
            result: 'draw',
            date: 'Yesterday',
            duration: '00:20:15',
            kills: 15,
            deaths: 15,
            kdRatio: 1.0
        }
    ],
    comments: [
        {
            id: 'comment-1',
            author: {
                name: 'SniperElite',
                avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
            },
            date: '2 days ago',
            text: 'Great teamwork in our last match! Your callouts were spot on.',
            reactions: {
                like: 3,
                dislike: 0,
                smile: 1
            }
        },
        {
            id: 'comment-2',
            author: {
                name: 'RushB',
                avatar: 'https://randomuser.me/api/portraits/men/12.jpg'
            },
            date: '1 week ago',
            text: 'That clutch was insane! How did you manage to 1v4?',
            reactions: {
                like: 8,
                dislike: 1,
                smile: 4
            }
        }
    ],
    friends: [
        {
            id: 'friend-1',
            name: 'SniperElite',
            avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
            status: 'in-match'
        },
        {
            id: 'friend-2',
            name: 'RushB',
            avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
            status: 'online'
        },
        {
            id: 'friend-3',
            name: 'TacticalMind',
            avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
            status: 'away'
        },
        {
            id: 'friend-4',
            name: 'FragMaster',
            avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
            status: 'offline'
        },
        {
            id: 'friend-5',
            name: 'ClutchKing',
            avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
            status: 'menu'
        },
        {
            id: 'friend-6',
            name: 'HeadshotQueen',
            avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
            status: 'in-match'
        }
    ]
};

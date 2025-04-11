'use client'
import { Action, useMapDataStore } from '@/stores/map-data-store';
import { SwordsIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const MAX_ACTIONS = 6;
const DISPLAY_DURATION = 4000; // 4 seconds

const ActionsBar: React.FC = () =>
{
    const { actions } = useMapDataStore();
    const [localActions, setLocalActions] = useState<Action[]>([]);

    const addAction = (action: Action) =>
    {
        setLocalActions(prev => [...prev, action]);
    };

    useEffect(() =>
    {
        if (localActions.length <= MAX_ACTIONS) return
        setLocalActions(prev => prev.slice(1));
    }, 
    [localActions.length]);

    useEffect(() =>
    {
        if (localActions.length === 0) return;

        const timer = setTimeout(() =>
        {
            setLocalActions(prev => prev.slice(1));
        }, DISPLAY_DURATION);

        return () => clearTimeout(timer);
    }, 
    [localActions]);

    useEffect(() => 
    {
        if (actions.length === 0) return
        
        const newAction = actions[actions.length - 1];
        addAction(newAction);
    }, 
    [actions.length]);

    return (
        <div className="flex flex-col items-end space-y-2 max-w-xs">
            {localActions.map((note) => (
                <div
                    key={note.id}
                    className={`${note.color} bg-gray-900/80 backdrop-blur-sm px-3 py-2 rounded-lg font-bold text-sm animate-fade animate-once animate-duration-500 animate-ease-out`}
                >
                    <div className="flex items-center">
                        {note.icon ? note.icon : <SwordsIcon className="w-4 h-4 mr-2" />}
                        {note.text}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ActionsBar;

import React from "react";

type WeaponSlot = 
{
    id: number;
    icon: React.ReactNode;
    type: 'primary' | 'secondary' | 'special';
    active: boolean;
};

interface WeaponSlotProps
{
    slot: WeaponSlot;
    weapon?: any;
}


const WeaponSlot = ({ slot, weapon = undefined }: WeaponSlotProps) =>
{
    const borderColor = slot.active
        ? slot.type === 'special'
            ? 'border-red-500'
            : 'border-yellow-400'
        : slot.type === 'special'
            ? 'border-red-500/50'
            : 'border-gray-600';

    const size = slot.active ? 'w-16 h-16' : 'w-14 h-14';
    const iconSize = slot.active ? 'w-8 h-8' : 'w-7 h-7';

    return (
        <div className={`
            bg-gray-800/80 backdrop-blur-sm 
            rounded-lg border-2 ${borderColor} 
            ${size} flex items-center justify-center 
            transition-all duration-200
            ${slot.active ? 'scale-100' : 'scale-90'}
        `}>
            {weapon ? 
            <img src={`./icons/items/${weapon.icon.replace(':', '_')}.svg`} alt={weapon.name} className={iconSize} />
            : 
            <div className={`[&_svg]:text-gray-600 opacity-60 ${iconSize}`}>
                {slot.icon}
            </div>}
        </div>
    );
};

export default WeaponSlot;

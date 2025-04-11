export interface PlayerDeadEvent
{
    id: string,
    x: number;
    y: number;
    name: string;
    killerId: string,
    killerName: string;
}
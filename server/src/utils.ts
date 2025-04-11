import { Position } from "./types/Player";

export function getRandomPositions(
    xMin: number = 0,
    xMax: number = 1280,
    yMin: number = 0,
    yMax: number = 720
): Position
{
    const getRandomCoordinate = (min: number, max: number): number =>
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    return {
        x: getRandomCoordinate(xMin, xMax),
        y: getRandomCoordinate(yMin, yMax)
    };
}
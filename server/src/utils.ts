import { Position } from "./types/Player";

export function getRandomPositions(
    xMin: number = 0,
    xMax: number = 1280,
    yMin: number = 0,
    yMax: number = 720
): Position
{
   
    return {
        x: getRandomInt(xMin, xMax),
        y: getRandomInt(yMin, yMax)
    };
}

export const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
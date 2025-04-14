import Phaser from 'phaser';
import MainScene from './main-scene';

const config: Phaser.Types.Core.GameConfig = 
{
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game',
    backgroundColor: '#333',
    physics: 
    {
        default: 'arcade',
        arcade: 
        {
            gravity: { y: 0, x: 0 },
            debug: false,
            width: 4000,
            height: 4000
        }
    },
    scene: MainScene,
};

export const SetupGame = () =>
{
    return new Phaser.Game(config)
}
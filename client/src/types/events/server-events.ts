import { Item } from "../items";
import { PlayerData } from "../Player";

export interface InitEvent
{
    players: Map<string, PlayerData>,
    itemsOnGround: Item[]
}
import { AnyItem, ArmorSlots, Hotbar, IInventory, SpecialItem } from "@/types/items";

export class Inventory implements IInventory
{
    items!: AnyItem[];
    hotbar!: Hotbar;
    specialSlot!: SpecialItem | null;
    armorSlots!: ArmorSlots;
    maxSize!: number;
    
    constructor()
    {
        this.clear();
    }

    clear(): void
    {
        this.items = [];
        this.hotbar = [null, null];
        this.specialSlot = null;
        this.armorSlots = [null, null, null];
        this.maxSize = 6;
    }
}
import { Scene } from "phaser";

type Key = string | number | boolean | symbol;

export class ObjectMap<T extends Phaser.GameObjects.GameObject>
{
    private record: Map<Key, T>;
    private group: Phaser.GameObjects.Group;

    constructor(scene: Scene)
    {
        this.record = new Map<Key, T>();
        this.group = scene.add.group();
    }

    public add(key: Key, object: T): void
    {
        this.record.set(key, object);
        this.group.add(object);
    }

    public get(key: Key): T | undefined
    {
        return this.record.get(key);
    }

    public remove(key: Key): boolean
    {
        const object = this.record.get(key);
        if (object)
        {
            this.group.remove(object, true);
            this.record.delete(key);
            return true;
        }
        return false;
    }

    public clear(): void
    {
        this.group.clear(true, true);
        this.record.clear();
    }

    public destroy(): void
    {
        this.clear();
    }

    public sort(compareFn: (a: T, b: T) => number): T[]
    {
        return Array.from(this.record.values()).sort(compareFn);
    }

    public filter(predicate: (object: T) => boolean): T[]
    {
        return Array.from(this.record.values()).filter(predicate);
    }

    public search(key: Key): T | undefined
    {
        return this.get(key);
    }

    public searchByCondition(predicate: (object: T) => boolean): T[]
    {
        return this.filter(predicate);
    }

    public forEach(callback: (object: T, key: Key) => void): void
    {
        this.record.forEach((object, key) =>
        {
            callback(object, key);
        });
    }

    public map<U>(callback: (object: T, key: Key) => U): U[]
    {
        const result: U[] = [];
        this.record.forEach((object, key) => result.push(callback(object, key)));
        return result;
    }

    getGroup() { return this.group; }
}

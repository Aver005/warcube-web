class StringGenerator
{
    private characters: string;

    constructor()
    {
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    }

    // Устанавливаем набор символов для генерации
    setCharacters(characters: string)
    {
        this.characters = characters;
    }

    // Генерация строки заданной длины
    generate(length: number): string
    {
        let result = '';
        const charactersLength = this.characters.length;
        for (let i = 0; i < length; i++)
        {
            const randomIndex = Math.floor(Math.random() * charactersLength);
            result += this.characters.charAt(randomIndex);
        }
        return result;
    }

    // Генерация нескольких строк
    generateMultiple(length: number, count: number): string[]
    {
        const strings: string[] = [];
        for (let i = 0; i < count; i++)
        {
            strings.push(this.generate(length));
        }
        return strings;
    }
}

export default new StringGenerator();
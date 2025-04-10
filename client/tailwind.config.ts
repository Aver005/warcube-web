/** @type {import('tailwindcss').Config} */
export default 
{
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",  // Включает React-компоненты и Phaser (если нужно)
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}

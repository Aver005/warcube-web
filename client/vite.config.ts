import { defineConfig } from 'vite'
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(
{
    plugins: [react(), tailwindcss(),],
    root: '.',
    publicDir: 'public',
    build: 
    {
        outDir: 'dist',
        emptyOutDir: true,
    },
    server: 
    {
        open: true,
        port: 8080,
        host: '0.0.0.0'
    },
    resolve: 
    {
        alias: {'@': resolve(__dirname, './src')},
    },
})

import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        vue(),
        dts({
            staticImport: true,
            insertTypesEntry: true,
        }),
    ],
    base: '/',
    build: {
        cssCodeSplit: true,
        outDir: 'dist',
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'vue3vsl',
            formats: ['es'],
            fileName: 'index.js'
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    }
});

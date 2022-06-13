import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import typescript2 from 'rollup-plugin-typescript2'

export default defineConfig({
    plugins: [
        vue(),
        typescript2({
            check: false,
            include: ['src/**/*.vue', 'src/**/*.ts'],
            tsconfigOverride: {
                compilerOptions: {
                    sourceMap: true,
                    declaration: true,
                    declarationMap: true,
                }
            },
            exclude: [
                'vite.config.ts', 'main.ts'
            ],
        })
    ],
    build: {
        cssCodeSplit: false,
        lib: {
            entry: './src/vsl-plugin.ts',
            formats: ['es', 'cjs'],
            name: 'vsl-plugin',
            fileName: format => (format === 'es' ? 'index.js' : 'index.cjs'),
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});

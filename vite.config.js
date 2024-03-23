import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [
                AntDesignVueResolver({
                    importStyle: false // css in js
                })
            ]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 8800,
        host: 'dev.autotest.com',
        proxy: {
            '/api/v1': {
                target: 'http://dev.autotest.com:8801',
                changeOrigin: true,
                allowCookies: true
            },
            '/public': {
                target: 'http://dev.autotest.com:8801',
                changeOrigin: true,
                allowCookies: true
            }
        }
    }
});

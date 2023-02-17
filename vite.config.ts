import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import viteCompression from 'vite-plugin-compression';
import Unocss from 'unocss/vite'


const alias: Record<string, string> = {
    '@': resolve(__dirname, "src"),     //配置src的别名
    "@comp": resolve(__dirname, "src/components"),
};

// const reg = /(console.log\()(.*)(\))/g;
// const clearConsole = function (source: string) {
//     source = source.replace(reg, "")
//     return source;
// }

// 打包模式：输出路径
const outDir = {
    'test': 'dist-test',
    'pro1': 'dist-pro1',
    'pro2': 'dist-pro2',
    'dev': 'dist',
    'production': 'dist'
}

const viteConfig = defineConfig((mode: ConfigEnv) => {
    const env = loadEnv(mode.mode, process.cwd());
    if (mode.mode !== "development" && env.VITE_REQUEST_ROUTE == 'false') throw Error("未启用后端控制路由")
    return {
        plugins: [
            vue(),
            Unocss(),
            viteCompression({
                disable: env.VITE_UN_GZIP == 'true' ? true : false,     // 是否禁用，默认false，不禁用
            })
        ],
        root: process.cwd(),
        resolve: {
            alias: alias
        },
        base: env.VITE_PUBLIC_PATH || "/",      //项目部署在主域名的子文件使用,例如http://localhost:3000/myvite/。不填默认就是/ 
        server: {
            host: '0.0.0.0',
            // port: env.VITE_PORT as unknown as number,   // 开发启动的端口
            // open: env.VITE_OPEN,    // 是否自动打开浏览器
            proxy: {
                "/api": {
                    // target: "http://192.168.0.200:9091/api",
                    target: env.VITE_API_URL,
                    ws: true,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },

        },

        build: {
            outDir: outDir[mode.mode] ?? 'dist',
            sourcemap: false,   // 不生成.map文件
            chunkSizeWarningLimit: 1500,    // 打包超出文件大小警告
            rollupOptions: {
                output: {
                    entryFileNames: `assets/js/[name].[hash].js`,
                    chunkFileNames: `assets/js/[name].[hash].js`,
                    // assetFileNames: `assets/[name].[hash].[ext]`,
                    assetFileNames: assetInfo => {
                        const name = assetInfo.name as string;
                        const info = name.split('.')
                        let extType = info[info.length - 1]
                        if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(name)) {
                            extType = 'media'
                        } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(name)) {
                            extType = 'images'
                        } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(name)) {
                            extType = 'fonts'
                        }
                        return `assets/${extType}/[name]-[hash][extname]`
                    }
                },
            },
            minify: 'terser',
            terserOptions: {
                compress: {
                    //生产环境时移除console
                    drop_console: true,
                    drop_debugger: true,
                },
            },
        },
    };
});
export default viteConfig;

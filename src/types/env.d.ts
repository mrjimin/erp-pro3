interface ImportMetaEnv {
    /**
     * 启动端口
     */
    VITE_PORT: number,
    /**
     * 是否立即打开浏览器
     */
    VITE_OPEN: boolean,
    /**
     * 根目录
     */
    VITE_PUBLIC_PATH: string,
    /**
     * 接口地址
     */
    VITE_API_URL: string,
    /**
     * 密钥
     */
    VITE_SIGN_KEY: string,
    /**
     * 是否启用GZIP压缩
     */
    VITE_UN_GZIP: boolean,

    VITE_REQUEST_ROUTE: string,

    /**
     * 跨库出库倍率
     */
    VITE_OUT_RATE: string,
}
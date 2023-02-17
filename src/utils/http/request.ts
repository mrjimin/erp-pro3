import axios, { AxiosRequestConfig } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Session } from '@/utils/storage';
import { crypto } from '@/utils/http/crypto';

let errNum = 0;
// 配置新建一个 axios 实例
const service = axios.create({
    baseURL: import.meta.env.MODE == 'development' ? '' : (import.meta.env.VITE_API_URL || ''),
    timeout: import.meta.env.MODE == 'development' ? 20000 : 30000,
    headers: { 'Content-Type': 'application/json' },
    // 请求超时再次发起请求处理,设置全局的请求次数，请求的间隙
    retry: 2,       // 第一次请求失败后重试请求的次数。
    retryDelay: 500,   // 在失败的请求之间等待的毫秒数（默认为 1）
});

// 添加请求拦截器
service.interceptors.request.use((config) => {

    // 在发送请求之前做些什么 token
    const token = Session.get('token');
    // if (token) {
    //     (<any>config.headers).common['Authorization'] = `${token}`;
    // }

    // 先判断是不是为post提交，默认用get
    const type: 'data' | 'params' = config.method === 'post' ? 'data' : 'params';
    let data = config[type] ?? {};
    if (typeof data === 'string') data = JSON.parse(data)

    // 有token就把token也丢进去
    if (token) data.admin_token = token;
    //追加参数time时间戳和sign签名,
    const newData = crypto(data);
    if (newData) {
        config[type] = newData;
    } else {
        throw new Error('密钥或参数有误')
        // return Promise.reject({
        //     message: '',
        //     response: {
        //         status: '0000',
        //         statusText: '密钥或参数有误',
        //     }
        // })
    }
    return config;
}, (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use((response) => {
    // 对响应数据做点什么
    const res = response.data;
    // return response.data;
    if (res.code && res.code == 403) {
        if (import.meta.env.MODE == 'development') {
            if (errNum) return;
            errNum++;
            ElMessageBox.alert('账号已过期，请重新登录', '提示', {
                confirmButtonText: '确定',
                callback: () => {
                    errNum = 0
                    Session.clear(); // 清除浏览器全部临时缓存
                    window.location.href = '/'; // 去登录页
                }
            })
            return Promise.reject(service.interceptors.response);
        }
        if (window.location.hash === "#/login") {
            return response.data;
        } else {
            // `token` 过期或者账号已在别处登录
            ElMessageBox.alert('账号已过期，请重新登录', '提示', {
                confirmButtonText: '确定',
                callback: () => {
                    Session.clear(); // 清除浏览器全部临时缓存
                    window.location.href = '/'; // 去登录页
                }
            })
            // Session.clear(); // 清除浏览器全部临时缓存
            // window.location.href = '/'; // 去登录页
            // ElMessageBox.alert('账号已过期，请重新登录', '提示', {})
            //     .then(() => { })
            //     .catch(() => { });
            return Promise.reject(service.interceptors.response);
        }
    } else {
        return response.data;
    }
}, async (error) => {
    // 对响应错误做点什么
    // if (error.message.indexOf('timeout') != -1) {
    //     ElMessage.error('网络超时');
    // } else if (error.message == 'Network Error') {
    //     ElMessage.error('网络连接错误');
    // } else {
    //     ElMessage.error(error.response.status + ',' + error.response.statusText);
    //     //    if (error.response.data)  else ElMessage.error('接口路径找不到');
    // }
    // return Promise.reject(error);

    // 请求超时处理 https://github.com/axios/axios/issues/164#issuecomment-327837467
    const config = error.config;
    // If config does not exist or the retry option is not set, reject
    if (!config || !config.retry) return Promise.reject(error);

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;

    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= config.retry) {
        // Reject with the error
        if (error.message.indexOf('timeout') != -1) {
            ElMessage.error('网络超时');
        } else if (error.message == 'Network Error') {
            ElMessage.error('网络连接错误');
        } else {
            ElMessage.error(error.response.status + ',' + error.response.statusText);
            //    if (error.response.data)  else ElMessage.error('接口路径找不到');
        }
        return Promise.reject(error);
    }

    // Increase the retry count
    config.__retryCount += 1;

    // Create new promise to handle exponential backOff
    const backOff = new Promise(function (resolve) {
        setTimeout(function () {
            resolve(1);
        }, config.retryDelay || 1);
    });

    // Return the promise in which recalls axios to retry the request
    return backOff.then(function () {
        return service(config);
    });

});


/*** 方法封装 **********************************/
/**
 * @method post请求
 * @param {string} url 请求接口路由地址
 * @param {any} [data] 接口参数
 * @param {any} [config] 请求头部配置信息
 * @returns {Promise<ResponseData<T>>}
 */
const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseData<T>> => {
    // return service.get(url, {
    //     params: data,
    //     ...config
    // })
    return service.post(url, data, { ...config })
}

/**
 * @method get请求
 * @param {string} url 请求接口路由地址
 * @param {any} [data] 接口参数
 * @param {any} [config] 请求头部配置信息
 * @returns {Promise<ResponseData<T>>}
 */
const get = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseData<T>> => {
    return service.get(url, {
        params: data,
        ...config
    })
}

/**
 * @method del删除
 * @param {string} url 请求接口路由地址
 * @param {any} [data] 接口参数
 * @param {any} [config] 请求头部配置信息
 * @returns {Promise<ResponseData<T>>}
 */
const del = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseData<T>> => {
    return service.delete(url, {
        params: data,
        ...config
    })
}
/**
 * @method put请求
 * @param {string} url 请求接口路由地址
 * @param {any} [data] 接口参数
 * @param {any} [config] 请求头部配置信息
 * @returns {Promise<ResponseData<T>>}
 */
const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseData<T>> => {
    return service.put(url, data, { ...config })
}

// 导出 axios 实例
export { post, get, del, put, service as request }

// export default service;

import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import GlobalFetch from 'alova/GlobalFetch';

export const alovaInstance = createAlova({
    baseURL: '/',
    timeout: 3000,
    statesHook: VueHook,
    requestAdapter: GlobalFetch(),
    localCache: null,
    responsed: {
        // 请求成功的拦截器
        // 当使用GlobalFetch请求适配器时，第一个参数接收Response对象
        // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
        onSuccess: async (response, method) => {
            if (response.status >= 400) {
                throw new Error(response.statusText);
            }
            const json = await response.json();
            // 解析的响应数据将传给method实例的transformData钩子函数，这些函数将在后续讲解
            if (json.errno !== 0) {
                throw new Error(json.errmsg);
            }
            return json.data;
        },
        // 请求失败的拦截器
        // 请求错误时将会进入该拦截器。
        // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
        onError: (err, method) => {
            alert(err.message);
        }
    },
    beforeRequest(method) {
        // 假设我们需要添加token到请求头
        method.config.headers['Content-Type'] =
            'application/json;charset=UTF-8';
    }
});

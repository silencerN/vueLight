import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import store from '@/store';
import { localStorage } from '@/utils/storage';

// 创建axios实例
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 50000, // 请求超时时间：50s
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        if (!config.headers) {
            throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
        }

        const { tenantId, isLogin, tokenObj } = toRefs(store.user.useUserStore());

        if (isLogin.value) {
            // 授权认证
            config.headers[tokenObj.value.tokenName] = tokenObj.value.tokenValue;
            // 微信公众号appId
            config.headers['appId'] = localStorage.get('appId');
        }

        // 接口有可能自己配置了租户id，如果没有单独配置，才取全局的租户id
        if (!config.headers['TENANT_ID']) {
            // 租户ID
            config.headers['TENANT_ID'] = tenantId.value;
        }

        if (config.isFile) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// 响应拦截器
service.interceptors.response.use(
    async (response) => {
        let res = response.data;

        // 请求时声明返回类型为blob & Blob类型  => 字节流转换处理
        if (response.request.responseType == 'blob' && toString.call(res) === '[object Blob]') {
            // 先判断下是否返回异常
            if (response.data.type === 'application/json') {
                return handleFileError(response);
            } else {
                // 看看是否需要直接下载
                let isExport = handleExport(response);
                if (isExport) {
                    return;
                }

                // 返回本地文件地址进行预览
                let blob = new Blob([res], { type: 'image/jpeg' });
                const fileUrl = URL.createObjectURL(blob);
                return { code: 200, data: fileUrl, msg: '请求成功' };
            }
        }

        return handleRes(res);
    },
    (error) => {
        console.log('请求异常：', error);
        const { msg } = error.response.data;
        // 未认证
        if (error.response.status === 401) {
            handleError();
        } else {
            ElMessage({
                message: '网络异常，请稍后再试!',
                type: 'error',
                duration: 5 * 1000,
            });
            return Promise.reject(new Error(msg || 'Error'));
        }
    },
);

// 统一处理请求响应异常
function handleError() {
    const { isLogin, logout } = store.user.useUserStore();
    if (isLogin) {
        // ElMessageBox.confirm('您的登录账号已失效，请重新登录', {
        //   confirmButtonText: '再次登录',
        //   cancelButtonText: '取消',
        //   type: 'warning',
        // }).then(() => {
        //   logout();
        // });
        ElMessage({
            message: '登录已过期，请重新登录!',
            type: 'error',
            duration: 3 * 1000,
        });
        logout();
    }
}

// 统一处理正常响应
function handleRes(res) {
    const { code, msg } = res;
    if (code === 200) {
        return res;
    } else {
        // token过期
        if (code === -1) {
            handleError();
        } else {
            ElMessage({
                message: msg || '系统出错',
                type: 'error',
                duration: 5 * 1000,
            });
        }
        return Promise.reject(new Error(msg || 'Error'));
    }
}

// 统一处理文件响应异常
async function handleFileError(response) {
    const fileReader = new FileReader();
    fileReader.readAsText(response.data, 'utf-8');
    fileReader.onload = await function () {
        const result = fileReader.result;
        let res = JSON.parse(result);
        console.log('xx', res);
        return handleRes(res);
    };
}

// 直接下载文件
function handleExport(response) {
    // console.log(response);
    let fileType = response.headers['file-type'];
    // console.log('111', fileType);
    if (fileType !== 'xlsx') {
        return false;
    }
    //headers请求头的乱码数据转换为中文
    const fileName = decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1]).replace("utf-8''", '');
    // debugger;
    //下载文件
    let blob = new Blob([response.data], {
        type: 'application/vnd.ms-excel',
    });
    let objectUrl = URL.createObjectURL(blob); // 创建URL
    const link = document.createElement('a');
    link.href = objectUrl;
    // link.download = '.xlsx'// 自定义文件名
    link.setAttribute('download', fileName);
    link.click(); // 下载文件
    URL.revokeObjectURL(objectUrl); // 释放内存
    return true;
}

// 导出实例
export default service;

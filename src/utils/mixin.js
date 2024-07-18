import { ElMessage, ElMessageBox } from 'element-plus';

// 抽取公用的实例 - 操作成功与失败消息提醒内容等
export default {
    data() {
        return {
            actorList: [
                { name: '张麻子', value: 0 },
                { name: '六爷', value: 1 },
                { name: '胡万', value: 2 },
                { name: '黄四郎', value: 3 },
            ],
        };
    },
    methods: {
        // 操作成功消息提醒内容
        submitOk(msg, cb) {
            this.$notify({
                title: '成功',
                message: msg || '操作成功！',
                type: 'success',
                duration: 2000,
                onClose: function () {
                    cb && cb();
                },
            });
        },
        // 操作失败消息提醒内容
        submitFail(msg) {
            this.$message({
                message: msg || '网络异常，请稍后重试！',
                type: 'error',
            });
        },
        // 消息确认后执行
        submitConfirm(msg, cb) {
            ElMessageBox.alert(msg, '', {
                confirmButtonText: '确认',
                showClose: false,
                callback: (action) => {
                    if (action == 'confirm') {
                        cb && cb();
                    }
                },
            });
        },
    },
};

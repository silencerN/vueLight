import request from '@/utils/request';

export default {
    testapi() {
        // return request({
        //     url: '/api/test/00',
        //     method: 'get',
        // });
        return {
            msg: 111,
            data: 222
        }
    },
};

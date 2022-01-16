// 商品相关的请求接口函数
import request from '@/utils/request'

// export default {
//     // 商品信息
//     getAllGoodsInfo(){
//         return request.get('/admin/goodsInfo')
//     }
// }

// 获取商品信息
export const getAllGoodsInfo = (page, limit) => {
    return request({
        url: `/admin/goodsInfo/${page}/${limit}`,
        method: 'get'
    })
}

// 删除商品
export const deleteGoodsInfo = (goodsId, imgId) => {
    return request({
        url: `/admin/deleteGoodsInfo/${goodsId}/${imgId}`,
        method: 'delete'
    })
}

// 管理员
export const getAdminInfo = (page, limit) => {
    return request({
        url: `/admin/user/${page}/${limit}`,
        method: 'get'
    })
}

// 删除管理员
export const deleteUser = (id) => {
    return request({
        url: `/admin/deleteUser/${id}`,
        method: 'delete'
    })
}

// 添加管理员和修改管理员
export const addOrUpdate = (userInfo) => {
    if (userInfo.id) {
        return request({
            url: '/admin/updateUser',
            method: 'put',
            data: userInfo
        })
    } else {
        return request({
            url: '/admin/addUSer',
            method: 'post',
            data: userInfo
        })
    }
}
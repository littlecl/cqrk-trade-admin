// 商品相关的请求接口函数
import request from '@/utils/request'

// export default {
//     // 商品信息
//     getAllGoodsInfo(){
//         return request.get('/admin/goodsInfo')
//     }
// }

// 首页
export const getHomeInfo = () => {
    return request({
        url: '/admin/home',
        method: 'get'
    })
}

// 首页柱状图
export const getLineChartInfo = () => {
    return request({
        url: '/admin/home/lineChart',
        method: 'get'
    })
}

// 首页饼图
export const getPieChartInfo = () => {
    return request({
        url: '/admin/home/pieChart',
        method: 'get'
    })
}

//首页柱状图
export const getBarChartInfo = () => {
    return request({
        url: '/admin/home/barChart',
        method: 'get'
    })
}

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

// 删除管理员
export const deleteUser = (id) => {
    return request({
        url: `/admin/deleteUser/${id}`,
        method: 'delete'
    })
}

// 获取微信用户信息
export const getWxUserInfo = (page, limit) => {
    return request({
        url: `/admin/wxuser/${page}/${limit}`,
        method: 'get'
    })
}

// 获取轮播图信息
export const getSliderInfo = (page, limit) => {
    return request({
        url: `/admin/sliderInfo/${page}/${limit}`,
        method: 'get'
    })
}

// 添加或者修改轮播图
export const addOrUpdateSliderInfo = (sliderInfo) => {
    if (sliderInfo.id) {
        return request({
            url: '/admin/updateSlider',
            method: 'put',
            data: sliderInfo
        })
    } else {
        return request({
            url: '/admin/addSlider',
            method: 'post',
            data: sliderInfo
        })
    }
}

// 删除轮播图
export const deleteSlider = (id) => {
    return request({
        url: `/admin/deleteSlider/${id}`,
        method: 'delete'
    })
}

// 修改轮播图状态
export const updateSliderStatus = (id, status) => {
    return request({
        url: `/admin/updateStatus/${id}/${status}`,
        method: 'put'
    })
}


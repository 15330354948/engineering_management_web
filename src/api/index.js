import request from '@/utils/request'
// 查询综合数据
export function comprehensiveStatistics(query) {
    return request({
      url: '/backstage/Statistics/comprehensive',
      method: 'get',
      params: query
    })
}
// 查询巡检统计
export function inspectionStatistics(query) {
    return request({
      url: '/backstage/Statistics/inspection',
      method: 'get',
      params: query
    })
}
// 查询维护统计
export function maintainStatistics(query) {
    return request({
      url: '/backstage/Statistics/maintain',
      method: 'get',
      params: query
    })
}
// 查询项目施工统计
export function projectStatistics(query) {
    return request({
      url: '/backstage/Statistics/project',
      method: 'get',
      params: query
    })
}
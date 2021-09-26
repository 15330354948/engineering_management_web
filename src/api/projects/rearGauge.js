import request from '@/utils/request'
// 查询后规列表
export function listRearGauge(query) {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params: query
  })
}
// 查询后规详细
export function getRearGauge(rearGaugeId) {
  return request({
    url: '/system/post/' + rearGaugeId,
    method: 'get'
  })
}

// 新增后规
export function addRearGauge(data) {
  return request({
    url: '/system/post',
    method: 'post',
    data: data
  })
}

// 修改后规
export function updateRearGauge(data) {
  return request({
    url: '/system/post',
    method: 'put',
    data: data
  })
}

// 删除后规
export function delRearGauge(rearGaugeId) {
  return request({
    url: '/system/post/' + rearGaugeId,
    method: 'delete'
  })
}

// 导出后规
export function exportRearGauge(query) {
  return request({
    url: '/system/post/export',
    method: 'get',
    params: query
  })
}
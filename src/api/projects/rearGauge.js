import request from '@/utils/request'
// 查询后规列表
export function listRearGauge(query) {
  return request({
    url: '/backstage/gauge/list',
    method: 'get',
    params: query
  })
}
// 查询后规详细
export function getRearGauge(rearGaugeId) {
  return request({
    url: '/backstage/gauge/' + rearGaugeId,
    method: 'get'
  })
}

// 新增后规
export function addRearGauge(data) {
  return request({
    url: '/backstage/gauge',
    method: 'post',
    data: data
  })
}

// 修改后规
export function updateRearGauge(data) {
  return request({
    url: '/backstage/gauge',
    method: 'put',
    data: data
  })
}

// 删除后规
export function delRearGauge(rearGaugeId) {
  return request({
    url: '/backstage/gauge/del/' + rearGaugeId,
    method: 'delete'
  })
}

// 导出后规
export function exportRearGauge(query) {
  return request({
    url: '/backstage/gauge/export',
    method: 'get',
    params: query
  })
}

// 查询单位
export function listCompany(query) {
  return request({
    url: '/system/dept/treeselect',
    method: 'get',
    params: query
  })
}
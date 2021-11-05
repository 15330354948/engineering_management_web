import request from '@/utils/request'
// 查询预警记录列表
export function listRecord(query) {
  return request({
    url: '/backstage/warnRecord/list',
    method: 'get',
    params: query
  })
}

// 导出预警记录
export function exportRecord(query) {
  return request({
    url: '/backstage/warnRecord/export',
    method: 'get',
    params: query
  })
}
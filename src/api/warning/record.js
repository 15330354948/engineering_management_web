import request from '@/utils/request'
// 查询短信记录列表
export function listRecord(query) {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params: query
  })
}

// 导出短信记录
export function exportRecord(query) {
  return request({
    url: '/system/post/export',
    method: 'get',
    params: query
  })
}
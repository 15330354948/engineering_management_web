import request from '@/utils/request'
// 查询短信记录列表
export function listMessage(query) {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params: query
  })
}

// 导出短信记录
export function exportMessage(query) {
  return request({
    url: '/system/post/export',
    method: 'get',
    params: query
  })
}
import request from '@/utils/request'
// 查询短信记录列表
export function listMessage(query) {
  return request({
    url: '/backstage/smsRecord/list',
    method: 'get',
    params: query
  })
}

// 导出短信记录
export function exportMessage(query) {
  return request({
    url: '/backstage/smsRecord/export',
    method: 'get',
    params: query
  })
}
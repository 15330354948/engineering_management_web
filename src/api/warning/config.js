import request from '@/utils/request'
// 查询短信记录列表
export function listConfig(query) {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params: query
  })
}

// 查询通知发布详细
export function getConfig(configId) {
  return request({
    url: '/system/post/' + configId,
    method: 'get'
  })
}

// 修改通知发布
export function updateConfig(data) {
  return request({
    url: '/system/post',
    method: 'put',
    data: data
  })
}
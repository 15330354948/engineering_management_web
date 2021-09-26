import request from '@/utils/request'
// 查询通知发布列表
export function listNotice(query) {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params: query
  })
}
// 查询通知发布详细
export function getNotice(noticeId) {
  return request({
    url: '/system/post/' + noticeId,
    method: 'get'
  })
}

// 新增通知发布
export function addNotice(data) {
  return request({
    url: '/system/post',
    method: 'post',
    data: data
  })
}

// 修改通知发布
export function updateNotice(data) {
  return request({
    url: '/system/post',
    method: 'put',
    data: data
  })
}

// 删除通知发布
export function delNotice(noticeId) {
  return request({
    url: '/system/post/' + noticeId,
    method: 'delete'
  })
}

// 导出通知发布
export function exportNotice(query) {
  return request({
    url: '/system/post/export',
    method: 'get',
    params: query
  })
}
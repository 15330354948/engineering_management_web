import request from '@/utils/request'
// 查询通知发布列表
export function listNotice(query) {
  return request({
    url: '/backstage/message/list',
    method: 'get',
    params: query
  })
}
// 查询通知发布详细
export function getNotice(noticeId) {
  return request({
    url: '/backstage/message/get/' + noticeId,
    method: 'get'
  })
}

// 新增通知发布
export function addNotice(data) {
  return request({
    url: '/backstage/message',
    method: 'post',
    data: data
  })
}

// 修改通知发布
export function updateNotice(data) {
  return request({
    url: '/backstage/message',
    method: 'put',
    data: data
  })
}

// 删除通知发布
export function delNotice(noticeId) {
  return request({
    url: '/backstage/message/del/' + noticeId,
    method: 'delete'
  })
}

// 导出通知发布
export function exportNotice(query) {
  return request({
    url: '/backstage/message/export',
    method: 'get',
    params: query
  })
}

// 获取单位
export function listCompany(query) {
  return request({
    url: '/system/dept/listPage',
    method: 'get',
    params: query
  })
}

// 通知发送
export function sendNotice(data) {
  return request({
    url: '/backstage/message/send',
    method: 'post',
    data:data
  })
}
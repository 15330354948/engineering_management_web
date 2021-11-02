import request from '@/utils/request'

// 查询公告列表
export function listFeedback(query) {
  return request({
    url: '/system/notice/list',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getFeedback(feedbackId) {
  return request({
    url: '/system/notice/' + feedbackId,
    method: 'get'
  })
}

// 新增公告
export function addFeedback(data) {
  return request({
    url: '/system/notice',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateFeedback(data) {
  return request({
    url: '/system/notice',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delFeedback(feedbackId) {
  return request({
    url: '/system/notice/' + feedbackId,
    method: 'delete'
  })
}
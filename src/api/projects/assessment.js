import request from '@/utils/request'
// 查询考核列表
export function listAssessment(query) {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params: query
  })
}
// 查询考核详细
export function getAssessment(assessmentId) {
  return request({
    url: '/system/post/' + assessmentId,
    method: 'get'
  })
}

// 新增考核
export function addAssessment(data) {
  return request({
    url: '/system/post',
    method: 'post',
    data: data
  })
}

// 修改考核
export function updateAssessment(data) {
  return request({
    url: '/system/post',
    method: 'put',
    data: data
  })
}

// 删除考核
export function delAssessment(assessmentId) {
  return request({
    url: '/system/post/' + assessmentId,
    method: 'delete'
  })
}

// 导出考核
export function exportAssessment(query) {
  return request({
    url: '/system/post/export',
    method: 'get',
    params: query
  })
}
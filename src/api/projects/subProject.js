import request from '@/utils/request'

// 查询子项目列表
export function listProject(query) {
  return request({
    url: '/system/project/list',
    method: 'get',
    params: query
  })
}

// 查询子项目详细
export function getProject(subProjectId) {
  return request({
    url: '/system/project/' + subProjectId,
    method: 'get'
  })
}

// 新增子项目
export function addProject(data) {
  return request({
    url: '/system/project',
    method: 'post',
    data: data
  })
}

// 修改子项目
export function updateProject(data) {
  return request({
    url: '/system/project',
    method: 'put',
    data: data
  })
}

// 删除子项目
export function delProject(subProjectId) {
  return request({
    url: '/system/project/' + subProjectId,
    method: 'delete'
  })
}

// 导出子项目
export function exportProject(query) {
  return request({
    url: '/system/project/export',
    method: 'get',
    params: query
  })
}
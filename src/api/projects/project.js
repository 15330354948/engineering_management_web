import request from '@/utils/request'
// 查询项目列表
export function listProject(query) {
  return request({
    url: '/backstage/project/list',
    method: 'get',
    params: query
  })
}

//新增项目信息
export function addProject(obj) {
  return request({
    url: '/backstage/project',
    method: 'post',
    data: obj
  })
}

// 修改项目信息
export function updateProject(obj) {
  return request({
    url: '/backstage/project',
    method: 'put',
    data: obj
  })
}

// 删除项目信息
export function delProject(ids) {
  return request({
    url: '/backstage/project/' + ids,
    method: 'delete'
  })
}


export function getArea() {
  return request({
    url: '/treeselect',
    method: 'get'
  })
}


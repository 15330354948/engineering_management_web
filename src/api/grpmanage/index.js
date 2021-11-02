import request from '@/utils/request'

// 查询单位列表
export function lstOfUnits() {
  return request({
    url: '/system/dept/listPage',
    method: 'get'
  })
}

// 查询分组列表
export function grpLst(query) {
  return request({
    url: '/backstage/group/list',
    method: 'get',
    params: query
  })
}

// 查询分配人员
export function assignPersonnel(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 新增分组
export function newGrpApi(data) {
  return request({
    url: '/backstage/group',
    method: 'post',
    data
  })
}

// 更新分组
export function updateGrpApi(data) {
  return request({
    url: '/backstage/group',
    method: 'put',
    data
  })
}
// 删除分组
export function deleteGrpApi(groupIds) {
  return request({
    url: '/backstage/group/' + groupIds,
    method: 'delete'
  })
}
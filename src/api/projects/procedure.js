import request from '@/utils/request'
// 查询工序列表
export function listProcedure(query) {
  return request({
    url: '/backstage/procedure/list',
    method: 'get',
    params: query
  })
}
// 查询工序详细
export function getProcedure(procedureId) {
  return request({
    url: '/backstage/procedure/' + procedureId,
    method: 'get'
  })
}

// 新增工序
export function addProcedure(data) {
  return request({
    url: '/backstage/procedure/add',
    method: 'post',
    data: data
  })
}

// 修改工序
export function updateProcedure(data) {
  return request({
    url: '/backstage/procedure',
    method: 'put',
    data: data
  })
}

// 删除工序
export function delProcedure(procedureId) {
  return request({
    url: '/backstage/procedure/delete/' + procedureId,
    method: 'delete'
  })
}

// 导出工序
export function exportProcedure(query) {
  return request({
    url: '/backstage/procedure/export',
    method: 'get',
    params: query
  })
}

// 查询规范列表
export function listStandard(query) {
  return request({
    url: '/backstage/standard/list',
    method: 'get',
    params: query
  })
}
// 查询规范详细
export function getStandard(standardId) {
  return request({
    url: '/backstage/standard/' + standardId,
    method: 'get'
  })
}

// 新增规范
export function addStandard(data) {
  return request({
    url: '/backstage/standard/add',
    method: 'post',
    data: data
  })
}

// 修改规范
export function updateStandard(data) {
  return request({
    url: '/backstage/standard/edit',
    method: 'put',
    data: data
  })
}

// 删除规范
export function delStandard(standardId) {
  return request({
    url: '/backstage/standard/delete/' + standardId,
    method: 'delete'
  })
}

// 导出规范
export function exportStandard(query) {
  return request({
    url: '/backstage/standard/export',
    method: 'get',
    params: query
  })
}
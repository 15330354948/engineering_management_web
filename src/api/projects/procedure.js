import request from '@/utils/request'
// 查询工序列表
export function listProcedure(query) {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params: query
  })
}
// 查询工序详细
export function getProcedure(procedureId) {
  return request({
    url: '/system/post/' + procedureId,
    method: 'get'
  })
}

// 新增工序
export function addProcedure(data) {
  return request({
    url: '/system/post',
    method: 'post',
    data: data
  })
}

// 修改工序
export function updateProcedure(data) {
  return request({
    url: '/system/post',
    method: 'put',
    data: data
  })
}

// 删除工序
export function delProcedure(procedureId) {
  return request({
    url: '/system/post/' + procedureId,
    method: 'delete'
  })
}

// 导出工序
export function exportProcedure(query) {
  return request({
    url: '/system/post/export',
    method: 'get',
    params: query
  })
}
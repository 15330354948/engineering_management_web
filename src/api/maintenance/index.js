import request from '@/utils/request'

// 查询巡检模板列表
export function maintTmplLst(query) {
  return request({
    url: '/backstage/maintain/list',
    method: 'get',
    params: query
  })
}

// 获取维护模板列表详情
export function maintDetails(inspectionId) {
  return request({
    url: '/backstage/maintain/' + inspectionId,
    method: 'get'
  })
}

// 修改维护模板列表详情
export function modifyMaintDetails(cqndtInspectionTemplate ) {
  return request({
    url: '/backstage/maintain/',
    method: 'put',
    data: cqndtInspectionTemplate
  })
}

// 新增维护模板
export function addMaintDetails(data) {
  return request({
    url: '/backstage/maintain/',
    method: 'post',
    data
  })
}

// 批量删除巡检模板
export function btchDeletionMaintDetails(data) {
  return request({
    url: '/backstage/maintain/del/' + data,
    method: 'delete'
  })
}

// 删除巡检模板
export function DeleteMaintDetails(data) {
  return request({
    url: '/backstage/maintain/' + data,
    method: 'delete'
  })
}

// 导出巡检模板列表
export function ExportMaintDetails() {
  return request({
    url: '/backstage/maintain/export',
    method: 'get'
  })
}

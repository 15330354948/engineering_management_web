import request from '@/utils/request'

// 查询巡检模板列表
export function tmplLst(query) {
  return request({
    url: '/backstage/inspection/list',
    method: 'get',
    params: query
  })
}

// 获取巡检模板列表详情
export function tmplDetails(inspectionId) {
  return request({
    url: '/backstage/inspection/' + inspectionId,
    method: 'get'
  })
}

// 修改巡检模板列表详情
export function modifyTmplDetails(cqndtInspectionTemplate ) {
  return request({
    url: '/backstage/inspection/',
    method: 'put',
    data: cqndtInspectionTemplate
  })
}

// 新增巡检模板
export function addTmplDetails(data) {
  return request({
    url: '/backstage/inspection/',
    method: 'post',
    data
  })
}

// 批量删除巡检模板
export function btchDeletionTmplDetails(data) {
  return request({
    url: '/backstage/inspection/del/' + data,
    method: 'delete'
  })
}

// 删除巡检模板
export function DeleteTmplDetails(data) {
  return request({
    url: '/backstage/inspection/' + data,
    method: 'delete'
  })
}

// 导出巡检模板列表
export function ExportTmplDetails() {
  return request({
    url: '/backstage/inspection/export',
    method: 'get'
  })
}

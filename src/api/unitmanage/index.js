import request from '@/utils/request'

// 查询单位类别
export function queryUnitCatg(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}

// 查询单位
export function queryUnitList(query) {
  return request({
    url: '/system/dept/listPage',
    method: 'get',
    params: query
  })
}

// 查询经纬度
export function queryLatAndLon(query) {
  return request({
    url: 'http://api.tianditu.gov.cn/administrative',
    method: 'get',
    params: query
  })
}

// 图片上传
export function uploadImg(data) {
  return request({
    url: '/upload',
    method: 'post',
    data
  })
}

// 类别获取
export function getCatg() {
  return request({
    url: '/system/dept/selectDeptTypeList',
    method: 'get'
  })
}

// 新增单位
export function newUnit(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data
  })
}

// 图片获取
export function getAvatar(fileId) {
  return request({
    url: '/getFile/' + fileId,
    method: 'get',
  })
}

// 修改单位
export function EditUnit(data) {
  return request({
    url: '/system/dept',
    method: 'put',
    data
  })
}

// 删除单位
export function deleteUnit(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}

// 多选删除单位
export function multChoiceDeleteUnit(deptIds) {
  return request({
    url: '/system/dept/' + deptIds,
    method: 'delete'
  })
}

// 资质上传列表查询
export function qualificationUploadLstQuery(deptId) {
  return request({
    url: '/backstage/qualifications/' + deptId,
    method: 'get'
  })
}


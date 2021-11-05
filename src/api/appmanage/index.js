import request from '@/utils/request'

// 查询App版本列表
export function AppManagement(query) {
  return request({
    url: '/backstage/version/list',
    method: 'get',
    params: query
  })
}

// APP文件上传
export function uploadAppFile(data) {
  return request({
    url: '/upload',
    method: 'post',
    data
  })
}

// 新增APP版本
export function newAppVer(data) {
  return request({
    url: '/backstage/version',
    method: 'post',
    data
  })
}

// 获取APP版本详情
export function getAppVerDetails(versionId) {
  return request({
    url: '/backstage/version/' + versionId,
    method: 'get'
  })
}

// 修改APP版本
export function modifyAppVer(data) {
  return request({
    url: '/backstage/version',
    method: 'put',
    data
  })
}

// 单选删除APP
export function singleselectDelApp(versionId) {
  return request({
    url: '/backstage/version/' + versionId,
    method: 'delete',
  })
}

// 多选删除APP
export function multiselectDelApp(versionIds) {
  return request({
    url: '/backstage/version/del/' + versionIds,
    method: 'delete',
  })
}
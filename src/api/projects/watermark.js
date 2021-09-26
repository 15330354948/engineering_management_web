import request from '@/utils/request'
// 查询水印列表
export function listWatermark(query) {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params: query
  })
}
// 查询水印详细
export function getWatermark(watermarkId) {
  return request({
    url: '/system/post/' + watermarkId,
    method: 'get'
  })
}

// 新增水印
export function addWatermark(data) {
  return request({
    url: '/system/post',
    method: 'post',
    data: data
  })
}

// 修改水印
export function updateWatermark(data) {
  return request({
    url: '/system/post',
    method: 'put',
    data: data
  })
}

// 删除水印
export function delWatermark(watermarkId) {
  return request({
    url: '/system/post/' + watermarkId,
    method: 'delete'
  })
}

// 导出水印
export function exportWatermark(query) {
  return request({
    url: '/system/post/export',
    method: 'get',
    params: query
  })
}
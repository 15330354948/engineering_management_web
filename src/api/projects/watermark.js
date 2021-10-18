import request from '@/utils/request'
// 查询水印列表
export function listWatermark(query) {
  return request({
    url: '/backstage/watermark/list',
    method: 'get',
    params: query
  })
}
// 查询水印详细
export function getWatermark(watermarkId) {
  return request({
    url: '/backstage/watermark/' + watermarkId,
    method: 'get'
  })
}

// 新增水印
export function addWatermark(data) {
  return request({
    url: '/backstage/watermark',
    method: 'post',
    data: data
  })
}

// 修改水印
export function updateWatermark(data) {
  return request({
    url: '/backstage/watermark',
    method: 'put',
    data: data
  })
}

// 删除水印
export function delWatermark(watermarkId) {
  return request({
    url: '/backstage/watermark/' + watermarkId,
    method: 'delete'
  })
}

// 导出水印
export function exportWatermark(query) {
  return request({
    url: '/backstage/watermark/export',
    method: 'get',
    params: query
  })
}
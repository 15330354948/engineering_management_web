import request from '@/utils/request'
// 获取省市区
export function listArea() {
    return request({
      url: '/treeselect',
      method: 'get',
    })
}
// 查询文件
export function getFile(fileId) {
  return request({
    url: '/getFile/' + fileId,
    method: 'get',
  })
}
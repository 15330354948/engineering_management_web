import request from '@/utils/request'
export function listArea() {
    return request({
      url: '/treeselect',
      method: 'get',
    })
  }
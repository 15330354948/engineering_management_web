import request from '@/utils/request'
// 查询项目列表
export function listProject(query) {
    return request({
      url: '/monitor/job/list',
      method: 'get',
      params: query
    })
  }
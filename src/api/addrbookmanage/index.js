import request from '@/utils/request'

// 查询单位列表
export function lstOfUnits() {
  return request({
    url: '/system/dept/listPage',
    method: 'get'
  })
}

// 查询通讯录列表
export function addrBookLst(query) {
  return request({
    url: '/backstage/cqndtAddressBook',
    method: 'get',
    params: query
  })
}

// 新增通讯录
export function addAddrBook(data) {
  return request({
    url: '/backstage/cqndtAddressBook',
    method: 'post',
    data
  })
}

// 更新通讯录
export function updateAddrBook(data) {
  return request({
    url: '/backstage/cqndtAddressBook',
    method: 'put',
    data
  })
}

// 删除通讯录
export function deleteAddrBook(bookIds) {
  return request({
    url: '/backstage/cqndtAddressBook/' + bookIds,
    method: 'delete'
  })
}
import request from '@/utils/request'
// 查询项目列表
export function listProject(query) {
  return request({
    url: '/backstage/project/list',
    method: 'get',
    params: query
  })
}

//新增项目信息
export function addProject(obj) {
  return request({
    url: '/backstage/project',
    method: 'post',
    data: obj
  })
}

// 修改项目信息
export function updateProject(obj) {
  return request({
    url: '/backstage/project',
    method: 'put',
    data: obj
  })
}

// 删除项目信息
export function delProject(ids) {
  return request({
    url: '/backstage/project/' + ids,
    method: 'delete'
  })
}

// 获取项目详细信息
export function infoProject(id) {
  return request({
    url: '/backstage/project/' + id,
    method: 'get'
  })
}

// 项目导出
export function exportProject(query) {
  return request({
    url: '/backstage/project/export',
    method: 'get',
    params: query
  })
}


// 获取行政区
export function getArea() {
  return request({
    url: '/treeselect',
    method: 'get'
  })
}

// 查询子项目列表
export function listSubProject(query) {
  return request({
    url: '/backstage/subProject/list',
    method: 'get',
    params: query
  })
}

// 获取资料文件
export function listDataFile(query) {
  return request({
    url: '/backstage/dataFile/list',
    method: 'get',
    params: query
  })
}
// 资料文件新增
export function addDataFile(obj) {
  return request({
    url: '/backstage/dataFile',
    method: 'post',
    data: obj
  })
}

// 资料文件修改
export function eidtDataFile(obj) {
  return request({
    url: '/backstage/dataFile',
    method: 'put',
    data: obj
  })
}

// 获取资料文件信息
export function infoDataFile(id) {
  return request({
    url: '/backstage/dataFile/' + id,
    method: 'get'
  })
}
// 删除资料文件
export function delDataFile(id) {
  return request({
    url: '/backstage/dataFile/' + id,
    method: 'delete'
  })
}

// 获取维护管理列表
export function listMaintain(query) {
  return request({
    url: '/backstage/maintain/list',
    method: 'get',
    params: query
  })
}

// 获取维护模板详细信息
export function infoMaintain(id) {
  return request({
    url: '/backstage/maintain/' + id,
    method: 'get'
  })
}

// 子项目新增
export function addSubProject(obj) {
  return request({
    url: '/backstage/subProject',
    method: 'post',
    data: obj
  })
}

// 子项目修改
export function editSubProject(obj) {
  return request({
    url: '/backstage/subProject',
    method: 'put',
    data: obj
  })
}

// 子项目详情
export function infoSubProject(id) {
  return request({
    url: '/backstage/subProject/' + id,
    method: 'get'
  })
}

// 删除子项目
export function delSubProject(ids) {
  return request({
    url: '/backstage/subProject/' + ids,
    method: 'delete'
  })
}
// 子项目导出
export function exportSubProject(query) {
  return request({
    url: '/backstage/subProject/export',
    method: 'get',
    params: query
  })
}

// 获取文件
export function getFIleInfo(ids) {
  return request({
    url: 'getFileList/' + ids,
    method: 'get'
  })
}

// 获取公司下拉树列表
export function getTreeselect(query) {
  return request({
    url: '/system/dept/treeselect',
    method: 'get',
    params: query
  })
}
// 根据公司编号获取详细信息
export function getCompanyInfo(id) {
  return request({
    url: 'system/dept/' + id,
    method: 'get',
  })
}


// 测点新增
export function addSpot(obj) {
  return request({
    url: '/backstage/spot',
    method: 'post',
    data: obj
  })
}

// 测点查询
export function listSpot(query) {
  return request({
    url: '/backstage/spot/list',
    method: 'get',
    params: query
  })
}

// 获取测点信息详细信息
export function infoSpot(id) {
  return request({
    url: '/backstage/spot/' + id,
    method: 'get',
  })
}


// 测点删除
export function deleteSpot(ids) {
  return request({
    url: '/backstage/spot/' + ids,
    method: 'delete',
  })
}

// 查询项目分配信息
export function getDistribution(id) {
  return request({
    url: '/backstage/project/getDistribution/' + id,
    method: 'get',
  })
}

// 查询施工人员
export function getPerson(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 修改项目分配人员
export function editPerson(query) {
  return request({
    url: '/backstage/project/distribution',
    method: 'put',
    data: query
  })
}


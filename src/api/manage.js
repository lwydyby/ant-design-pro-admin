import { axios } from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permissionNoPager: '/role/getAllPermission',
  orgTree: '/menu/tree',
  menu: '/menu',
  route: '/route',
  enableRole:'/role/enableRole',
  disableRole:'/role/disableRole',
  enableUser:'/user/enableUser',
  disableUser:'/user/disableUser',
  getAllRole:'/role/getAll',
  info:'/user/info'
}

export default api

export function getUserInfo() {
  return axios({
    url: api.info,
    method: 'get',

  })
}


export function getAllRole(parameter) {
  return axios({
    url: api.getAllRole,
    method: 'get',
    params: parameter
  })
}

export function getRouteInfo(parameter) {
  return axios({
    url: api.route,
    method: 'get',
    params: parameter
  })
}

export function saveRoute(data) {
  return axios({
    url: api.route,
    method: 'post',
    data: data
  })
}
export function saveMenu(data) {
  return axios({
    url: api.menu,
    method: 'post',
    data: data
  })
}

export function getMenuInfo(parameter) {
  return axios({
    url: api.menu,
    method: 'get',
    params: parameter
  })
}
export function getUserList (parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissionsNoPager (parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}
export function saveRole (parameter) {
  return axios({
    url: api.role,
    method: 'post',
    data: parameter
  })
}

export function deleteRole (parameter) {
  return axios({
    url: api.role+"?id="+parameter.id,
    method: 'delete'
  })
}

export function enableRole (parameter) {
  return axios({
    url: api.enableRole+"?id="+parameter.id,
    method: 'put'
  })
}

export function disableRole (parameter) {
  return axios({
    url: api.disableRole+"?id="+parameter.id,
    method: 'put'
  })
}


export function saveUser (parameter) {
  return axios({
    url: api.user,
    method: 'post',
    data: parameter
  })
}

export function deleteUser (parameter) {
  return axios({
    url: api.user+"?id="+parameter.id,
    method: 'delete'
  })
}

export function enableUser (parameter) {
  return axios({
    url: api.enableUser+"?id="+parameter.id,
    method: 'put'
  })
}

export function disableUser (parameter) {
  return axios({
    url: api.disableUser+"?id="+parameter.id,
    method: 'put'
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

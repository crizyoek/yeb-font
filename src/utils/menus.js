import {getRequest} from "./api";
import Home from '../views/Home'

export const initMenu = (router, store) => {
  if (store.state.routes.length > 0) {
    return;
  }

  getRequest('/system/cfg/menu').then(res => {
    if (res) {
      // 格式化好的数据
      let fmtRoutes = formatRoutes(res.obj)
      // 添加到路由
      router.addRoutes(fmtRoutes)
      // 将数据存入vuex
      store.commit('initRoutes', fmtRoutes)
    }
  })
}

export const formatRoutes = (routes) => {
  let fmtRoutes = [];
  routes.forEach(item => {
    let {
      path,
      component,
      name,
      iconCls,
      children,
    } = item
    if (children && children instanceof Array) {
      // 递归
      children = formatRoutes(children)
    }
    let fmRouter = {
      path: path,
      name: name,
      iconCls: iconCls,
      children: children,
      // 懒加载路由
      component(resolve) {
        if (component.startsWith('Home')) {
          require(['../views/' + component + '.vue'], resolve);
        } else if (component.startsWith('Athletes')) {
          require(['../views/athletes_info/' + component + '.vue'], resolve);
        } else if (component.startsWith('Competition')) {
          require(['../views/competition_info/' + component + '.vue'], resolve);
        } else if (component.startsWith('Organization')) {
          require(['../views/organization_info/' + component + '.vue'], resolve);
        } else if (component.startsWith('Record')) {
          require(['../views/standard-record_info/' + component + '.vue'], resolve);
        } else if (component.startsWith('Sys')) {
          require(['../views/system_management/' + component + '.vue'], resolve);
        }
      }
    }
    fmtRoutes.push(fmRouter)
  });
  return fmtRoutes
}

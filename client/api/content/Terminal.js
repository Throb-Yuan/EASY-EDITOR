/**
 * @file: Terminal.
 * @authors: hjhl.
 * @createDate: 2022.
 * @Description: 终端管理
 */
 import request from '@/service/httpServer'

      /**
       * 添加终端
       * @author: hjhl
       * @createDate: 2022
       * @param data {Object} 参数
       */
      export function terminalAdd(data) {
        return request({
          url: '/content/terminal/add',
          method: 'post',
          data
        })
      }

      /**
       * 获取终端组下终端列表
       * @author: hjhl
       * @createDate: 2022
       * @param data {Object} 参数
       */
      export function terminalByGroupListGet(data) {
        return request({
          url: '/content/terminal/by/group/list/get',
          method: 'post',
          data
        })
      }

      /**
       * 删除终端
       * @author: hjhl
       * @createDate: 2022
       * @param data {Object} 参数
       */
      export function terminalDelete(data) {
        return request({
          url: '/content/terminal/delete',
          method: 'post',
          data
        })
      }

      /**
       * 获取终端详情
       * @author: hjhl
       * @createDate: 2022
       * @param data {Object} 参数
       */
      export function terminalDetailGet(data) {
        return request({
          url: '/content/terminal/detail/get',
          method: 'post',
          data
        })
      }

      /**
       * 获取终端组列表
       * @author: hjhl
       * @createDate: 2022
       * @param data {Object} 参数
       */
      export function terminalDetailListGet(data) {
        return request({
          url: '/content/terminal/detail/list/get',
          method: 'post',
          data
        })
      }

      /**
       * 获取终端树列表
       * @author: hjhl
       * @createDate: 2022
       * @param data {Object} 参数
       */
      export function terminalTreeListGet(data) {
        return request({
          url: '/content/terminal/tree/list/get',
          method: 'post',
          data
        })
      }


      /**
       * 添加终端组
       * @author: hjhl
       * @createDate: 2022
       * @param data {Object} 参数
       */
      export function terminalGroupAdd(data) {
        return request({
          url: '/content/terminal/group/add',
          method: 'post',
          data
        })
      }

      /**
       * 添加终端组与应用的关系
       * @author: hjhl
       * @createDate: 2022
       * @param data {Object} 参数
       */
      export function terminalGroupAppAdd(data) {
        return request({
          url: '/content/terminal/group/app/add',
          method: 'post',
          data
        })
      }

      /**
       * 获取终端组与应用的关系
       * @author: hjhl
       * @createDate: 2022
       * @param data {Object} 参数
       */
      export function terminalGroupAppListGet(data) {
        return request({
          url: '/content/terminal/group/app/list/get',
          method: 'post',
          data
        })
      }

      /**
       * 删除终端组
       * @author: hjhl
       * @createDate: 2022
       * @param data {Object} 参数
       */
      export function terminalGroupDelete(data) {
        return request({
          url: '/content/terminal/group/delete',
          method: 'post',
          data
        })
      }

      /**
       * 获取终端组列表
       * @author: hjhl
       * @createDate: 2022
       * @param data {Object} 参数
       */
      export function terminalGroupListGet(data) {
        return request({
          url: '/content/terminal/group/list/get',
          method: 'post',
          data
        })
      }

      /**
       * 编辑终端组
       * @author: hjhl
       * @createDate: 2022
       * @param data {Object} 参数
       */
      export function terminalGroupUpdate(data) {
        return request({
          url: '/content/terminal/group/update',
          method: 'post',
          data
        })
      }

      /**
       * 编辑终端
       * @author: hjhl
       * @createDate: 2022
       * @param data {Object} 参数
       */
      export function terminalUpdate(data) {
        return request({
          url: '/content/terminal/update',
          method: 'post',
          data
        })
      }

/*
1页面被打开的时候 onShow   
  0onShow不同图onLoad 无法在形参上接收 options参数
  0.5判断缓存中有没有token
    1没有 直接跳转到授权页面
    2有 直接往下进行
  1获取url上的参数type 
  2根据type来决定页面标题的数组元素 哪个被激活选中
  2根据type 区发送请求 获取订单数据
  3渲染页面
2点击不同的标题 重新发送请求和渲染数据
*/

import { request } from "../../request/index.js"; //补全路径
import regeneratorRuntime from "../../lib/runtime/runtime.js"; //es6的async请求书据最终方案
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [{
      id: 0,
      value: "全部",
      isActive: true
    },
    {
      id: 1,
      value: "待付款",
      isActive: false
    },
    {
      id: 2,
      value: "待发货",
      isActive: false
    },
    {
      id: 3,
      value: "退款/退货",
      isActive: false
    }
    ]
  },
  onShow(options) {
    // 判断缓存中有没有token
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      });
      return;
    }
    // 1获取当前小程序的页面栈-数组 长度最大是10页面 同时打开页面最多10个 
    // 2数组中 索引最大的页面就是当前的页面
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    // 3获取url上的type参数
    const { type } = currentPage.options;
    // 4激活选中页面标题
    // 激活选中页面标题 type=1 index=0
    this.changeTitleByIndex(type - 1);//页面打开时渲染标题
    this.getOrders();
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: '/my/orders/all', data: type });
    console.log(res);
    this.setData({
      orders: res.orders
    })
  },

  // 1根据标题的索引来激活选中 标题数组
  changeTitleByIndex(index) {
    // 修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs //返回新数组给子组件
    })
  },
  handleTabsItemChange(e) {//页面改变时渲染
    // 获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    // 2重新发送请求 type=1 index=0 
    this.getOrders(index+1);
  }
})
// 引入请求js文件
import { request } from "../../request/index.js"; //补全路径
import regeneratorRuntime from "../../lib/runtime/runtime.js"; //es6的async请求书据最终方案
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: '',
    floorList: ''
  },
  // 请求swiper数据
  // async要加在请求函数的前面
  async getswiperList() {
    // 通过async优化请求
    const res = await request({ url: "/home/swiperdata" });
    console.log(res)
    this.setData({
      swiperList: res
    })
  },
  // 请求楼层数据
  async getfloorList() {
    // 通过async优化请求
    const res = await request({ url: "/home/floordata" });
    this.setData({
      floorList: res
    })
    console.log(this.data.floorList)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 调用数据请求
  onLoad: function (options) {
    this.getswiperList();
    this.getfloorList();
  },
  onPullDownRefresh() {
    this.data.floorList = [];
    this.data.swiperList = [];
    this.getswiperList();
    this.getfloorList();
    wx.stopPullDownRefresh()
  }
})
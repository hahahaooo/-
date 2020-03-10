// 引入请求js文件
import { request } from "../../request/index.js"; //补全路径
import regeneratorRuntime from "../../lib/runtime/runtime.js"; //es6的async请求书据最终方案
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [], // 左侧的菜单数据
    rightContent: [],
    currentIndex: 0,
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [], //公共的
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCates();
    // {time:Date.now(),data:[...]}
    // 判断有没有旧的数据，没有直接发送请求，有旧的数据并且没有过期继续使用即可
    // 获取本地存储的数据
    const Cates = wx.getStorageSync("cates");
    // 判断
    if (Cates) {
      this.getCates()
    } else {
      // 有旧的数据 定义国企时间 10s改成5分钟
      if (Date.now() - Cates.time > 1000 * 10) { //过期了
        // 重新发送请求
        this.getCates();
      } else {
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name)
        let rightContents = this.Cates[0].children;
        this.setData({
          leftMenuList: leftMenuList,
          rightContent: rightContents
        })
      }
    }
  },
  async getCates() {
    const res = await request({ url: "/categories" });
    this.Cates = res;
    console.log(this.Cates)
    // 把数据存入到本地储存中
    wx.setStorageSync("cates", {
      time: Date.now(),
      data: this.Cates
    });
    // 构造左侧大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name)
    // 右侧数据
    let rightContents = this.Cates[0].children;
    this.setData({
      leftMenuList: leftMenuList,
      rightContent: rightContents
    })

  },
  // 左側點擊事件，更新相應的數據
  handelTab(e) {
    let index = e.currentTarget.dataset.index
    // 右侧数据
    let rightContents = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent: rightContents,
      scrollTop: 0
    })
  }
})
// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    collectNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取到缓存中的数组
    const userInfo = wx.getStorageSync("userInfo");
    if (!userInfo.avatarUrl) {
      // 没有
      wx.navigateTo({
        url: '/pages/login/login'
      });
    } else {
      this.setData({userInfo})
    }
  },
  onShow: function (options) {
    // 获取缓存中的userInfo
    const userInfo = wx.getStorageSync("userInfo")||{};
    let collect = wx.getStorageSync("collect") || [];
    this.setData({ userInfo,collectNum: collect.length })
  }
})
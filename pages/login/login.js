// pages/login/login.js
Page({
  onLoad: function (options) {

  },
  // 获取用户信息并返回user用户页面
  handleGetUserInfo(e) {
    const { userInfo } = e.detail;
    wx.setStorageSync("userInfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  }
})
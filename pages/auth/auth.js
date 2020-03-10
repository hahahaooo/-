import { login } from "../../utils/asyncWx.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
import { request } from "../../request/index.js"
Page({
  /**
   * 获取用户信息
   */
  async handleGetUserInfo(e) {
    try {
      // 1获取用户信息 后台规定 params
      const { encryptedData, iv, rawData, signature } = e.detail;
      // 2获取小程序登录成功后的code
      const { code } = await login();
      const loginParams = { encryptedData, iv, rawData, signature, code };
      // 3发送请求 获取用户的token
      // const token = await request({ url: '/users/wxlogin', data: loginParams, method: "post" });
      const token = "自定义的token dongcidacidongcidaci";
      // 4把token存入缓存中 同时跳转到上一个页面
      wx.setStorageSync("token", token);
        wx.navigateBack({
          //1表示返回上一层，2就上两层
          delta: 1
        });
    } catch (error) {
      console.log(error);

    }
  }
})
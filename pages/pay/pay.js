/*
1页面加载的时候
  1从缓存中获取购物车数据 渲染到页面中
  这些数据 checked=true
2微信支付
  1哪些人 哪些账号 可以实现微信支付
    1.1企业账号
    1.2企业账号的小程序后台中 必须 给开发者 添加上白名单
      一个appid可以同时绑定多个开发者
      这些开发者就可以用这个appid 和他的开发权限
3支付按钮
  1先判断缓存中有没有token
  2没有 跳转到授权页面 进行获取token
  3有token
  4获取订单编号
  5完成微信支付了
  6手动删除换卒年中 已经被转中了的商品
  7删除后的购物车数据 填充回缓存中 
  8再跳转页面
*/
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
import request from "../../request/index.js"
Page({
  data: {
    address: {},
    checkedCart: [],//筛选
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1获取缓存中的收货地址
    const address = wx.getStorageSync("address", address);
    // 获取缓存中购物车的数据
    const cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组  filter返回符合条件的数组
    const checkedCart = cart.filter(v => v.checked);
    // 3计算总价格 和总数量
    let totalPrice = 0;
    let totalNum = 0;
    checkedCart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    this.setData({
      checkedCart, totalPrice, totalNum, address
    })
  },
  // 点击支付
  async handleOrderPay() {
    try {
      const token = wx.getStorageSync("token");
      // 1判断缓存中有没有token
      // 2判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/auth',
        });
        return;
      }

      // 3创建订单 
      // 3.1准备 请求头函数
      // const header = { Authorization: token };//设置到了公共请求js文件里
      // 3.2准备 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.checkedCart;

      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))

      const orderParams = { order_price, consignee_addr, goods }

      // 4准备发送请求 创建订单 获取订单编号
      // const res=await request({url:"/order/creat",method:"POST",data:orderParams});   
      const orderNum = 89032490101949384917947;//自定义订单编号 
      console.log(orderNum);

      // 5发起 预支付 接口
      // pay 返回微信调起支付接口的参数 pay:{nonceStr,package,paySign,signType,timeStamp}
      const { pay } = await request({ url: '/my/orders/req_unifiedorder', method: "POST", data: orderNum });

      // 6直接发起微信支付
      await requestPayment(pay);
      console.log("支付结果");

      // 7查询后台  订单状态
      console.log("支付状态");
      const res = await request({ url: '/my/orders/chkUrder', method: "POST", data: orderNum });
      await showToast("支付成功")

      // 手动删除缓存中已经支付了的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);//留下未被选中的
      wx.setStorageSync("cart", newCart);

      // 8支付成功后跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order?type=1'
      });

    } catch (error) {
      // 没有真实的服务器，只能这么做
      // ------------------------
      // 8支付成功后跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order?type=1'
      });

      // 手动删除缓存中已经支付了的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);//留下未被选中的
      wx.setStorageSync("cart", newCart);
      //  this.setData({checkedCart:newCart});
      // ----------------------------
      await showToast("支付失败")
      console.log(error);
    }
  }
})












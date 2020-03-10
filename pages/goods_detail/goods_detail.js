/* 
1 发送请求获取数据
2 点击轮播图 预览大图功能
  1 给轮播图绑定点击事件
  2 调用小程序的api previewImage
3 点击 加入购物车
  1先绑定点击事件
  2获取缓存中的购物车数据 数组格式
  3先判断 当前的商品是否已经存在
  4存在 修改商品数据 执行购物车数量++ 重新把购物车数组填充会缓存中
  5不存在于购物车数组中 
  直接给购物车数组添加一个新的元素 带上购买数量num 重新把购物车数组填充会缓存中
  6弹出提示
4商品收藏
  1页面onShow的时候 加载缓存中的商品收藏数据
  2判断当前商品是不是被收藏
    1是 改变页面的图标
    2不是 。。
  3点击商品收藏按钮
    1判断该商品是否存在于缓存数组中
    2已经存在 把该商品删除
    3没有存在 把商品添加到收藏数组中 存入到缓存中即可
  */
// 引入请求js文件
import { request } from "../../request/index.js"; //补全路径
import regeneratorRuntime from "../../lib/runtime/runtime.js"; //es6的async请求书据最终方案
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏过
    isCollect: false
  },
  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  // onShow方便页面切换
  onShow: function () {
    let Pages = getCurrentPages();//页面栈
    let currentPages = Pages[Pages.length - 1];//索引最大的就是当前的页面
    let option = currentPages.options;
    console.log(option);
    const { goods_id } = option;

    this.getGoodsDetail(goods_id);
  },
  // 获取商品的详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
    this.GoodsInfo = goodsObj;

    // 1获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2判断当前的商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    // some找到一个符合条件的就返回true
    this.setData({
      // 简化数组里的属性,data只存放用得到的属性，但是现在太多用不到的，无形中导致小程序变得比较卡
      // 优化渲染的属性
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机不识别webp图片格式
        // 最好找到后台进行修改 
        // 临时自己改 后台存在1.webp=1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
    console.log(this.data.goodsObj)
  },
  //点击轮播图 放大预览
  handlePreviewImage(e) {
    // 1构造要预览图片的数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },
  // 加入购物车
  handleCartAdd() {
    // 1获取缓存中的购物车 数组
    let cart = wx.getStorageSync("cart") || [];
    // 2判断 
    /*findIndex() 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。
        findIndex() 方法为数组中的每个元素都调用一次函数执行:
    当数组中的元素在测试条件时返回 true 时, findIndex() 返回符合条件的元素的索引位置，
    之后的值不会再调用执行函数。
    如果没有符合条件的元素返回 -1*/
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 3不存在第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 4已经存在购物车数组中 执行 num++
      cart[index].num++;
    }
    // 5把购物车重新添加到缓存中
    wx.setStorageSync("cart", cart);
    // 6弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true 防止用户手抖点击多次
      mask: true,
    });
  },
  // 商品收藏按钮
  handleCollect() {
    let isCollect = null;
    // 1获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 3当index！=-1 已经收藏过了
    if (index !== -1) {//!==-1 不能写!===
      // 4能找到 已经收藏过了 在数组中删除改商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消收藏成功',
        icon: 'success',
        mask: true
      });
    } else {
      // 5没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    // 6添加到缓存中
    wx.setStorageSync("collect", collect);
    // 7修改data中的isCollect
    this.setData({ isCollect });
  }
})
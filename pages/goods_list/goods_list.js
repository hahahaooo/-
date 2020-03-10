/*1用户上滑页面 滚动条触底 加载下一页数据
    1 找到滚动条触底事件,官方开发文档
    2 判断还有没有下一页数据,
      1获取总页数=Math.ceil(总条数/页容量)
        当前页码 pagenum
      2判断当前页码是否大于等于总页数
        大于等于表示没有下一页数据
    3 假如没有下一页数据 弹出一个提示
    4 还有下一页,加载下一页数据
      1当前的页码++
      2重新发送请求
      3数据回来了 要对data中的数组进行拼接 而不是全部替换！！！

  2下拉刷新页面
    1触发下拉刷新事件 页面json文件中开启一个配置项
    找到触发下拉事件
    2重置 数据 数组 
    3重置页码 设置为1
    4重新发送请求
    5数据回来了 手动关闭等待效果
*/
// 引入请求js文件
//补全路径
import { request } from "../../request/index.js";
//es6的async请求书据最终方案
import regeneratorRuntime from "../../lib/runtime/runtime.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      value: "综合",
      isActive: true
    },
    {
      id: 0,
      value: "销量",
      isActive: false
    },
    {
      id: 0,
      value: "价格",
      isActive: false
    }
    ],
    goodsLists: []
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "", //分类的cid
    pagenum: 1, //当前页码
    pagesize: 10 //一次获取数据的数量
  },
  // 总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },
  // 获取商品列表数据,数据从底部拼接上来
  async getGoodsList() {
    const res = await request({ url: "/goods/search",data:this.QueryParams});
    const total = res.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    console.log(this.totalPages);
    
    // console.log(this.totalPages)
    this.setData({
      // 拼接数组
      goodsLists: [...this.data.goodsLists, ...res.goods]
    })
    // 关闭下拉刷新的窗口 没有调用下拉窗口关闭也不会报错     
    wx.stopPullDownRefresh();
  },
  /*------------------------------------------------------------------------*/
  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // 获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs //返回新数组给子组件
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      // 重置数组
      goodsLists: []
    })
    // 重置页码
    this.QueryParams.pagenum = 1;
    // 发送请求
    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //  判断有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页
      wx.showToast({
        title: '没有数据了呀',
      })
    } else {
      // 还有下一页
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
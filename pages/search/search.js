/*
1输入框绑定 值改变事件
  1获取到输入框的值
  2合法性判断
  3校验通过 把输入框的值 发送到后台
  4返回的数据打印到页面上
2防抖 (防止抖动) 定时器 节流
  0 防抖 一般 在输入框中 防止重复输入 重复发送啊请求
  1节流 一般是用在页面的下拉和上拉 
  1定义一个全局的定时器id
*/
import { request } from "../../request/index.js";
//es6的async请求书据最终方案
import regeneratorRuntime from "../../lib/runtime/runtime.js";
Page({
  data: {
    goods:[],
    // 取消 按钮 是否显示
    isFocus:false,
    // 输入框的值
    inputValue:''
  },
  TimeId:-1,
  // 输入框的值触发的事件变 就会
  handleInput(e) {
    // 1获取输入框的值
    const { value } = e.detail;
    // 2检测合法性 判断是否为空
    if (!value.trim()) {
      // 输入框没有值 清空数据 隐藏取消按钮
      this.setData({
        goods:[],
        isFocus:false
      })
      return;
    }
    // 有值 按钮显示
    this.setData({isFocus:true})
    // 3准备发送请求 清除上依次输入的定时器 再创建一个定时器
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(() => {
      this.qsearch(value)
    }, 1000);
   
  },
  // 发送请求获取搜索建议 数据
  async qsearch(query) {
    const res = await request({ url:"/goods/qsearch", data:{query}});
    this.setData({goods:res})
    console.log(res);
  },
  // 按钮 点击清空数据 隐藏按钮 
  handleCancle(){
    this.setData({
      inputValue:"",//输入框的值
      isFocus:false,//按钮
      goods:[]//数据
    })
  }
})
/**
 * 1点击“+” 触发tap点击事件
 *  1调用小程序内置的 选择图片 api 
 *  2获取到 图片的路径
 *  3把这些图片路径 存到 data变量中
 *  4页面就可以根据 图片数组 循环显示  自定义
 *2点击自定义的元素 组件
    1获取被点击的元素的索引
    2获取data中的图片数组
    3根据索引在数组中删除对应的元素
    4重新设置回dada中
  3点击 提交
    1获取文本域的内容 类似输入框的获取
      1data定义变量 表示 输入框内容
      2文本域 绑定 输入事件 事件触发的时候 把输入框的值 存入到变量中
    2对这些内容 合法验证
    3验证通过 用户选择的图片 上传到 专门的图片服务器 返回图片外网的链接
    4 文本域 和外网图片的路径 一起提交到服务器 前端模拟 不会发送到后台请求
    5清空当前页面
    6返回上一页
 */
Page({
  data: {
    tabs: [{
      id: 0,
      value: "体验问题",
      isActive: true
    },
    {
      id: 0,
      value: "商品、商家投诉",
      isActive: false
    }
    ],
    // 被选中的图片路径数组
    chooseImages: [],
    textVal:''
  },
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
  // 点击加号 选择图片事件
  handleChooseImg() {
    // 调用小程序内置的选择图片的api
    wx.chooseImage({
      // 同时选中图片的数量
      count: 9,
      // 图片的格式 原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 图片数组 进行拼接
          chooseImages:[...this.data.chooseImages, ...result.tempFilePaths]
        })        
      }
    });
  },
  // 点击删除图片
  handleDeleteImg(e){
    // 1获取被点击的组件的索引
    let {index}=e.currentTarget.dataset;
    // 2获取源数组
    let chooseImages=this.data.chooseImages;

    chooseImages.splice(index,1);
    this.setData({
      chooseImages
    })
  },
  // 文本域的输入事件
  handleTextInp(e){
    this.setData({
      textVal:e.detail.value
    })
  }
})
// 同时发送异步代码的次数
let ajaxTimes = 0;
// 请求格式
export const request = (params) => {
  // 判断url中是否有/my/ 请求的时私有的路径 带上header token
  let header={...params.header};//参数里有header先解构出来修改，不用修改就直接赋值给header
  // let header={} 是固定的，外面有其他请求头的话没有/my/就为空了
    if(params.url.includes("/my/")){
      // 拼接header 带上token
      header['Authorization']=wx.getStorageSync("token");//header[属性名]=属性名的值
    } 
  ajaxTimes++;//一共同步发送了几次
  // 显示加载中效果
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  return new Promise((resolve, reject) => {
    const baseUrl = "https://api.zbztb.cn/api/public/v1"; //提取url里面的公共部分
    wx.request({
      ...params,//修改后的参数放在下面覆盖
      header:header,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;//等于0说明发送完
        if (ajaxTimes === 0) {
          // 关闭正在等待的图标
          wx.hideLoading();
        }

      }
    })
  });
}
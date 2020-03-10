/*
1获取用户的收货地址
  1绑定点击事件
  2调用小程序内置 api 获取用户的收货地址 wx.chooseAddress
2获取 用户 对于当前小程序 获取地址的 权限 状态 scope
  1假设 用户点击获取地址的提示框 确定 authSetting scope.address
  scope 值 true 直接调用 获取收获地址
  2假设 用户从来没有调用过收获地址的api
  scope 值 unddfined 直接调用 获取收获地址
  3假设 用户点击获取地址的提示框 取消 wx.openSetting
  scope 值 false 
    1诱导用户自己打开授权设置页面 当用户重新给予获取获取地址权限时
    2获取收货地址
    4把获取到的收货地址存入到本地存储中
2页面加载完毕
0 onLoad onShow
 1获取本地存储中的地址
 2把数据 设置给data中的一个变量
3onShow
  0回到商品详情页面 第一次添加商品的时候 手动添加了属性
    1num=1;
    2checked=true;
  1获取缓存中的购物车数据
  2把购物车数据 填充到data中
4全选的实现 数据的展示
  1onShow获取缓存中的购物车数组
  2根据购物车中的商品进行计算所有商品都被选中 checked-true 全选都被选中
5 总价格 总数量
  1都需要商品被选中 我们才拿它来计算
  2获取到购物车数组
  3遍历
  4判断商品是否被选中
  5总价格+=商品单价*商品数量
  6总数量+=商品的数量
  7把计算后的价格和数量 设置回data中即可
6商品的选中
  1绑定change事件
  2获取到被修改的商品对象
  3商品对象的选中状态取反
  4重新填充回data中和缓存
  5重新计算全选 总价格 总数量...
7 全选和反选
  1全选复选框 绑定事件change
  2获取data中的全选变量 allChecked
  3直接取反allChecked=!allChecked
  4遍历购物车数组,让里面的购物车商品选中状态跟随 allChecked改变而改变
  5把购物车数组和选中状态都重新你设置回data中 把购物车重新设置回缓存中
8商品数量的编辑
  1"+" "-"按钮 绑定同一个点击属性 区分的关键 自私难以属性
    1"+" "+1"
    2"-" "-1"
  2传递被点击的商品goods_id
  3获取data中的购物车数组 来获取需要被修改的商品对象
    当 购物车中数量 =1 同时点击 "-"
    弹窗提示 wx.showModal 询问用户是否要删除
    1确定 直接执行删除
    2取消 什么都不做
  4直接修改商品对象的数量 num
  5重新设置回data中 把购物车重新设置回缓存中 this.serCart
9点击结算
  1判断有没有收获地址
  2判断有没有选购商品
  3经过以上验证 跳转到 支付页面
*/
// 
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  // 放在onShow里面
  onShow() {
    // 1获取缓存中的收货地址
    const address = wx.getStorageSync("address", address);
    // 获取缓存中购物车的数据
    const cart = wx.getStorageSync("cart") || [];
    // 2计算全选
    // every数组方法 会遍历 会接收一个回调函数 
    // 那么 每一个回调函数都返回true every放法返回值为true,
    // 只要 有一个回调函数返回了false,就不再循环执行,直接返回false
    // 空数组 调用every 返回值就是true
    // const allChecked = cart.length ? cart.every(v => v.checked) : 写foreach里
    this.setData({
      address
    })
    this.setCart(cart);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  // 点击 收货地址正常流程
  // 使用async获取
  async handleChooseAddress() {
    // try { tryCode - 尝试执行代码块}
    // catch(err) {catchCode - 捕获错误的代码块} 
    // finally { finallyCode - 无论 try / catch 结果如何都会执行的代码块}
    try {//管理代码
      // 1获取 权限状态
      const res1 = await getSetting();
      // 2获取权限状态 注意发现一些属性名很怪异的时候 都要用[]形似来获取属性值 并用""包裹起来
      // authSetting["scope.address"]的值
      const scopeAddress = res1.authSetting["scope.address"];
      // 3判断权限状态
      if (scopeAddress === false) {
        // 4用户曾经拒绝过授权权限 诱导用户打开授权页面
        await openSetting();
      }
      // 5调用 收获地址代码
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync("address", address);
    } catch (error) {//铺货错误结果
      console.log(error)
    }
  },
  // 商品的选中
  handleItemChange(e) {
    // 1获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    let { cart } = this.data;
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 封装函数
  // 设置购物车状态 同时 重新计算工具栏数据 全选 总价格 购买数量
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart, totalPrice, totalNum, allChecked
    })
    // 缓存购物车数据
    wx.setStorageSync("cart", cart);
  },
  // 商品的全选功能
  handleItemAllChecked() {
    // 1获取data中的数据
    let { cart, allChecked } = this.data;
    // 2修改值
    allChecked = !allChecked;
    // 3寻魂修改cart数组中的商品选中状态
    // 不能用===
    cart.forEach(v => v.checked = allChecked);//forEach返回修改的数组
    // 4修改后的值设置回data中,或者缓存中
    this.setCart(cart);
  },
  // 商品数量的编辑
  async handleItemEdit(e) {
    // 1获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;//{operation,id}直接赋值相应的名字
    // 2获取购物车数组
    let { cart } = this.data;
    // // 3找到被修改的商品索引
    const index = cart.findIndex(v => v.goods_id === id);
    // console.log(index);

    // 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModal('您是否要删除？');
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 4修改商品的num
      cart[index].num += operation;
      // 5重新设置回data或缓存
      this.setCart(cart);
    }
  },
  // 结算
  async payFor() {
    // 1 判断又没有收货地址
    const { address, totalNum } = this.data;
    if (!address.userName) {
      await showToast('您还没有选择收货地址');
      return;
    }
    // 2判断有没有选购商品
    if (totalNum === 0) {
      await showToast("您还没有选购商品")
      return;
    }
    // 3跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay',
    });
  }
})













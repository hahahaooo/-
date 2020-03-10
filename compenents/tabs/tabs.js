// compenents/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: { //存放接收来自父元素的数据
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e) {
      // 获取索引
      const {index} = e.currentTarget.dataset;
      // 触发父组件中的事件 自定义
      this.triggerEvent("tabsItemChange",{index});
      this.setData({
        currentIndex:index
      })
    }
  }
})
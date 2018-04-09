// pages/myOrder/myOrder.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_tab: 'all',
    no_order: false,
    order_list: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectOrder('SelectAll');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  changeOrderAll: function () {
    this.setData({ select_tab: 'all' });
    this.selectOrder('SelectAll');
  },
  changeOrderAudit: function() {
    this.setData({ select_tab: 'audit' })
    this.selectOrder('Selectdaishenhe');
  },
  changeOrderHandle: function () {
    this.setData({ select_tab: 'handle' })
    this.selectOrder('Selectchulizhong');
  },
  changeOrderBreakup: function () {
    this.setData({ select_tab: 'breakup' })
    this.selectOrder('Selectyiwangjie');
  },
  changeOrderCancel: function () {
    this.setData({ select_tab: 'cancel' })
    this.selectOrder('Selectyizuofei');
  },
  // 全部订单
  selectOrder:function(type) {
    var that = this;
    wx.request({
      url: app.globalData.host + type,
      data: {
        wxweiyiid: app.globalData.wx_code
      },
      method: 'POST',
      success: function(res) {
        if(res.data.d != ']') {
          that.setData({ 
            order_list: JSON.parse(res.data.d),
            no_order: false
          });
        } else {
          that.setData({ 
            order_list: null,
            no_order: true 
            });
        }
      }
    })
  },
  jumpSeeDetail: function(e) {
    var order_code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?code=' + order_code,
    })
  },
  jumpBack: function() {
    wx.switchTab({
      url: '/pages/commodity/commodity',
    })
  }
  
})
// pages/cartSettlement/cartSettlement.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_type: 'send_house',
    select_address: true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取收货人默认地址
    wx.request({
      url: app.globalData.host + 'songdadizhi',
      method: 'POST',
      data: {telephone: app.globalData.user_phone},
      success: function(res) {
        if (JSON.parse(res.data.d) == 0) {
          that.setData({ select_address: false});
        }
      }
    }),
    // 获取数量和总金额
    wx.request({
      url: app.globalData.host + 'total',
      method: 'POST',
      data: { wxweiyiid: app.globalData.wx_code },
      success: function (res) {
        
      }
    })
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
  // 更改配货方式
  changeSendHouse: function() {
    this.setData({ select_type: 'send_house' })
  },
  changeDoorSelf: function () {
    this.setData({ select_type: 'door_self' })
  },
  changeExpress: function () {
    this.setData({ select_type: 'express' })
  },
  changeLogistics: function () {
    this.setData({ select_type: 'logistics' })
  },
  // 提交订单
  confirmOrder: function() {
    wx.showModal({
      title: '',
      content: '是否提交订单?',
      confirmColor: '#F99001',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 跳转到地址页面
  jumpToAddress: function() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  }
})
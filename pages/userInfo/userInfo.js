// pages/userInfo/userInfo.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ user_name: app.globalData.user_phone });
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
  // 跳转到订单页面
  jumpOrder: function() {
    wx.navigateTo({
      url: '/pages/myOrder/myOrder',
    })
  },
  // 跳转到订单页面
  jumpAddress: function() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  // 退出
  signOut: function() {
    app.globalData.user_phone = '';
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }
})
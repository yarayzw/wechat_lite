// pages/orderDetail/orderDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_code: '',
    order_detail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ order_code: options.code });
    var that = this;
    wx.request({
      url: app.globalData.host + 'SelectDetails',
      method: 'POST',
      data: { orderid: that.data.order_code },
      success: function(res) {
        console.log(res);
        if (res.data.d == ']') {
          wx.showLoading({
            title: '订单信息不存在',
            mask: true
          });
          setTimeout(function() {
            wx.hideLoading();
            wx.navigateBack({});
          }, 1500);
        } else {
          var content = JSON.parse(res.data.d);
          console.log(content);
          that.setData({ order_detail: content });
        }
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
  // 返回上一页
  jumpBack: function() {
    wx.navigateBack({
      
    });
  },
  // 取消订单
  cancelOrder: function() {
    var that = this;
    wx.request({
      url: app.globalData.host + 'quxiao',
      method: 'POST',
      data: {
        wxweiyiid: app.globalData.wx_code,
        tel: app.globalData.user_phone,
        shaixuanid: that.data.order_code
      },
      success: function(res) {
        if(res.data.d == 1) {
          wx.showToast({
            title: '取消成功',
            mask: true
          });
          setTimeout(function() {
            wx.hideToast();
            wx.redirectTo({
              url: '/pages/myOrder/myOrder',
            });
          }, 1500);
        } else {
          app.showEroor('取消失败');
        }
      },
       error : function() {
         app.showEroor('取消失败');
       }
    })
  },
  backOrder: function() {
    wx.navigateBack({
      
    });
  }
})
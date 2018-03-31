// pages/address/address.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address_list: null,
    form: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({ form: options.form })
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
    var that = this;
    wx.request({
      url: app.globalData.host + 'addressall',
      method: 'POST',
      data: {
        wxid: app.globalData.wx_code
      },
      success: function (res) {
        if (res.data.d == ']') {
          that.setData({ address_list: null });
        } else {
          that.setData({ address_list: JSON.parse(res.data.d) });
        }
      }
    })
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
  // 跳转到添加页面
  jumpAddAddress: function() {
    wx.navigateTo({
      url: '/pages/editAddress/editAddress?code=' + 0 + '&do_type=add',
    });
  },
  // 跳转到更改页面
  jumpTpEdit: function(e) {
    wx.navigateTo({
      url: '/pages/editAddress/editAddress?code=' + e.currentTarget.dataset.code + '&do_type=update',
    });
  },
  jumpBack: function () {
    wx.navigateBack({

    });
  },
  selectAddress: function(e){ 
    wx.redirectTo({
      url: '/pages/cartSettlement/cartSettlement?address=' + e.currentTarget.dataset.address ,
    })
  }
})
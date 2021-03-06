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
    wx.request({
      url: app.globalData.host + 'Getuserbiaoti',
      method: 'POST',
      data: { tel: app.globalData.user_phone },
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.d
        })
      }
    })
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
      url: '/pages/address/address?form=userInfo',
    })
  },
  // 退出
  signOut: function() {
    // 退出初始化信息 清除缓存
    app.globalData.user_phone = '';
    app.globalData.wx_code = '';
    app.globalData.add_phone = '';
    app.globalData.isCompany = true;
    wx.redirectTo({
      url: '/pages/login/login',
    })
  },
  gengxin: function () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
      if (!res.hasUpdate) {
        wx.showToast({
          title: '已是最新版本',
          icon: 'loading',
          duration: 1500,
          mask: true
        })
      } else {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })

        })
      }
    })
  }
})
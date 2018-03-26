//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_password: false,
    password_data: '',
    username_data:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  // 更改是否显示密码文本
  changeShowPassword: function () {
    this.setData({ show_password: true })
  },
  changeHidePassword: function () {
    this.setData({ show_password: false })
  },
  // 对密码文本进行赋值
  changePassword: function(e) {
    this.setData({ password_data: e.detail.value })
  },
  changeUsername: function(e) {
    this.setData({ username_data: e.detail.value })
  },
  validateLogin: function(e) {
    wx.request({
      url: app.globalData.host + '/ValidateLogin?username=' + this.data.username_data + '&secret=' + this.data.password_data,
      method: 'GET',
      success: function(res) {
        console.log(res);
      },
      error: function(res) {
        console.log(res);
      }
    })
  }
})
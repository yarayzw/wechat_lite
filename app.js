//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  // 获取用户的openid
  getUserOpenId: function () {
    var that = this;
    // 小程序登录 withCredentials 为true
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function(data) {
            that.globalData.userInfo = data.userInfo;
          }
        });
        // 获取openid
        wx.request({
          url: that.globalData.php_host,
          method: 'POST',
          header: {
            'Content-type': 'application/x-www-form-urlencoded',
          },
          data: { 
            code: res.code,
            fun: 'wechatMiniGetOpenId'
            },
          success: function (r) {
            if (r.data.status == 10000) {
              that.globalData.wx_code = r.data.openid;
            } else {
              that.showError('系统错误');
            }
          },
          error: function () {
            that.showError('系统错误');
          }
        })
      }
    })
  },
  showError: function (content) {
    wx.showLoading({
      title: content,
      mask: true
    });
    setTimeout(function () {
      wx.hideLoading()
    }, 1500)
  },
  globalData: {
    userInfo: null,
    host: 'http://211.149.177.232/DataCenterService.asmx/',
    php_host: 'http://211.149.177.232:8008/wechat.php/',
    user_phone: '',
    wx_code: ''
  }
})
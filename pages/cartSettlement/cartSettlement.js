// pages/cartSettlement/cartSettlement.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_type: 'send_house',
    cart_time: '',
    cart_date: '',
    total_num: 0,
    total_money: 0,
    address: '',
    remarks: '',
    dispatching_type: '送货上门'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var now = new Date()
    var year = now.getFullYear(), month = now.getMonth() + 1, day = now.getDate(), hour = now.getHours(), minute = now.getMinutes();
    month = month > 10 ? month : '0' + month; 
    day = day > 10 ? day : '0' + day; 
    hour = hour > 10 ? hour : '0' + hour; 
    minute = minute > 10 ? minute : '0' + minute; 
    var dateStr = [year, month, day].join('-');
    var hourStr = [hour, minute].join(':');
    that.setData({cart_time: hourStr, cart_date: dateStr});
    // 获取收货人默认地址
    if(options.address != undefined) {
      that.setData({ address: options.address });
    } else {
      wx.request({
        url: app.globalData.host + 'songdadizhi',
        method: 'POST',
        data: { telephone: app.globalData.user_phone },
        success: function (res) {
          if (res.data.d != 0) {
            that.setData({ address: res.data.d });
          }
        }
      })
    }
    // 获取数量和总金额
    wx.request({
      url: app.globalData.host + 'total',
      method: 'POST',
      data: { wxweiyiid: app.globalData.wx_code },
      success: function (res) {
        var content = JSON.parse(res.data.d)[0];
        that.setData({ 
          total_num: content.totalnum ? content.totalnum : 0, 
          total_money: content.totalmoney ? content.totalmoney :0 
          });
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
    this.setData({ 
      select_type: 'send_house',
      dispatching_type: '送货上门'
    })
  },
  changeDoorSelf: function () {
    this.setData({ 
      select_type: 'door_self',
      dispatching_type: '上门自取'
    })
  },
  changeExpress: function () {
    this.setData({ 
      select_type: 'express',
      dispatching_type: '快递'
    })
  },
  changeLogistics: function () {
    this.setData({ 
      select_type: 'logistics',
      dispatching_type: '物流'
    })
  },
  // 提交订单
  confirmOrder: function() {
    var that = this;
    wx.showModal({
      title: '',
      content: '是否提交订单?',
      confirmColor: '#F99001',
      success: function (res) {
        if (res.confirm) {
          console.log(app.globalData.userInfo);
          wx.request({
            url: app.globalData.host + 'DoAction',
            method: 'POST',
            data: {
              wxweiyiid: app.globalData.wx_code,
              telephone: app.globalData.user_phone,
              songdashijian: that.data.cart_date + ' ' + that.data.cart_time,
              dizhi: that.data.address, 
              beizhu: that.data.remarks,
              fangshi: that.data.dispatching_type,
              nicheng: app.globalData.userInfo.nickName
            },
            success: function(str) {
              if (str.data.d == 1) {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  mask: true,
                });
                setTimeout(function(){
                  wx.hideToast();
                  wx.navigateTo({
                    url: '/pages/myOrder/myOrder',
                  });
                }, 1500)
              } 
            }
          });
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
  },
  // 修改配送时间
  bindTimeChange: function(e) {
    this.setData({ cart_time: e.detail.value});
  },
  // 修改配送日期
  bindDateChange: function (e) {
    var setVal = e.detail.value;
    var now = new Date()
    var year = now.getFullYear(), month = now.getMonth() + 1, day = now.getDate();
    var dateStr = [year, month, day].join('-');
    if (new Date(dateStr) > new Date(e.detail.value)) {
      app.showError('配送日期错误');
      setVal = dateStr;
    }
    this.setData({ cart_date: setVal });
  },
  // 修改备注内容
  changeRemarks: function(e) {
    this.setData({ remarks: e.detail.value });
  },
  jumpBack:function() {
    wx.navigateBack({
      
    });
  }
  
})
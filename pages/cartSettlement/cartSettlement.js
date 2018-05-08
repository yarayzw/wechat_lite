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
    dispatching_type: '送货上门',
    user_phone: '',
    order_id: '',
    is_company: false,
    user_name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      is_company: app.globalData.isCompany,
      user_phone: app.globalData.add_phone
    });
    var that = this;
    var now = new Date()
    var year = now.getFullYear(), month = now.getMonth() + 1, day = now.getDate(), hour = now.getHours(), minute = now.getMinutes();
    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    var dateStr = [year, month, day].join('-');
    var hourStr = [hour, minute].join(':');
    that.setData({ cart_time: hourStr, cart_date: dateStr });
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
    // 获取收货人默认地址
    // if (options.address != undefined) {
    //   that.setData({ address: JSON.parse(options.address) });
    // } else {
    wx.request({
      url: app.globalData.host + 'getkhaddress',
      method: 'POST',
      data: { custom: app.globalData.add_phone },
      success: function (res) {
        if (res.data.d != 0 && res.data.d != ']') {
          var content = JSON.parse(res.data.d);
          that.setData({ address: content[0]['suidao'] });
        }
        wx.request({
          url: app.globalData.host + 'getkhmingc',
          method: 'POST',
          data: { custom: app.globalData.add_phone },
          success: function (d) {
            if (d.data.d != 0 && d.data.d != ']') {
              var content = JSON.parse(d.data.d);
              that.setData({ user_name: content[0]['xiangmumingcheng'] });
            }
          }
        })
      }
    })
    // }
    // 获取数量和总金额
    wx.request({
      url: app.globalData.host + 'total',
      method: 'POST',
      data: { wxweiyiid: app.globalData.wx_code },
      success: function (res) {
        var content = JSON.parse(res.data.d)[0];
        that.setData({
          total_num: content.totalnum ? content.totalnum : 0,
          total_money: content.totalmoney ? content.totalmoney : 0
        });
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
  // 更改配货方式
  changeSendHouse: function () {
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
  confirmOrder: function () {
    var that = this;
    if (that.data.address == '') {
      app.showError('请选择收货地址');
      return false;
    }
    wx.showModal({
      title: '',
      content: '是否提交订单?',
      confirmColor: '#F99001',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.host + 'DoAction',
            method: 'POST',
            data: {
              wxweiyiid: app.globalData.wx_code,
              telephone: app.globalData.add_phone,
              songdashijian: that.data.cart_date + ' ' + that.data.cart_time,
              dizhi: that.data.address,
              beizhu: that.data.remarks,
              fangshi: that.data.dispatching_type,
              nicheng: app.globalData.userInfo.nickName
            },
            success: function (str) {
              if (str.data.d != 0 && str.data.d != ']') {
                that.setData({
                  order_id: str.data.d
                });
                // 判断支付是否需要支付 wx.request 不支持同步
                wx.request({
                  url: app.globalData.host + 'pangduanzhifu',
                  method: 'POST',
                  data: { telephone: app.globalData.add_phone },
                  success: function (res) {
                    res.data.d = 0;
                    // 等于0 不需要支付
                    if (res.data.d != 0) {
                      // 请求调起支付
                      wx.request({
                        url: app.globalData.pay_host + 'pay_mini',
                        method: 'POST',
                        header: { 'Content-type': 'application/x-www-form-urlencoded' },
                        data: {
                          'openid': app.globalData.wx_code,
                          'terminal_trace': that.data.order_id,
                          'total_fee': that.data.total_money
                        },
                        success: function (pay_res) {
                          if (pay_res.data.code == '10000') {
                            var pay_content = pay_res.data.content;
                            wx.requestPayment({
                              timeStamp: pay_content.timeStamp,
                              nonceStr: pay_content.nonceStr,
                              package: pay_content.package_str,
                              signType: pay_content.signType,
                              paySign: pay_content.paySign,
                              success: function (pay_success) {
                                wx.request({
                                  url: app.globalData.pay_host + 'send_template',
                                  header: { 'Content-type': 'application/x-www-form-urlencoded' },
                                  method: 'POST',
                                  data: {
                                    'openid': app.globalData.wx_code,
                                    'form_id': pay_content.package_str
                                  },
                                  success: function(res) {
                                    console.log(res);
                                  }
                                })
                              },
                              fail: function (pay_fail) {
                                console.log(pay_fail);
                                return false;
                              }
                            })
                          } else {
                            app.showError(pay_res.data.msg);
                            return false;
                          }
                        }
                      })
                    }
                  }
                });
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  mask: true,
                });
                setTimeout(function () {
                  wx.hideToast();
                  wx.reLaunch({
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
  jumpToAddress: function () {
    if(app.globalData.isCompany) {
      return false;
    }
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  // 修改配送时间
  bindTimeChange: function (e) {
    this.setData({ cart_time: e.detail.value });
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
  changeRemarks: function (e) {
    this.setData({ remarks: e.detail.value });
  },
  jumpBack: function () {
    wx.navigateBack({

    });
  },

})
// pages/editAddress/editAddress.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    default_address: false,
    area_city: '',
    username: '',
    telphone: '',
    detail_address: '',
    address_id: '',
    do_type: '',
    is_company: true,
    login_tel: '',
    login_pass: '',
    start_sub: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({ 
      address_id: options.code,
      do_type: options.do_type,
      is_company: app.globalData.isCompany
    });
    if (options.do_type == 'add') {
      that.setData({
        default_address: true
      });
      return false;
    }
    wx.request({
      url: app.globalData.host + 'getAddressInfo',
      method: 'POST',
      data: {id: that.data.address_id},
      success:function(res) {
        if (res.data.d == '0' || res.data.d == ']') {
          wx.showLoading({
            title: '获取地址失败',
          });
          setTimeout(function(){ 
            wx.hideLoading();
            wx.navigateBack({
              
            });
          }, 1500);
          return false;
        }
        var address_info = JSON.parse(res.data.d);
        that.setData({
          username: address_info[0]['shouhuoren'],
          telphone: address_info[0]['tel'],
          area_city: address_info[0]['diqu'],
          detail_address: address_info[0]['address'],
          default_address: address_info[0]['flag'] == '是' ? true: false
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
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              console.log(res);
            },
            fail: function(res) {
              app.showError('获取地理位置失败');
            }
          })
        }
      }
    });
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

  // 更改是否是默认地址
  changeDefaultAddress: function() {
    this.setData({
      default_address: !this.data.default_address
    });
  },

  // 更改地区
  changeAreaCity: function (e) {
    this.setData({
      area_city: e.detail.value
    });
  },

  // 更改登录密码
  changeLoginPass: function (e) {
    this.setData({
      login_pass: e.detail.value
    });
  },

  // 更改登录电话
  changeLoginTel: function (e) {
    this.setData({
      login_tel: e.detail.value
    });
  },
  
  // 更改用户名
  changeUsername: function(e) {
    this.setData({ username: e.detail.value });
  },

  // 更改手机号
  changeTelphone: function (e) {
    this.setData({ telphone: e.detail.value });
  },

  // 更改详细地址
  changeDetailAddress: function (e) {
    this.setData({ detail_address: e.detail.value });
  },

  // 保存信息
  saveAddress: function() {
    var that = this;
    if (that.data.start_sub) {
      app.showError('请勿重复点击');
      return false;
    }
    that.setData({
      start_sub: true
    });
    if (that.data.username == '' || that.data.telphone == '' || that.data.area_city == '选择所在地区' || that.data.detail_address == '') {
      app.showError('请填写完整信息');
      that.setData({
        start_sub: false
      });
      return false;
    }
    // 判断是业务人员或者客户
    if (that.data.is_company) {
      if (that.data.do_type == 'add') {
        that.addInfo('insertaddress');
      } else if (that.data.do_type == 'update') {
        that.addInfo('updateaddress');
      }  
    } else {
    // 业务人员
      if (that.data.login_tel == '' || that.data.login_pass == '') {
        app.showError('请填写完整信息');
        that.setData({
          start_sub: false
        });
        return false;
      }
      if (that.data.do_type == 'add') {
        that.addInfo('insertcustom');
      } else if (that.data.do_type == 'update') {
        that.addInfo('updatecustom');
      }  
    }
     
  },
  // 操作
  addInfo: function(fun) {
    var that = this;
    // 公共数据部分整合
    if (that.data.is_company) {
      var info = {
        shouhuoren: that.data.username,
        tel: that.data.telphone,
        diqu: that.data.area_city,
        address: that.data.detail_address,
      };
    } else {
      var info = {
        xiangmumingcheng: that.data.username,
        renjitong: that.data.telphone,
        kongyi: that.data.area_city,
        suidao: that.data.detail_address,
        useDept: that.data.login_tel,
        konger: that.data.login_pass
      };
      if (fun == 'updatecustomer') {
        info.kehuid = that.data.address_id;
      }
    }
    
    // 判断新增和更新
    if (fun == 'insertaddress') {
      info.logintel = app.globalData.user_phone,
      info.wxweiyiid = app.globalData.wx_code
    } else if (fun == 'updateaddress') {
      info.id = that.data.address_id
    }
    wx.request({
      url: app.globalData.host + fun,
      method: 'POST',
      data: info,
      success: function (res) {
        if (res.data.d != 0) {
          wx.showToast({
            title: '保存成功',
          });
          // 添加地址后将add_phone改为当前添加的手机号
          if (fun == 'insertcustom') {
            app.globalData.add_phone = that.data.telphone;
          }
          if (fun == 'insertaddress' || fun == 'insertcustom') {
            that.setData({ address_id: res.data.d });
          }
          if (that.data.default_address == true) {
            if (fun == 'updateaddress' || fun == 'updatecustomer'){
              wx.request({
                url: app.globalData.host + 'setaddress',
                method: 'POST',
                data: {
                  id: that.data.address_id,
                  wxweiyiid: app.globalData.wx_code,
                  tel: app.globalData.add_phone
                },
                success: function (e) {
                  if (e.data.d != 1) {
                    app.showError('保存为默认地址失败');
                    that.setData({
                      start_sub: false
                    });
                  }
                },
                error: function () {
                  app.showError('保存为默认地址失败');
                  that.setData({
                    start_sub: false
                  });
                }
              })
            }
          }
          setTimeout(function () {
            wx.hideToast();
            wx.redirectTo({
              url: '/pages/cartSettlement/cartSettlement',
            });
            // wx.navigateBack({});
          }, 1500);
        } else {
          app.showError('保存失败');
          that.setData({
            start_sub: false
          });
        }
      },
      error: function () {
        app.showError('保存失败');
        that.setData({
          start_sub: false
        });
      }
    })
  },

  // 返回上一页
  jumpBack: function() {
    wx.navigateBack({});
  },


  // 删除地址
  deleteAddress: function() {
    var that = this;
    wx.request({
      url: app.globalData.host + 'deleteaddress',
      method: 'POST',
      data: {id : that.data.address_id},
      success: function(res) {
        if(res.data.d == 1) {
          wx.showToast({
            title: '删除成功',
          });
          setTimeout(function() {
            wx.hideToast();
            wx.navigateBack({
              
            });
          }, 1500);
        } else {
          app.showError('删除失败');
        }
      },
      error: function() {
        app.showError('删除失败');
      }
    })
  },
})
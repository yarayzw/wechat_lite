// pages/cart/cart.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catList:{},//购物车列表
    img_show: true,//是否显示图片
    bookStock: true,//账面库存是否显示
    actualInventory: true,//实际库存是否显示
    memberShip: true,//是否显示会员价
    total_money:0,//总价
    total_num:0,//总数量
    isGo:false,//是否显示结算
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isImg();
    this.isBook();
    this.isActual();
    this.isMember();
    this.firstLoadShoppingCart();
    this.priceAll();
  },
  //购物车列表
  firstLoadShoppingCart: function(){
    var that = this;
    wx.request({
      url: app.globalData.host + 'FirstLoadShoppingCart',
      data: {
        wxweiyiid: app.globalData.wx_code
      },
      method: 'POST',
      success: function (res) {
        if (res.data.d != ']') {
          var rs = JSON.parse(res.data.d);
          that.setData({ catList: rs ,isGo:true});
        }else{
          that.setData({ isGo: false });
        }
        
      }
    })
  },

  //有/无图模式
  isImg: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + 'DisplayedPicture',
      data: {
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);
        if (rs[0].DisplayedPicture == 1) {
          that.setData({ is_img: true });
        } else {
          that.setData({ is_img: false });
        }
      }
    })
  },
  //账面库存是否显示
  isBook: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + 'BookStock',
      data: {
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);
        if (rs[0].BookStock == 1) {
          that.setData({ bookStock: true });
        } else {
          that.setData({ bookStock: false });
        }
      }
    })
  },
  //实际库存是否显示
  isActual: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + 'ActualInventory',
      data: {
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);
        if (rs[0].ActualInventory == 1) {
          that.setData({ actualInventory: true });
        } else {
          that.setData({ actualInventory: false });
        }
      }
    })
  },
  //会员价格是否显示
  isMember: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + 'MemberShip',
      data: {
      },
      method: 'POST',
      success: function (res) {

        var rs = JSON.parse(res.data.d);
        if (rs[0].MemberShip == 1) {
          that.setData({ memberShip: true });
        } else {
          that.setData({ memberShip: false });
        }
      }
    })
  },
  //加载购物车总价
  priceAll: function(){
    var that = this;
    wx.request({
      url: app.globalData.host + 'total',
      data: {
        wxweiyiid: app.globalData.wx_code
      },
      method: 'POST',
      success: function (res) {
        if (res.data.d != ']') {
          var rs = JSON.parse(res.data.d);
          that.setData({
            total_num: rs[0].totalnum,
            total_money: rs[0].totalmoney
          }); 
        }else{
          that.setData({
            total_num: 0,
            total_money: 0
          }); 
        }     
      }
    })
  },
  //删除全部
  delAll: function(){
    var that = this;
    wx.request({
      url: app.globalData.host + 'deleteall',
      data: {
        wxweiyiid: app.globalData.wx_code
      },
      method: 'POST',
      success: function (res) {
        that.firstLoadShoppingCart();
        that.priceAll();
      }
    })
  },
  confirmOrder: function(){
    wx.navigateTo({
      url: '/pages/cartSettlement/cartSettlement',
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
  
  }
})
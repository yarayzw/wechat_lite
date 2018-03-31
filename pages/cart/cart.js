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
    shopNum: {},//商品显示数量
    isNumGo: true,//是否能改数量
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
          var shopNum = that.data.shopNum;
          for (var j = 0; j < rs.length; j++) {
            shopNum[rs[j]['beforeid']] = parseInt(rs[j]['fuzhushuliang']);
          }
          that.setData({
            shopNum: shopNum,
            catList: rs, 
            isGo: true
          });
          // console.log(that.data.shopNum);
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
  //加号
  insertOneShop: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.shopid;
    var shopNum = that.data.shopNum;
    if(that.data.isNumGo){
      that.setData({ isNumGo: false });
      if (shopNum[id] > 0) {
        var add = parseInt(shopNum[id]) + 1;
        that.updateShop(id, add);
      } else {
        var add = 1;
        that.insertShop(id, 1);
      }
    }
    // console.log(e);
    // console.log(shopNum[id]);
    
  },
  //减号
  delOneShop: function (e) {
    var that = this;
    if (that.data.isNumGo) {
      that.setData({ isNumGo: false });
      var id = e.currentTarget.dataset.shopid;
      var shopNum = that.data.shopNum;
      if ((shopNum[id] - 1) == 0) {
        that.delShop(id, 1);
        that.firstLoadShoppingCart();
        that.priceAll();
      } else {
        var del = shopNum[id] - 1;
        that.updateShop(id, del);
      }
    }

  },
  //修改商品数量
  updateShop: function (id, num) {
    var that = this;
    wx.request({
      url: app.globalData.host + 'update',
      data: {
        cpid: id,
        shuliang: num,
        wxweiyiid: app.globalData.wx_code,
      },
      method: 'POST',
      success: function (res) {
        
        var rs = JSON.parse(res.data.d);
        if (rs == 1) {
          var new_row = that.data.shopNum;
          new_row[id] = num;
          that.setData({
            shopNum: new_row,
            isNumGo:true,
          });
        }
        // that.setData({ topMenu: rs });
      }
    })
  },
  //添加商品
  insertShop: function (shopId, num) {
    var that = this;
    wx.request({
      url: app.globalData.host + 'insert',
      data: {
        cpid: shopId,
        shuliang: num,
        canku: that.data.nowWareName,
        telephone: app.globalData.user_phone,
        wxweiyiid: app.globalData.wx_code,
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);
        if (rs == 1) {
          var new_row = that.data.shopNum;
          new_row[shopId] = new_row[shopId] == undefined ? num : new_row[shopId] + num;
          that.setData({
            shopNum: new_row,
            isNumGo: true,
          });
        }
        // that.setData({ topMenu: rs });
      }
    })

  },
  //删除商品
  delShop: function (shopId, num) {
    var that = this;
    wx.request({
      url: app.globalData.host + 'delete',
      data: {
        cpid: shopId,
        wxweiyiid: app.globalData.wx_code,
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);
        if (rs == 1) {
          var new_row = that.data.shopNum;
          new_row[shopId] = new_row[shopId] == undefined ? 0 : new_row[shopId] - num;
          that.setData({
            isNumGo: true,
            shopNum: new_row
          });
        }
        // that.setData({ topMenu: rs });
      }
    })
  },
  //更改商品数量input
  numGo: function (e) {
    var that = this;
    if (this.data.isNumGo) {
      that.setData({ isNumGo: false });
      var id = e.currentTarget.dataset.shopid;
      var num = parseInt(e.detail.value);
      if (num > 0) {
        this.updateShop(id, num);
      } else {
        this.delShop(id, num);
      }
      // console.log(e);
    }
  
  },
  //修改数量
  inputIn: function (e) {

    if (this.data.numStatus) {
      this.setData({
        numStatus: false
      });
      return '';
    }
    return e.detail.value;
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
    // this.isImg();
    // this.isBook();
    // this.isActual();
    // this.isMember();
    this.firstLoadShoppingCart();
    this.priceAll();
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
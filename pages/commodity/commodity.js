var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_show:true,//是否显示图片
    bookStock:true,//账面库存是否显示
    actualInventory:true,//实际库存是否显示
    memberShip:true,//是否显示会员价
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    scorllTop: 0, //左侧菜单高度
    currentLeft:0,//左侧菜单选中的项
    masking:false,
    maskInfoTitle:"2333",//弹出窗标题 
    addressNow:'',
    leftMenu:{},//左侧菜单数据
    topMenu: {},//右侧菜单数据
    wareChangeNum:0,//仓库当前项
    nowTopMenuId:'',//当前顶部菜单选项
    nowLeftMenuId:'',//当前左侧菜单选项
    nowWareName:'',//当前仓库名称
    wareList:{},//仓库列表
    shopList:{},//商品列表
    shopNum:{},//商品显示数量
    shopDetails:{},//商品详情信息
  },
  touchStartTime: 0,
  touchEndTime: 0,
  lastTapTime: 0, 
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur,
        nowTopMenuId: e.target.dataset.id
      });
    
      this.topMenuChange(e.target.dataset.id);
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function () {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  // 左侧菜单点击
  menuLeft: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentLeft == cur) { return false; }
    else {
      this.setData({
        currentLeft: cur
      })
    }
    var that = this;
    wx.request({
      url: app.globalData.host + 'TypeDetails',
      data: {
        WareHouse: that.data.nowWareName,
        tel: app.globalData.user_phone,
        id: e.target.dataset.id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.d != ']') {
          var rs = JSON.parse(res.data.d);
          that.setData({
            shopList: rs
          });
        }
      }
    })
  },
  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },
  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },
  /// 单击
  tap: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '单击事件被触发',
      showCancel: false
    })
  },
  /// 双击
  doubleTap: function (e) {
    var that = this
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.touchEndTime - that.touchStartTime < 350) {
      // 当前点击的时间
      var currentTime = e.timeStamp
      var lastTapTime = that.lastTapTime
      // 更新最后一次点击时间
      that.lastTapTime = currentTime

      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        console.log(e);
        // 成功触发双击事件时，取消单击事件的执行
        clearTimeout(that.lastTapTimeoutFunc);
        
        that.setData({ 
          masking: true ,
          shopDetails: e.currentTarget.dataset.info
        });
        // wx.showModal({
        //   title: '提示',
        //   content: '双击事件被触发',
        //   showCancel: false
        // })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.isImg();
    this.isBook();
    this.isActual();
    this.isMember();
    this.fristLeftNavigation();
    this.fristTopNavigation();
    this.wareHouseLoad();
    this.fristLoadList();
  },

  //有/无图模式
  isImg:function(){
    var that = this;
    wx.request({
      url: app.globalData.host + 'DisplayedPicture',
      data: {
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);
        if (rs[0].DisplayedPicture==1){
          that.setData({is_img:true});
        }else{
          that.setData({ is_img: false });
        }
      }
    })
  },
  //账面库存是否显示
  isBook:function(){
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
  isActual:function(){
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
  
  //左侧菜单第一次加载
  fristLeftNavigation:function(){
    var that = this;
    wx.request({
      url: app.globalData.host + 'FristLeftNavigation',
      data: {
        WareHouse: '',
        tel: '',
      },
      method: 'POST',
      success: function (res) { 
        if (res.data.d!=']'){
          var rs = JSON.parse(res.data.d);
          that.setData({
            nowTLeftMenuId: rs[0].id
          });
          that.setData({ leftMenu: rs });
        }
       
      }
    })
  },
  //上部菜单第一次加载
  fristTopNavigation: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + 'TopNavigation',
      data: {
        WareHouse: '',
        tel: '',
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d); 
        that.setData({
          nowTopMenuId: rs[0].id
        });
        that.setData({ topMenu: rs });
      }
    })
  },
  //上部菜单改变
  topMenuChange: function (topId) {
    var that = this;
    wx.request({
      url: app.globalData.host + 'TypeLeftNavigation',
      data: {
        topid: topId,
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);
        that.setData({ 
          leftMenu: rs ,
          nowTLeftMenuId: rs[0].id
        });
      }
    })
  },
  //仓库列表第一次加载
  wareHouseLoad: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + 'WareHouseLoad',
      data: {
        county: 'ABC',
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);
        var list = new Array;
        for(var i = 0;i<rs.length;i++){
            list.push(rs[i]['NAME']);
        }
        that.setData({
          nowWareName: rs[0].NAME,
          wareList:list,
        });
        // that.setData({ topMenu: rs });
      }
    })
  },
  //仓库选择事件
  wareChange:function(e){
    var wareName = e.currentTarget.dataset.val;
    this.setData({ nowWareName:wareName});
    this.wareGetLeft();
  },
  //根据仓库名称获取商品列表
  wareGetLeft: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + 'FristLoad',
      data: {
        WareHouse: that.data.nowWareName,
        tel: app.globalData.user_phone
      },
      method: 'POST',
      success: function (res) {
        if (res.data.d != ']') {
          var rs = JSON.parse(res.data.d);
          that.setData({
            shopList: rs
          });
        }
      }
    })
  },
  //第一次加载获取商品信息
  fristLoadList:function(){
    var that = this;
    wx.request({
      url: app.globalData.host + 'FristLoad',
      data: {
        WareHouse: that.data.nowWareName,
        tel: app.globalData.user_phone
      },
      method: 'POST',
      success: function (res) {
        
        if (res.data.d!=']'){
          var rs = JSON.parse(res.data.d);
          that.setData({
            shopList: rs
          });
        }
        // console.log(rs);
        // var list = new Array;
        // for (var i = 0; i < rs.length; i++) {
        //   list.push(rs[i]['NAME']);
        // }
      }
    })
  },
  //获取商品信息
  getShopList:function(){
    var that = this;
    wx.request({
      url: app.globalData.host + 'WareHouseLoad',
      data: {
        county: 'ABC',
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);
        var list = new Array;
        for (var i = 0; i < rs.length; i++) {
          list.push(rs[i]['NAME']);
        }
        that.setData({
          nowWareName: rs[0].NAME,
          wareList: list,
        });
        // that.setData({ topMenu: rs });
      }
    })
  },
  //搜索事件
  searchGo:function(e){
    var that = this;
    var search = e.detail.value;
    
    wx.request({
      url: app.globalData.host + 'ProductSearch',
      data: {
        WareHouse: that.data.nowWareName,
        tel: app.globalData.user_phone,
        product: search
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);
        // console.log(rs);
        // var list = new Array;
        // for (var i = 0; i < rs.length; i++) {
        //   list.push(rs[i]['NAME']);
        // }
        that.setData({
          shopList: rs
        });

      }
    })
    
  },
  //加号
  insertOneShop:function(e){
    var that = this;
    var id = e.currentTarget.dataset.shopid;
    that.insertShop(id,1);
  },
  //减号
  delOneShop: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.shopid;
    that.delShop(id, 1);
  },
  //添加商品
  insertShop:function(shopId,num){
    var that = this;
    wx.request({
      url: app.globalData.host + 'insert',
      data: {
        cpid:shopId,
        shuliang:num,
        canku: that.data.nowWareName,
        telephone: app.globalData.user_phone,
        wxweiyiid: app.globalData.wx_code,
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);
        if(rs==1){
          var new_row = that.data.shopNum;
          new_row[shopId] = new_row[shopId] == undefined  ? num : new_row[shopId]+num;
          that.setData({
            shopNum: new_row
          });
        }
        // that.setData({ topMenu: rs });
      }
    })
    
  },
  //减去商品
  delShop: function(shopId,num){
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
            shopNum: new_row
          });
        }
        // that.setData({ topMenu: rs });
      }
    })
  },
  //更改商品数量input
  numGo: function(e){
    var num = e.currentTarget.dataset.shopId;
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
  /**
   * 商品加一
   */
  add:function(e){
    var shop_num
    var add_id = e.currentTarget.id;
    var id = add_id.split('_');
    id = id[1];
    var num = document.getElementById("num_"+id).html(); 
    console.log(num);
  },

  //无图模式
  img_hide:function(e){
    this.setData({img_show:false});
  },
  //有图模式
  img_show: function (e) {
    this.setData({ img_show: true });
  },
  hideMask: function() {
    this.setData({ masking: false });
  },
  
})
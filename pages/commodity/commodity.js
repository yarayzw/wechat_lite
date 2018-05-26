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
    yuanShip:true,
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
    nowTopType:0,//顶部菜单当前选择项
    wareList:{},//仓库列表
    shopList:{},//商品列表
    shopNum:{},//商品显示数量
    shopDetails:{},//商品详情信息
    isNumGo:true,//是否能操作数量
    numStatus:true,//数量改变是否覆盖
    isCompany:true,//true是客户false是业务人员
    topList:{},//顶部菜单下拉
    topNum:0,//顶部注释内容
    nameListIn:false,//客户名称是否显示
    nameList:{},//客户名称数组
    addressListIn:false,//客户地址是否显示
    addressList:{},//客户地址数组
    phoneListIn:false,//客户电话是否显示
    phoneList:{},//客户电话数组
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
        that.setData({
          winHeight: calc
        });
      }
    });
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
  //商品详情
  infoTap: function(e){
    var that = this;
    var id = e.currentTarget.dataset.info;
    wx.request({
      url: app.globalData.host + 'ProductDescribe',
      data: {
        id: id,
        tel: app.globalData.add_phone
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);
        that.setData({
          masking: true,
          shopDetails: rs[0]
        });
      }
    })
    
    
  },
  // 跳转到添加页面
  jumpAddAddress: function () {
    wx.navigateTo({
      url: '/pages/editAddress/editAddress?code=' + 0 + '&do_type=add',
    });
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
    // this.fristLoadList();
    this.isCompany();
    this.isMembers();
    // var topArr = new Array;
    // topArr.push('客户名称');
    // topArr.push('客户电话');
    // that.setData({ topList: topArr });
    // this.getCatShopList();
  },
  //判断是否为业务人员
  isCompany: function(){
    var that = this;
    wx.request({
      url: app.globalData.host + 'pangduanlogintelephone',
      data: {
        tel: app.globalData.user_phone
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);
        if(rs[0].flag==1){
          that.setData({ isCompany: false });
        }else{
          that.setData({ isCompany: true });
        }
      }
    })
  },
  //客户姓名聚焦事件
  nameFocus: function(e){
    var that = this;
     that.setData({ nameListIn: true });
  },
  //客户名称失焦事件
  nameBindBlur: function(e){
    var that=this;   
    that.setData({ nameListIn: false });
    var name = e.detail.value;
    that.nameGetAddress(name);
  },
  //客户名称输入事件
  nameInput: function(e){
    var that = this;
    var name = e.detail.value;
    wx.request({
      url: app.globalData.host + 'getkhallname',
      data: {
        custom: name,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.d != ']') {
          var rs = JSON.parse(res.data.d);
          that.setData({ nameList: rs });
        } else {
          that.setData({ nameList: {} });
        }
      }
    })
    that.nameGetAddress(name);
    that.nameGetPhone(name);
  },
  
  //客户地址聚焦事件
  addressFocus: function (e) {
    var that = this;
    that.setData({ addressListIn: true });
  },
  //客户地址失焦事件
  addressBindBlur: function (e) {
    var that = this;
    that.setData({ addressListIn: false });
  },
  //客户电话聚焦事件
  phoneFocus: function (e) {
    var that = this;
    that.setData({ phoneListIn: true });
  },
  //客户电话失焦事件
  phoneBindBlur: function (e) {
    var that = this;
    that.setData({ phoneListIn: false });
    var name = e.detail.value;
    that.setData({ phoneNow: name });
    that.isCompanyPhone(name);
  },
  //客户电话输入事件
  phoneInput: function (e) {
    var that = this;
    var name = e.detail.value;
    wx.request({
      url: app.globalData.host + 'getkhtel',
      data: {
        custom: name,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.d != ']') {
          var rs = JSON.parse(res.data.d);
          that.setData({ phoneList: rs });
        } else {
          that.setData({ phoneList: {} });
        }
      }
    })
    that.phoneGetName(name);
    that.phoneGetAddress(name);
  },
  
  //根据客户名称返回地址
  nameGetAddress: function(name){
    var that = this;
    wx.request({
      url: app.globalData.host + 'getkhaddressbyname',
      data: {
        custom: name,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.d != ']') {
          var rs = JSON.parse(res.data.d);
          that.setData({ addressList: rs });
        } else {
          that.setData({ addressList: {} });
        }
        // console.log(rs);
      }
    })
  },
  //根据客户名称返回手机号
  nameGetPhone: function (name) {
    var that = this;
    wx.request({
      url: app.globalData.host + 'getkhtel',
      data: {
        custom: name,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.d != ']') {
          var rs = JSON.parse(res.data.d);
          that.setData({ phoneList: rs });
        } else {
          that.setData({ phoneList: {} });
        }
      }
    })
  },
  //根据客户电话获取客户地址
  phoneGetAddress: function (phone) {
    var that = this;
    wx.request({
      url: app.globalData.host + 'getkhaddress',
      data: {
        custom: phone,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.d != ']') {
          var rs = JSON.parse(res.data.d);
          that.setData({ addressList: rs });
        } else {
          that.setData({ addressList: {} });
        }
        // console.log(rs);
      }
    })
  },
  //根据客户电话获取客户名称
  phoneGetName: function (phone) {
    var that = this;
    wx.request({
      url: app.globalData.host + 'getkhmingc',
      data: {
        custom: phone,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.d != ']') {
          var rs = JSON.parse(res.data.d);
          that.setData({ nameList: rs });
        } else {
          that.setData({ nameList: {} });
        }
      }
    })
  },
  //客户电话是否存在
  isCompanyPhone: function(phone){
    var that = this;
    wx.request({
      url: app.globalData.host + 'ValidateTelephone',
      data: {
        Telephone: phone,
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d)[0].flag;
        // if (res.data.d == 1) {
        //   // var rs = JSON.parse(res.data.d);
          if(rs==1){
            app.globalData.add_phone = phone;
            that.fristLeftNavigation();
            that.fristTopNavigation();
            that.wareHouseLoad();
          }else{
            wx.showToast({
              title: '请新建用户',
              icon: 'loading',
              duration: 1500,
              mask: true
            })
            app.globalData.add_phone = 0;
            that.setData({
              shopNum: {}
            });
          }
          
        // } else {
        //   wx.showToast({
        //     title: '加载失败',
        //     icon: 'loading',
        //     duration: 1500,
        //     mask: true
        //   })
        // }
      }
    })
  },
  //客户名称点击
  nameDivClick: function(e){
    var that = this;
    var name = e.currentTarget.dataset.name;
    that.setData({ nameNow: name });
    that.nameGetAddress(name);
    that.nameGetPhone(name);
  },
  //客户电话点击
  phoneDivClick: function (e) {
    var that = this;
    var name = e.currentTarget.dataset.name;
    that.setData({ phoneNow: name });
    that.isCompanyPhone(name);
    // app.globalData.add_phone = name;
    that.phoneGetAddress(name);
    that.phoneGetName(name);
  },
  //客户地址点击
  addressDivClick: function (e) {
    var that = this;
    var name = e.currentTarget.dataset.name;
    that.setData({ addressNow: name });
  },
  //有/无图模式
  isImg:function(){
    var that = this;
    wx.request({
      url: app.globalData.host + 'DisplayedPicture',
      data: {
        tel: app.globalData.add_phone
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
        tel: app.globalData.add_phone
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
        tel: app.globalData.add_phone
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
        tel: app.globalData.add_phone
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
  //会员价格是否显示
  isMembers: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + 'yuanjia',
      data: {
        tel: app.globalData.add_phone
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);     
        if (rs[0].yuanjia == 1) {
          that.setData({ yuanShip: true });
        } else {
          that.setData({ yuanShip: false });
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
        tel: app.globalData.add_phone
      },
      method: 'POST',
      success: function (res) { 
        if (res.data.d!=']'){
          var rs = JSON.parse(res.data.d);
          that.setData({
            nowTLeftMenuId: rs[0].id
          });
          that.setData({ leftMenu: rs });
          that.getCatShopList();
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
        tel: app.globalData.add_phone
      },
      method: 'POST',
      success: function (res) {
        
        if (res.data.d != ']') {
          var rs = JSON.parse(res.data.d);
          that.setData({
            nowTopMenuId: rs[0].id
          });
          that.setData({ topMenu: rs });
        }
       
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
        that.loadLeftList(rs[0].id);
      }
    })
  },
  //上部菜单点击加载左侧第一个小类别
  loadLeftList: function(id){
    var that = this;
    if (app.globalData.add_phone>0){
      wx.request({
            url: app.globalData.host + 'TypeDetails',
            data: {
              WareHouse: that.data.nowWareName,
              tel: app.globalData.add_phone,
              id: id
            },
            method: 'POST',
            success: function (res) {
              if (res.data.d != ']') {
                var rs = JSON.parse(res.data.d);
              
                that.setData({
                  shopList: rs
                });
                that.getCatShopList();
              }
            }
          })
    }else{
      wx.showToast({
        title: '请新建用户',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    }
    
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
    if (app.globalData.add_phone>0){
     wx.request({
      url: app.globalData.host + 'TypeDetails',
      data: {
        WareHouse: that.data.nowWareName,
        tel: app.globalData.add_phone,
        id: e.target.dataset.id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.d != ']') {
          var rs = JSON.parse(res.data.d);
          that.setData({
            shopList: rs
          });
          that.getCatShopList();
        }
      }
     })
    }else{
      wx.showToast({
        title: '请新建用户',
        icon: 'loading',
        duration: 1500,
        mask: true
      })
    }
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
        that.fristLoadList();
        // console.log(that.data.nowWareName);
        // that.setData({ topMenu: rs });
      }
    })
  },
  //仓库选择事件
  wareChange:function(e){
    var wareName = e.currentTarget.dataset.val;
    var wareNum = e.detail.value;
    this.setData({ nowWareName: wareName, wareChangeNum:wareNum});
    this.wareGetLeft();
  },
  //顶部搜索选择事件
  topChange: function(e){
    var topName = e.detail.value;
    this.setData({ nowTopType: topName,topNum:topName });
  },
  //根据仓库名称获取商品列表
  wareGetLeft: function () {
    var that = this;
    if (app.globalData.add_phone>0){
      wx.request({
        url: app.globalData.host + 'FristLoad',
        data: {
          WareHouse: that.data.nowWareName,
          tel: app.globalData.add_phone
        },
        method: 'POST',
        success: function (res) {
          if (res.data.d != ']') {
            var rs = JSON.parse(res.data.d);
            that.setData({
              shopList: rs
            });
            that.getCatShopList();
          }
        }
      })
    }else{
      wx.showToast({
        title: '请新建用户',
        icon: 'loading',
        duration: 1500,
        mask: true
      })
    }
  },
  //第一次加载获取商品信息
  fristLoadList:function(){
    var that = this;
    if (app.globalData.add_phone>0) {
      wx.request({
        url: app.globalData.host + 'FristLoad',
        data: {
          WareHouse: that.data.nowWareName,
          tel: app.globalData.add_phone
        },
        method: 'POST',
        success: function (res) {

          if (res.data.d != ']') {
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
    } else {
      wx.showToast({
        title: '请新建用户',
        icon: 'loading',
        duration: 1500,
        mask: true
      })
    }
      
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
  //获取已选商品信息
  getCatShopList: function(){
    var that = this;
    wx.request({
      url: app.globalData.host + 'AlreadyHaveChoicet',
      data: {
        wxweiyiid: app.globalData.wx_code
      },
      method: 'POST',
      success: function (res) {
        if (res.data.d!=']'){
          var rs = JSON.parse(res.data.d);
          var shopNum ={};
          // that.setData({
          //   shopNum: {}
          // });
          for (var j = 0; j < rs.length; j++) {
            shopNum[rs[j]['beforeid']] = parseInt(rs[j]['fuzhushuliang']);
          }
          that.setData({
            shopNum: shopNum
          });
          // console.log(that.data.shopNum);
        }else{
          that.setData({
            shopNum: {}
          });
        }
      }
    })
  },
  //搜索事件
  searchGo:function(e){
    var that = this;
    var search = e.detail.value;
    if (app.globalData.add_phone>0){
      wx.request({
        url: app.globalData.host + 'ProductSearch',
        data: {
          WareHouse: that.data.nowWareName,
          tel: app.globalData.add_phone,
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
    }else{
      wx.showToast({
        title: '请新建用户',
        icon: 'loading',
        duration: 1500,
        mask: true
      })
    }
    
  },
  //加号
  insertOneShop:function(e){
  
    if (app.globalData.add_phone>0){
      var that = this;
      var id = e.currentTarget.dataset.shopid;
      var shopNum = that.data.shopNum;
      // console.log(shopNum);
      // if (that.data.isNumGo) {
        that.setData({ isNumGo: false });
        if (shopNum[id] > 0) {
          // var add = parseInt(shopNum[id]) + 1;
           shopNum[id] = parseInt(shopNum[id]) + 1;
          // that.updateShop(id, add);
        } else {
          shopNum[id] =  1;
          // var add = 1;
          // var shopcz = e.currentTarget.dataset.cz;
          // that.insertShop(id, 1, shopcz);
        }
        that.setData({
          shopNum : shopNum
        });
        // console.log(that.data.shopNum);
      // }
    // }else{
    //   wx.showToast({
    //     title: '请新建用户',
    //     icon: 'loading',
    //     duration: 1500,
    //     mask: true
    //   })
    // }
    }
  },
  //减号
  delOneShop: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.shopid;
    var shopNum = that.data.shopNum;
     if ((shopNum[id] - 1) == 0) {
      //  console.log(11);
       shopNum[id] = 0;
      } else {
      //  console.log(21);
       shopNum[id] = shopNum[id]-1;
      }
     that.setData({
       shopNum: shopNum
     });
    // if (that.data.isNumGo) {
    //   that.setData({ isNumGo: false });
    //   if ((shopNum[id] - 1) == 0) {
    //     that.delShop(id, 1);
    //   } else {
        
    //     var del = shopNum[id] - 1;
    //     that.updateShop(id, del);
    //   }
    // }
    
  },
  //修改商品数量
  updateShop: function(id,num){
    var that = this;
    var new_row = that.data.shopNum;
    new_row[id] = num;
    that.setData({
      shopNum: new_row
    });
    wx.request({
      url: app.globalData.host + 'update',
      data: {
        cpid: id,
        shuliang: num,
        wxweiyiid: app.globalData.wx_code,
      },
      method: 'POST',
      success: function (res) {
        // console.log(res);
        var rs = JSON.parse(res.data.d);
        if (rs == 1) {
          // var new_row = that.data.shopNum;
          // new_row[id] = num;
          that.setData({
            // shopNum: new_row,
            isNumGo: true
          });
        }else{
          that.setData({
            isNumGo: true
          });
        }
        // that.setData({ topMenu: rs });
      }
    })
  },
  //添加商品
  insertShop:function(shopId,num,shopcz){
    var that = this;
    var new_row = that.data.shopNum;
    new_row[shopId] = new_row[shopId] ? new_row[shopId] + num : num;
    that.setData({
      shopNum: new_row,
      // isNumGo: true
    });
    wx.request({
      url: app.globalData.host + 'insert',
      data: {
        cpid: shopId,
        shuliang: num,
        canku: that.data.nowWareName,
        telephone: app.globalData.add_phone,
        wxweiyiid: app.globalData.wx_code,
        cznumber: shopcz
      },
      method: 'POST',
      success: function (res) {
        var rs = JSON.parse(res.data.d);
        if (rs == 1) {
          that.setData({
            // shopNum: new_row,
            isNumGo: true
          });
        }else{
          var new_row = that.data.shopNum;
          new_row[shopId] = 0;
          that.setData({
            isNumGo: true
          });
        }
        // that.setData({ topMenu: rs });
      }
    })
  },
  //删除商品
  delShop: function(shopId,num){
    var that = this;
    var new_row = that.data.shopNum;
    new_row[shopId] = 0;
    that.setData({
      shopNum: new_row
    }); 
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
          that.setData({ 
            isNumGo: true
          });    
        }else{
          var new_row = that.data.shopNum;
          new_row[shopId] = 1;
          that.setData({
            shopNum: new_row,
            isNumGo: true
          });
        }
        // that.setData({ topMenu: rs });
      }
    })
  },
 
  //修改数量
  inputIn: function (e) {  
    var that = this; 
    var num = parseInt(e.detail.value);
    var id = e.currentTarget.dataset.shopid;
    if (num > 0) {
    // if(this.data.numStatus){
    //   this.setData({
    //     numStatus: false
    //   });
    //   return '';
    // }
    
      var new_row = that.data.shopNum;
      new_row[id] = num;
      that.setData({
        shopNum: new_row,
      });
    
    // this.updateShop(id, num);
    }
    console.log(num);
    return e.detail.value;
    // return e.detail.value;
  },
  //一次性添加商品
  addAllShop: function(){
    var that= this;
    var arr = that.data.shopNum;
    var arr_newss = new Array;
    for(var pl in arr){
      var t = [];
      t = {};
      t.cpid = pl;
      t.shuliang = arr[pl];
      // t['cpid'] = pl;
      // t['shuliang'] = arr[pl];
      arr_newss.push(t);
    }
    arr_newss = JSON.stringify(arr_newss);
    wx.request({
      url: app.globalData.host + 'Json2Dtb',
      data: {
        json: arr_newss,
        cangku: that.data.nowWareName,
        mobile: app.globalData.add_phone,
        openid: app.globalData.wx_code
      },
      method: 'POST',
      success: function (res) {
        // var rs = JSON.parse(res.data.d);
        // console.log(res.data.d);
        if (res.data.d){
          app.globalData.ddh = res.data.d;
        }else{
          wx.showToast({
            title: '您的网络情况比较差,本次提交失败,请重新提交',
            icon: 'error',
            duration: 1500,
            mask: true
          })
        } 
        // app.globalData.shaixuanid = rs.shaixuanid;
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
    if (app.globalData.add_phone > 0) {
      this.getCatShopList();
    }else{
      this.setData({
        shopNum:{}
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.addAllShop();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.addAllShop();
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
  //扫码
  recognizeCode:function(e){
    var that = this
    //小程序API
    wx.scanCode({
      //扫描条形码ISBN
      success: function (res) {
       wx.request({
         url: app.globalData.host + 'pangduanloginisquanjian',
         data: {
          //  tiaoma: app.globalData.add_phone,
           tel: app.globalData.add_phone
         },
         method: 'POST',
         success: function (rs) {
           var rss = JSON.parse(rs.data.d);
          //  console.log(1);
          //  console.log(rss[0]['flag']);
          //  return false;
            if(rss[0]['flag']==0){
              that.setData({ sousuo: rss[0]['flag'] });
            }else{
              wx.request({
                url: app.globalData.host + 'LJsend',
                data: {
                  //  tiaoma: app.globalData.add_phone,
                  tiaoma: res.result
                },
                method: 'POST',
                success: function (rsss) {
                  var re = JSON.parse(rsss.data.d);
                  if (re == 1) {
                    wx.request({
                      url: app.globalData.host + 'sendduanxin',
                      data: {
                        //  tiaoma: app.globalData.add_phone,
                        tiaoma: res.result
                      },
                      method: 'POST',
                      success: function (rssss) {
                        var ree = JSON.parse(rssss.data.d);
                        if (ree == 100) {
                          wx.showToast({
                            title: '核卷成功',
                            icon: 'success',
                            duration: 1500,
                            mask: true
                          })
                        } else {
                          wx.showToast({
                            title: '核卷失败',
                            icon: 'loading',
                            duration: 1500,
                            mask: true
                          })
                        }
                        // that.setData({ topMenu: rs });
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '领劵失败',
                      icon: 'loading',
                      duration: 1500,
                      mask: true
                    })
                  }
                  // that.setData({ topMenu: rs });
                }
              })
            }
           // that.setData({ topMenu: rs });
         }
       })
      },
      fail: function () {
        wx.showToast({
          title: '无效的条形码',
          icon: 'loading',
          duration: 1500,
          mask: true
        })
      },
      complete: function () {
        // complete
      }
    })
  },
  
})
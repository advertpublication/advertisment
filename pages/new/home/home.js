import {
  httpPost,
  httpPostNew
} from "../../../utils/util.js";
const VERIFY_LIST_URL = "/publishApprovalList"; // 审核列表
const HISTORY_LIST_URL = "/processHistoryList"; //审批历史列表
const OPTIONS_URL = "/screen"; // picker选项
const WECHAT_APPLIST_URL = "/wechatApproveList"; //微信公众号审批列表
const MAIN_URL ="/mainInfo"//若微信缓存中不存在个人信息则从后台取到并放在缓存中
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页码
    start: 0,
    //煤业加载数量
    end: 10,
    //列表总数
    total: 0,
    //待审批条数
    approvingcount: 0,
    flag: 0, //小程序,公众号的标识
    list: [], // 未处理列表
    histotyList: [],
    ssl: [],
    thisSheng: 0,
    multiIndex: [0, 0, 0],
    loginName:'',//登录名
    railwaybureau:'',//路局
    roleType:'',//角色类型
  },

  /**
   * 初始化picker数据，填充筛选条件
   */
  getPickerList() {
    let url = OPTIONS_URL;
    let params = {
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau || this.data.railwaybureau || '', // 路局编码
      loginName: wx.getStorageSync("userInfo").loginName || this.data.loginName || ''//登录名
    }
    return httpPost(url, params).then(res => {
      //console.log(res, "res");
      if (!res) {

      } else {
        var ssls = res;
        ssls.unshift({
          "lable": "上刊类型",
          "publType": "",
          "traintypeList": [{
            "marshallingList": [{
              "medialocation": "区域",
              "medialocationName": ""
            }],
            "properystationid": "",
            "properystationname": "所属单位"
          }]
        })
        var sheng = [];
        var shi = [];
        var qu = [];
        for (var i in ssls) {
          sheng.push(ssls[i].lable)
          if (i == 0) {
            for (var u in ssls[i].traintypeList) {
              shi.push(ssls[i].traintypeList[u].properystationname)
              if (u == 0) {
                for (var j in ssls[i].traintypeList[u].marshallingList) {
                  qu.push(ssls[i].traintypeList[u].marshallingList[j].medialocation)
                }
              }
            }
          }
        }
        this.setData({
          multiArray: [sheng, shi, qu],
          ssl: ssls
        });
      }
      return Promise.resolve();
    });
  },
  bindMultiPickerChange: function(e) {
    let medialocation = '';
    if (this.data.ssl[e.detail.value[0]].traintypeList[e.detail.value[1]].marshallingList.length != 0) {
      medialocation = this.data.ssl[e.detail.value[0]].traintypeList[e.detail.value[1]].marshallingList[e.detail.value[2]].medialocationName; //所属区域
    } else {
      medialocation = "";
    }
    // 刷新数据
    let url = VERIFY_LIST_URL;
    let params = {
      loginName: wx.getStorageSync("userInfo").loginName||this.data.loginName || '', // 用户登录名
      userId:wx.wx.getStorageSync("userInfo").accountId || '',//用户id
      properystation: this.data.ssl[e.detail.value[0]].traintypeList[e.detail.value[1]].properystationid || "", // 媒体车站主键
      medialocation: medialocation || "", // 媒体位置主键
      publType: this.data.ssl[e.detail.value[0]].publType || "", //上刊类型
      mediatype: this.data.ssl[e.detail.value[0]].traintypeList[e.detail.value[1]].properystationname, //列车车型
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau || this.data.railwaybureau || '', // 路局编码
      roleType: wx.getStorageSync("userInfo").roleType||this.data.roleType || "",
      start: this.data.start, // 页数
      end: this.data.end, // 每页加载数量
    };
    httpPostNew(url, params).then(res => {
      console.log(res,"......");
      if (!res.data || !res.data.length) {
        this.setData({
          list: [],
          total: 0,
          approvingcount: 0,
        });
        wx.hideLoading();
        return;
      }
      this.setData({
        list: res.data || [],
        total: res.total,
        approvingcount: res.approvingcount,
      });
      wx.hideLoading();
    });
  },

  bindMultiPickerColumnChange: function(e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        this.setData({
          thisSheng: e.detail.value
        })
        var row = this.getCity(e.detail.value);
        data.multiArray[1] = row[0];
        data.multiArray[2] = row[1];

        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        var row = this.getCity(this.data.thisSheng, e.detail.value);
        data.multiArray[2] = row[1];
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
  },
  getCity: function(x, y = 999, z = 999) {
    var ssls = this.data.ssl;
    var shi = [];
    var qu = [];
    for (var i in ssls) {
      if (i == x) {
        for (var u in ssls[i].traintypeList) {
          shi.push(ssls[i].traintypeList[u].properystationname)
          if (u == y) {
            for (var j in ssls[i].traintypeList[u].marshallingList) {
              qu.push(ssls[i].traintypeList[u].marshallingList[j].medialocation)
            }
            break;
          }
          if (y == 999) {
            if (u == 0) {
              for (var j in ssls[i].traintypeList[u].marshallingList) {
                qu.push(ssls[i].traintypeList[u].marshallingList[j].medialocation)
              }
            }
          }

        }
        break;
      }
    }
    return [shi, qu];
  },

  doInput(e) {
    this.setData({
      input: e.detail.value,
    });
    let medialocation = '';
    if (this.data.ssl[this.data.multiIndex[0]].traintypeList[this.data.multiIndex[1]].marshallingList.length != 0) {
      medialocation = this.data.ssl[this.data.multiIndex[0]].traintypeList[this.data.multiIndex[1]].marshallingList[this.data.multiIndex[2]].medialocationName; //所属区域
    } else {
      medialocation = "";
    }
    //根据多条件筛查list
    let url = VERIFY_LIST_URL;
    let params = {
      loginName: wx.getStorageSync("userInfo").loginName || this.data.loginName || '', // 用户登录名
      properystation: this.data.ssl[this.data.multiIndex[0]].traintypeList[this.data.multiIndex[1]].properystationid || "", // 媒体车站主键
      medialocation: medialocation || "", // 媒体位置主键
      publType: this.data.ssl[this.data.multiIndex[0]].publType || "", //上刊类型
      mediatype: this.data.ssl[this.data.multiIndex[0]].traintypeList[this.data.multiIndex[1]].properystationname, //列车车型
      condition: this.data.input || "",
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau || this.data.railwaybureau || '', // 路局编码
      roleType: wx.getStorageSync("userInfo").roleType|| this.data.roleType || "",
      start: this.data.start, // 页数
      end: this.data.end, // 每页加载数量
    };
    httpPostNew(url, params).then(res => {
      if (!res.data || !res.data.length) {
        this.setData({
          list: [],
          total: 0,
          approvingcount: 0,
        });
        wx.hideLoading()
        return;
      }
      // let approvingcount = 0;
      // res.data.forEach((item, index) => {
      //   if (item.appstatus == 0) {
      //     approvingcount++;
      //   }
      // })   
      this.setData({
        list: res.data || [],
        total: res.total,
        approvingcount: res.approvingcount,
        start: 0
      });
      wx.hideLoading();
    });
  },

  /**
   * 获取 审核人 首页列表
   */
  getVerifyList(start) {
    let url = VERIFY_LIST_URL;
    start = start ? start : 0;
    let params = {
      loginName: wx.getStorageSync("userInfo").loginName || this.data.loginName, // 用户登录名
      properystation: "", // 媒体车站主键
      medialocation: "", // 媒体位置主键
      mediatype: "", //媒体类型
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau || this.data.railwaybureau || '', // 路局编码
      roleType: wx.getStorageSync("userInfo").roleType|| this.data.roleType || "",
      start: start, // 页数
      end: this.data.end, // 每页加载数量
    };
    return httpPostNew(url, params).then(res => {
      console.log("列表信息:", res);
      if (!res.data || !res.data.length) {
        this.setData({
          list: [],
          total: 0,
          approvingcount: 0,
        });
        return Promise.resolve();
      }
      this.setData({
        list: res.data || [],
        total: res.total,
        approvingcount: res.approvingcount,
        start: start
      });
    });
    return Promise.resolve();
  },

  getHistoryList() {
    let url = HISTORY_LIST_URL;
    let params = {
      loginName: wx.getStorageSync("userInfo").loginName, // 用户登录名
      stationId: this.data.station.id || "", // 媒体车站主键
      positionId: this.data.position.id || "", // 媒体位置主键
      // companyId: this.data.company.id || "", // 广告公司主键
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
      pageNo: 0, // 页数
      pageSize: 10, // 每页加载数量
    };
    httpPost(url, params).then(res => {
      //console.log("审核人 首页list", res);
      this.setData({
        histotyList: res || [],
      });

    });
  },
  /**
   * 点击列表项 直接跳转到详情页
   */
  toDetail(e) {
    // 缓存上刊主键
    // console.log(e);
    let itemId = e.currentTarget.dataset.id;
    wx.setStorageSync("itemId", itemId);
    // 缓存上刊编号
    let previousno = e.currentTarget.dataset.previousno;
    wx.setStorageSync("previousno", previousno);

    // 跳转到详情页并传点击项数据
    let item = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: "../details/details?item=" + JSON.stringify(item)
      });

    // wx.navigateTo({
    //     url: "../details_wx/details_wx?dwId=" + itemId + "&loginName=" + wx.getStorageSync("userInfo").loginName + "&userId=" + wx.getStorageSync("userInfo").accountId
    //   });

    //console.log(wx.getStorageSync("userInfo").roleType, "item");
    // if (wx.getStorageSync("userInfo").roleType == "2") {
    //   wx.navigateTo({
    //     url: "../details_wx_station/details_wx_station?dwId=" + itemId + "&loginName=" + wx.getStorageSync("userInfo").loginName + "&userId=" + wx.getStorageSync("userInfo").accountId
    //   });
    // }else{
    //   wx.navigateTo({
    //     url: "../details/details?item=" + JSON.stringify(item)
    //   });
    // }

  },
  /**
   * 点击列表项 直接跳转到详情页
   */
  // toHriDetail(e) {
  //   // 缓存上刊主键
  //   let itemId = e.currentTarget.dataset.id;
  //   wx.setStorageSync("itemId", itemId);
  //   // 缓存上刊编号
  //   let previousno = e.currentTarget.dataset.previousno;
  //   wx.setStorageSync("previousno", previousno);
  //   // 跳转到详情页并传点击项数据
  //   let item = e.currentTarget.dataset.item;
  //   wx.navigateTo({
  //     url: "../hriDetail/hriDetail?item=" + JSON.stringify(item)
  //   });
  // },



  onReachBottom: function() {
    let medialocation = '';
    if (this.data.ssl[this.data.multiIndex[0]].traintypeList[this.data.multiIndex[1]].marshallingList.length != 0) {
      medialocation = this.data.ssl[this.data.multiIndex[0]].traintypeList[this.data.multiIndex[1]].marshallingList[this.data.multiIndex[2]].medialocationName; //所属区域
    } else {
      medialocation = "";
    }
    let num = this.data.end * (this.data.start + 1);
    let hasMore = this.data.total > num ? true : false;
    if (!hasMore) {
      return;
    }
    //console.log('bottom', this.data);
    this.setData({
      start: this.data.start + 1,
      isLoading: true,
    })

    let url = VERIFY_LIST_URL;
    let params = {
      loginName: wx.getStorageSync("userInfo").loginName || this.data.loginName || '', // 用户登录名
      properystation: this.data.ssl[this.data.multiIndex[0]].traintypeList[this.data.multiIndex[1]].properystationid || "", // 媒体车站主键
      medialocation: medialocation || "", // 媒体位置主键
      publType: this.data.ssl[this.data.multiIndex[0]].publType || "", //上刊类型
      mediatype: this.data.ssl[this.data.multiIndex[0]].traintypeList[this.data.multiIndex[1]].properystationname, //列车车型
      condition: this.data.input || "",
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau ||this.data.railwaybureau||'', // 路局编码
      roleType: wx.getStorageSync("userInfo").roleType ||this.data.roleType || "",
      start: this.data.start, // 页数
      end: this.data.end, // 每页加载数量
    };
    httpPostNew(url, params).then(res => {
      //console.log("审核人 首页list", res);
      if (!res.data || !res.data.length) return;
      this.setData({
        isLoading: false,
        list: [...this.data.list, ...res.data] || [],
        total: res.total,
        approvingcount: res.approvingcount,
      });
      wx.hideLoading();
    });

  },
  // 退出登录
  main() { 
      wx.navigateTo({
        url: "../../old/main/main" 
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options != null) {
      if (options.loginName && options.loginName != "undefined" &&options.railwaybureau && options.railwaybureau != "undefined") {
        this.setData({
          loginName: options.loginName,
          railwaybureau: options.railwaybureau,
        })
        let url = MAIN_URL;
        let params = {
          loginName: options.loginName,
          railwaybureau: options.railwaybureau,
        }
        httpPostNew(url, params).then(res => {
          if (res.data && res.data != "undefined") {
            wx.setStorageSync("userInfo", res.data);
          }
        })
      }
      
      if (options.roleType && options.roleType != "undefined") {
        this.setData({
          roleType: options.roleType,
        })
      }
    }
    
  },
  approveHistory: function() {
    wx.navigateTo({
      url: '../../new/approveHistory/approveHistory',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  more: function() {
    var that = this;
    that.setData({
      Num: this.data.Num + 5
    })
  },
  moreTwo: function() {
    var that = this;
    that.setData({
      NumTwo: this.data.NumTwo + 5
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    Promise.all([this.getVerifyList(0), this.getPickerList()]).then(() => {
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
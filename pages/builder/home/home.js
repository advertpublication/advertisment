import {
  httpPost,
  httpPostNew
} from "../../../utils/util.js";
const BULID_LIST_URL = "/bulidList"; // 施工列表
const WECHAT_LIST_URL = "/wechatBuildList";
const HISTORY_LIST_URL = "/processHistoryList"; //施工历史列表
const OPTIONS_URL = "/screen"; // picker选项
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //页码
    start: 0,
    //煤业加载数量
    end: 10,
    //上刊待施工
    buildingcount: 0,
    //列表总数
    total: 0,
    input: "", // 输入框内容
    station: { // 过滤车站
      id: "",
      name: "请选择区域"
    },
    position: { // 过滤位置
      id: "",
      name: "",
    },
    type: { // 过滤公司
      id: "",
      name: ""
    },
    flag: 0, //小程序,公众号的标识
    list: [], // 未处理列表
    ssl: [],
    thisSheng: 0,
    multiIndex: [0, 0, 0],
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
    let url = BULID_LIST_URL;
    let params = {
      ids: wx.getStorageSync("userInfo").accountId, //用户id
      loginName: wx.getStorageSync("userInfo").loginName, // 用户登录名
      properystation: this.data.ssl[this.data.multiIndex[0]].traintypeList[this.data.multiIndex[1]].properystationid || "", // 媒体车站主键
      medialocation: medialocation || "", // 媒体位置主键
      publType: this.data.ssl[this.data.multiIndex[0]].publType || "", //上刊类型
      userType: wx.getStorageSync("userInfo").type,//用户类型
      mediatype: this.data.ssl[this.data.multiIndex[0]].traintypeList[this.data.multiIndex[1]].properystationname, //列车车型
      condition: this.data.input || "",
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
      start: this.data.start, // 页数
      end: this.data.end, // 每页加载数量
    };
    httpPostNew(url, params).then(res => {
      if (!res.data || !res.data.length) {
        this.setData({
          list: [],
          total: 0,
          buildingcount: 0,
        });
        wx.hideLoading()
        return;
      }
      this.setData({
        list: res.data || [],
        total: res.total,
        buildingcount: res.buildingcount,
        start: 0
      });
      wx.hideLoading();
    });
  },

  /**
   * 获取 施工 首页列表
   */
  getBulidList(start) {
    //console.log("开始页",start);
    let url = BULID_LIST_URL;
    start = start ? start : 0;
    let params = {
      ids: wx.getStorageSync("userInfo").accountId, //用户id
      loginName: wx.getStorageSync("userInfo").loginName, // 用户登录名
      properystation: this.data.station.id || "", // 媒体车站主键
      medialocation: this.data.position.id || "", // 媒体位置主键
      // contractId: this.data.company.id || "", // 广告公司主键
      mediatype: this.data.type.name || "", //媒体类型
      userType: wx.getStorageSync("userInfo").type,//用户类型
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
      start: start, // 页数
      end: this.data.end, // 每页加载数量
    };
    return httpPostNew(url, params).then(res => {
      console.log(res,"res")
      if (!res.data || !res.data.length) {
        this.setData({
          list: [],
          total: 0,
          buildingcount: 0
        });
        return Promise.resolve();
      }
      //console.log("施工首页list",res.data)
      this.setData({
        list: res.data || [],
        total: res.total,
        buildingcount: res.buildingcount,
        start: start
      });
      return Promise.resolve();
    });
  },

  /**
   * 初始化picker数据，填充筛选条件
   */
  getPickerList() {
    let url = OPTIONS_URL;
    let params = {
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
      loginName: wx.getStorageSync("userInfo").loginName //登录名
    }

    return httpPost(url, params).then(res => {
      //  console.log(res, "res");
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
    let url = BULID_LIST_URL;
    let params = {
      ids: wx.getStorageSync("userInfo").accountId, //用户id
      loginName: wx.getStorageSync("userInfo").loginName, // 用户登录名
      properystation: this.data.ssl[e.detail.value[0]].traintypeList[e.detail.value[1]].properystationid || "", // 媒体车站主键
      medialocation: medialocation || "", // 媒体位置主键
      publType: this.data.ssl[e.detail.value[0]].publType || "", //上刊类型
      userType: wx.getStorageSync("userInfo").type,//用户类型
      mediatype: this.data.ssl[e.detail.value[0]].traintypeList[e.detail.value[1]].properystationname, //列车车型
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
      userType: wx.getStorageSync("userInfo").type,//用户类型
      start: this.data.start, // 页数
      end: this.data.end, // 每页加载数量
    };
    httpPostNew(url, params).then(res => {
      if (!res.data || !res.data.length) {
        this.setData({
          list: [],
          total: 0,
          buildingcount: 0,
        });
        wx.hideLoading()
        return;
      }
      this.setData({
        list: res.data || [],
        total: res.total,
        buildingcount: res.buildingcount,
      });
      wx.hideLoading()
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
   * 点击列表项 直接跳转到详情页
   */
  toDetail(e) {
    // 缓存上刊主键
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
    //   url: "../details_wx/details_wx?dwId=" + itemId + "&loginName=" + wx.getStorageSync("userInfo").loginName + "&userId=" + wx.getStorageSync("userInfo").accountId
    // });
//施工确认页面
    // wx.navigateTo({
    //   url: "../details_wx_confirm/details_wx_confirm?dwId=" + itemId + "&loginName=" + wx.getStorageSync("userInfo").loginName + "&userId=" + wx.getStorageSync("userInfo").accountId
    // });
  },
  /**跳转到我的页面 */
  main() {
    wx.navigateTo({
      url: "../../old/main/main"
    });
  },
  onReachBottom: function() {
    
    let medialocation = '';
    if (this.data.ssl[this.data.multiIndex[0]].traintypeList[this.data.multiIndex[1]].marshallingList.length != 0) {
      medialocation = this.data.ssl[this.data.multiIndex[0]].traintypeList[this.data.multiIndex[1]].marshallingList[this.data.multiIndex[2]].medialocationName; //所属区域
    } else {
      medialocation = "";
    }
    let num = this.data.end * (this.data.start);
    let hasMore = this.data.total > num ? true : false;
    // console.log('bottom', this.data)
    if (!hasMore) {
      return;
    }

    this.setData({
      start: this.data.start + 1,
      isLoading: true,
    })
    // this.getBulidList(this.data.start);
    let url = BULID_LIST_URL;
    // start = start ? start : 0;
    let params = {
      ids: wx.getStorageSync("userInfo").accountId, //用户id
      loginName: wx.getStorageSync("userInfo").loginName, // 用户登录名
      properystation: this.data.ssl[this.data.multiIndex[0]].traintypeList[this.data.multiIndex[1]].properystationid || "", // 媒体车站主键
      medialocation: medialocation || "", // 媒体位置主键
      publType: this.data.ssl[this.data.multiIndex[0]].publType || "", //上刊类型
      mediatype: this.data.ssl[this.data.multiIndex[0]].traintypeList[this.data.multiIndex[1]].properystationname, //列车车型
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
      start: this.data.start, // 页数
      end: this.data.end, // 每页加载数量
    };
    httpPostNew(url, params).then(res => {
      //console.log("分页施工首页list", res);
      if(res.data){
        this.setData({
          list: [...this.data.list, ...res.data] || [],
          total: res.total,
          buildingcount: res.buildingcount,
        });
      }

      wx.hideLoading();
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  buildHistory: function() {
    wx.navigateTo({
      url: '../../builder/builderHistory/builderHistory',
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.getBulidList(); //加载列表
    // this.getPickerList(); //初始化pick中的数据
    Promise.all([this.getBulidList(0), this.getPickerList()]).then(() => {
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
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {

  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
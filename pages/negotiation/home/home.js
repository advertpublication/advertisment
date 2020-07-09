import {
  httpPost,
  httpPostNew
} from "../../../utils/util.js";
const NEG_LIST_URL = "/negotiationList"; //洽谈列表
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
     //洽谈列表
     list: [], 
     ssl: [],
     multiIndex: [0, 0, 0],
  },

  /**
   * 得到洽谈列表
   */
  getNegotiationList(start){
    let url = NEG_LIST_URL;
    start = start ? start : 0;
    let params = {
      start: start, // 页数
      end: this.data.end, // 每页加载数量
    };
    return httpPostNew(url, params).then(res => {
       console.log("列表信息:", res);
      if (!res.data || !res.data.length) {
        this.setData({
          list: [],
        });
        return Promise.resolve();
      }
      this.setData({
        list: res.data || [],
      });
    });
    return Promise.resolve();
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
      //  wx.navigateTo({
      //   url: "../details_wx/details_wx?dwId=" + itemId + "&loginName=" + wx.getStorageSync("userInfo").loginName + "&userId=" + wx.getStorageSync("userInfo").accountId
      // });

    wx.navigateTo({
      url: "../details/details?item=" + JSON.stringify(item)
    });
    // wx.navigateTo({
    //   url: "../../builder/details_wx_confirm/details_wx_confirm?dwId=" + itemId + "&loginName=" + wx.getStorageSync("userInfo").loginName + "&userId=" + wx.getStorageSync("userInfo").accountId
    // });
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

    // 退出登录
    main() { 
      wx.navigateTo({
        url: "../../old/main/main" 
      });
  },

   /**
   * 初始化picker数据，填充筛选条件
   */
  getPickerList() {
    let url = OPTIONS_URL;
    let params = {
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau || this.data.railwaybureau || '', // 路局编码
      loginName: wx.getStorageSync("userInfo").loginName || this.data.loginName || '',//登录名
      id: wx.getStorageSync("userInfo").id//登录用户id
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau || '', // 路局编码
    });
    Promise.all([this.getNegotiationList(0),this.getPickerList()]).then(() => {
      wx.hideLoading();
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

  }
})
import { httpPost } from "../../../utils/util.js";
const Up_URL = "/parameterUP"; // 修改上刊状态
const Verifier_URL = "/approval"; // 审核人 业务审批


Page({

  /**
   * 页面的初始数据
   */
  data: {
    business: "", // 业务
    acceptancestatus: "", // 上刊受理状态
    flowstatus: "", // 流程审批状态
    submission: "", // 提交状态
    name: "", // 操作功能
    item: "", // 点击项数据
  },

  /**
   * 受理人 修改上刊状态
   */
  parameterUP(e) {
    // 清空参数
    this.setData({
      "acceptancestatus": "",
      "flowstatus": "",
      "submission": ""
    });

    let id = e.currentTarget.id;
    if (id == "accept") {
      this.setData({
        "acceptancestatus": "1",
        "name": "上刊受理"
      });
    } else if (id == "deny") {
      this.setData({
        "acceptancestatus": "2",
        "name": "驳回申请"
      });
    } else if (id == "revoke") {
      this.setData({
        "flowstatus": "2",
        "name": "撤销"
      });
    }

    let params = {
      id: wx.getStorageSync("itemId"), // 上刊主键
      accountId: wx.getStorageSync("userInfo").accountId, //用户主键
      userName: wx.getStorageSync("userInfo").name, //用户姓名
      name: this.data.name, //操作功能
      submission: this.data.submission || "", // 提交状态
      acceptancestatus: this.data.acceptancestatus || "", // 上刊受理状态
      flowstatus: this.data.flowstatus || "", // 流程审批状态
    };

    httpPost(Up_URL, params).then(res => {
      // console.log(res);
      wx.navigateBack({
        delta: 1
      })
    });
  },


  /**
   * 提交审批
   */
  toSubmit() {
    wx.navigateTo({
      url: "../approve_setting/approve_setting"
    })
  },

  // 审核人 业务审批
  examine(e) {
    // 清空参数
    this.setData({
      "acceptancestatus": "",
      "flowstatus": "",
      "submission": ""
    });

    let id = e.currentTarget.id;
    if (id = 'approve') {
      //同意
      this.setData({
        "flowstatus": "1",
        // "name": "同意"
      });
    } else if (id == 'reject') {
      //驳回
      this.setData({
        "flowstatus": "0",
        // "name": "驳回"
      })
    } else if (id == 'reject-back') {
      //驳回上一级
      this.setData({
        "flowstatus": "3",
        // "name": "驳回上一级"
      })
    } else if (id == 'returns') {
      this.setData({
        "flowstatus": "1",
        // "name": "提交审批"
      })
    }
    let params = {
      id: wx.getStorageSync("itemId"), // 上刊主键
      accountId: wx.getStorageSync("userInfo").accountId, //用户主键
      userName: wx.getStorageSync("userInfo").name, //用户姓名
      flowstatus: this.data.flowstatus, // 流程审批状态
    };
    // console.log(params);
    httpPost(Verifier_URL, params).then(res => {
      wx.navigateBack({
        delta: 1
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      business: wx.getStorageSync("business")
    });

    if (options.item && options.item != "undefined") {
      this.setData({
        item: JSON.parse(options.item) //详情页数据
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
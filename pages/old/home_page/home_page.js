import { httpPost } from "../../../utils/util.js";
const LIST_URL = "/publishlist"; // 受理人列表
const VERIFY_LIST_URL = "/publishApprovalList"; // 审核人列表

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "", // 用户身份
    business: "", // 业务
    list: [], // 列表
  },

  /**
   * 获取 受理人 首页列表
   */
  getList(){
    let url = LIST_URL;
    let params = {
      submission: "", // 提交状态
      acceptancestatus: 0, // 上刊受理状态
      flowstatus: "", // 流程审批状态
      stationId: "", // 媒体车站主键
      positionId: "", // 媒体位置主键
      companyId: "", // 广告公司主键
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
      pageNo: 0, // 页数
      pageSize: 10, // 每页加载数量
    };

    httpPost(url, params).then(res => {
      console.log("受理人首页list", res);
      this.setData({
        list: res || []
      });
    });
  },

  /**
   * 获取 审核人 首页列表
   */
  getVerifyList() {
    let url = VERIFY_LIST_URL;
    let params = {
      loginName: wx.getStorageSync("userInfo").loginName, // 用户登录名
      stationId: "", // 媒体车站主键
      positionId: "", // 媒体位置主键
      companyId: "", // 广告公司主键
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
      pageNo: 0, // 页数
      pageSize: 10, // 每页加载数量
    };

    httpPost(url, params).then(res => {
      console.log("首页list", res);
      this.setData({
        list: res || []
      });
    });
  },

  /**
   * 跳转到 修改密码
   */
  changePwd() {
    wx.navigateTo({
      url: "../main/main"
    });
  },

  /**
   * 跳转到列表页
   */
  toList(e) {
    let business = e.currentTarget.dataset.business;
    wx.setStorageSync("business", business);
    wx.navigateTo({
      url: "../list/list"
    });
  },

  /**
   * 点击列表项 直接跳转到详情页
   */
  toDetail(e) {
    // 缓存业务状态
    let id = wx.getStorageSync("id");
    if (id == "proposer") {
      wx.setStorageSync("business", "proposer-apply");
    } else if (id == "verifier") {
      wx.setStorageSync("business", "verifier-approve")
    }

    // 缓存上刊主键
    let itemId = e.currentTarget.dataset.id;
    wx.setStorageSync("itemId", itemId);
    // 缓存上刊编号
    let previousno = e.currentTarget.dataset.previousno;
    wx.setStorageSync("previousno", previousno);

    // 跳转到详情页并传点击项数据
    // console.log("点击的列表项", e);
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: "../detail/detail?item=" + JSON.stringify(item)
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    this.setData({
      id: wx.getStorageSync("id")
    });
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
    let id = wx.getStorageSync("id");
    if(id == "proposer"){ // 受理人
      this.getList();
    }else if(id == "verifier"){ // 审核人
      this.getVerifyList();
    }
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
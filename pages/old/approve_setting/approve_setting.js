import { httpPost } from "../../../utils/util.js";
const LIST_URL = "/nodelist"; // 审批环节列表
const DEL_URL = "/delNode"; // 删除环节
const LAUNCH_URL = "/launch"; // 发起审批
const UP_URL = "/parameterUP"; // 提交审批


Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 审批环节列表
  },

  /**
   * 获取审批环节
   */
  getList() {
    let url = LIST_URL;
    let itemId = wx.getStorageSync("itemId");
    let params = {
      id: itemId
    }
    httpPost(url, params).then(res => {
      console.log(res);
      this.setData({
        list: res || []
      });
    });
  },

  /**
   * 创建新环节
   */
  addNode(){
    wx.navigateTo({
      url: "../three/three?flag=add"
    });
  },

  /**
   * 修改环节
   */
  updateNode(e){
    let nodeId = e.currentTarget.id;
    wx.navigateTo({
      url: "../three/three?flag=update&nodeId=" + nodeId
    });
  },

  /**
   * 删除环节
   */
  deleteNode(e){
    // console.log(e);
    let nodeId = e.currentTarget.id;

    let url = DEL_URL;
    let params = {
      id: nodeId
    };
    httpPost(url, params).then(res => {
      console.log(res);
      
      this.getList();
    });
  },
  
  /**
   * 发起审批
   */
  doLaunch(){
    let url = LAUNCH_URL;
    let params = {
      id: wx.getStorageSync("itemId"), // 上刊主键
      accountId: wx.getStorageSync("userInfo").accountId, // 用户主键
      previousno: wx.getStorageSync("previousno"),// 上刊编号
      userName: wx.getStorageSync("userInfo").name, // 用户姓名
    }
    httpPost(url, params).then(res => {
      this.parameterUP();
    });
  },

  /**
   * 提交审批
   */
  parameterUP(){
    let url = UP_URL;
    let params = {
      id: wx.getStorageSync("itemId"), // 上刊主键
      accountId: wx.getStorageSync("userInfo").accountId,// 用户主键
      username: wx.getStorageSync("userInfo").name, // 用户姓名
      name: "开始审批", // 操作功能
      submission: "1", // 提交状态
      acceptancestatus: "1", // 上刊受理状态
      flowstatus: "1", // 流程审批状态
    };
    httpPost(url, params).then(res => {
      // console.log(res);
      wx.navigateBack({
        delta: 2
      });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if(options && options != "undefined"){
    //   this.setData({
    //     itemId: options.itemId
    //   });
    // }
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
    this.getList();
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
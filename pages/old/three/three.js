import { httpPost } from "../../../utils/util.js";
const ORG_URL = "/approvalPeople";
const ADD_URL = "/addNode";
const UPDATE_URL = "/modifyNode";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0, // 选中组织
    selectedUsers: [], // 选中人员
    organizations: [], // 组织/人员数据
    remark: "", // 备注
  },

  /**
   * 选择组织机构
   */
  tapGroup(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      active: index
    });
  },

  // 选择用户
  tapUser(e){
    let index = e.currentTarget.dataset.select;
    let selectUser=this.data.organizations[this.data.active].subData[index];
    let selectedUsers = this.data.selectedUsers;
    selectedUsers.push(selectUser);
    selectedUsers = Array.from(new Set(selectedUsers));
    // console.log(selectedUsers);
    this.setData({
      selectedUsers,
    });
  },

  //删除已选用户
  tapSelectUser(e){
    let index = e.currentTarget.dataset.index;
    let selectedUsers = this.data.selectedUsers;
    selectedUsers.splice(index, 1);
    this.setData({
      selectedUsers
    });
  },

  /**
   * 输入框输入
   */
  textInput(e){
    this.setData({
      remark: e.detail.value
    });
  },


  /**
   * 获取组织机构和人员
   */
  getOrg(){
    let url = ORG_URL;
    let params = {
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau
    };
    httpPost(url, params).then(res => {
      console.log(res);
      this.setData({
        organizations: res
      });
    });
  },

  /**
   * 点击保存按钮
   */
  saveNode(){
    let flag = this.data.flag;
    if(flag == "add"){
      this.addNode();
    }else if(flag == "update"){
      this.updateNode();
    }
  },

  /**
   * 点击取消按钮, 重置页面数据
   */
  cancel(){
    this.setData({
      active: 0,
      selectedUsers: [],
    });
  },

  /**
   * 创建审批环节
   */
  addNode(){
    let url = ADD_URL;
    let itemId = wx.getStorageSync("itemId");
    let loginName = wx.getStorageSync("userInfo").loginName;
    let selectedIds = this.data.selectedUsers.map(item => {
      return item.id
    }).join(",");
    console.log(selectedIds);
    let params = {
      id: itemId,
      name: loginName,
      userId: selectedIds,
      remark: this.data.remark,
    }

    httpPost(url, params).then(res => {
      console.log(res);
      wx.navigateBack({
        delta: 1
      });
    });
  },

  /**
   * 修改审批环节
   */
  updateNode() {
    let url = UPDATE_URL;

    let nodeId = this.data.nodeId;
    let selectedIds = this.data.selectedUsers.map(item => {
      return item.id
    }).join(",");
    console.log(selectedIds);
    let params = {
      id: nodeId,
      userId: selectedIds,
      remark: this.data.remark,
    }

    httpPost(url, params).then(res => {
      console.log(res);
      wx.navigateBack({
        delta: 1
      });
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.flag && options.flag != "undefined"){
      this.setData({
        flag: options.flag
      });
    }

    if(options.nodeId && options.nodeId != "undefined"){
      this.setData({
        nodeId: options.nodeId
      });
    }

    this.getOrg();
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
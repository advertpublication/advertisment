// pages/history_setting/history_setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: "2019-03-15", // 起始时间
    endDate: "2019-03-15", // 结束时间
    typeList: ["招商合同1", "招商合同2", "招商合同3", "招商合同4"],
    index: 0,
    createInfo: [
      [102, "lif", "2019-01-13  21:12:34", "1级审批", "xx", "102", "第1个审批节点"],
      [102, "lif", "2019-01-13  21:12:34", "1级审批", "xx", "102", "第1个审批节点"],
      [102, "lif", "2019-01-13  21:12:34", "1级审批", "xx", "102", "第1个审批节点"],
    ]
  },

  /**
   * 选择开始时间
   */
  startChange(e){
    this.setData({
      startDate: e.detail.value
    });
  },

  /**
   * 选择结束时间
   */
  endChange(e) {
    this.setData({
      endDate: e.detail.value
    });
  },

  /**
   * 选择模块类型
   */
  pickerChange(e){
    this.setData({
      index: e.detail.value
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
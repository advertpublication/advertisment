import {
  httpPost, httpPostNew
} from "../../../utils/util.js";
import {
  hexMD5
} from "../../../utils/md5.js";
const LOGOUT_URL ="/logout";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, // 用户信息
    buildFlag:false//施工人的标识
  },

  /**
   * 退出登录
   */
  logout(){
    let url = LOGOUT_URL;
    wx.login({
      success:function(res){
        let params = {
          code:res.code, // 用户主键
        };
        //console.log(res.code);
        httpPostNew(url, params).then(res => {
          if(res.data){
              wx.reLaunch({
                url: "../../login/login"
              });
            //清除所有缓存
            wx.clearStorageSync();
          }
        });
      }
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo: userInfo,
      buildFlag: userInfo.type.indexOf('U06') != -1
    });
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
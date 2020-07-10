import { httpPost, httpPostNew } from "../../utils/util.js";
import { hexMD5 } from "../../utils/md5.js";
const LOGIN_URL = "/login";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginName: "", // 用户名
    pwd: "", // 密码
    phone: "", // 电话
  },

  /**
   * 提交表单
   */
  formSubmit(e){
    var self = this
    wx.login({
      success: function (res) {
        let { loginName, pwd, phone } = e.detail.value;
        // 判断非空
        if (!loginName || !pwd) {
          wx.showModal({
            title: '提示',
            content: '用户名或密码为空!',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          return;
        }
        // 数据保存到data
        // self.setData({
        //   loginName,
        //   pwd
        // });
        let url = LOGIN_URL;
        let params = {
          code: res.code,
          loginName: loginName, // 账号
          password: hexMD5(pwd), // 加密密码
        }
        httpPostNew(url, params).then(res => {
          if (res.data && res.data != "undefined") {
          // 缓存用户信息
          wx.setStorageSync("userInfo", res.data);
          // 跳转到上刊审核首页
            if (res.data.type.indexOf("U05")!=-1 || res.data.type.indexOf("U15")!=-1) {
              //上刊施工负责页面
            wx.navigateTo({
              url: "../constructer/home/home"
            });
            } else if (res.data.type != "U05" && res.data.type == "U15"){
              wx.navigateTo({
                url: "../constructer/train_home/train_home"
              });
            } else if (res.data.type.indexOf("U06") != -1 || res.data.type.indexOf("U16") != -1){
            //上刊施工页面
            wx.navigateTo({
              url: "../builder/home/home"
            });
          }else if(res.data.type == "U01" || res.data.type == "U17" ||res.data.type == "U18"){ 
          if (res.data.roleType == "1"){
             //上刊受理页面
            wx.navigateTo({
              url: "../receiver/home/home"
            });
          }else if(res.data.roleType == "3"){
            // wx.navigateTo({
            //   url: "../station_manager/home/home"
            // });
            /**站段洽谈页面 */
            wx.navigateTo({
              url: "../negotiation/home/home"
            });
          }else{
            //上刊审核人页面
            wx.navigateTo({
              url: "../new/home/home"
            });
          }
           
          } 
        }else{
            wx.showModal({
              title: '提示',
              content: res.message,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
        }
          wx.hideLoading();
        });
      }
    });
  },

  /**
   * 登录
   */
  doLogin(){
    let url = LOGIN_URL;
    let params = {
      code:this.data.code,
      loginName: this.data.loginName, // 账号
      password: hexMD5(this.data.pwd), // 加密密码
    }
    httpPost(url, params).then(res => {
      // 缓存用户信息
      wx.setStorageSync("userInfo", res);
      // 跳转到上刊审核首页
      if (res.data.type.indexOf("U05")!=-1 || res.data.type.indexOf("U15")!=-1) {
        //上刊施工负责页面
        wx.navigateTo({
          url: "../constructer/home/home"
        });
      } else if (res.data.type != "U05" && res.data.type == "U15"){
        wx.navigateTo({
          url: "../constructer/train_home/train_home"
        });
      } else if (res.data.type.indexOf("U06") != -1 || res.data.type.indexOf("U16") != -1) {
        //上刊施工页面
        wx.navigateTo({
          url: "../builder/home/home"
        });
      }else if(res.type=="U01"){
        if(res.roleType=="1"){
           //上刊受理页面
          wx.navigateTo({
            url: "../receiver/home/home"
          });
        } else if (res.data.roleType == "3") {
          // wx.navigateTo({
          //   url: "../station_manager/home/home"
          // });
          wx.navigateTo({
            url: "../negotiation/home/home"
          });
        }else{
          //上刊审核页面
          wx.navigateTo({
            url: "../new/home/home"
          });
        }
      
      }
      wx.hideLoading();
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
    var self = this
    wx.login({
      success: function (res) {
        self.setData({
          code: res.code
        });
        let url = LOGIN_URL;
        let params = {
          code: res.code
        }
        httpPostNew(url, params).then(res => {
          // 缓存用户信息
          if (res.data && res.data != "undefined"){
            wx.setStorageSync("userInfo", res.data);
            //跳转到上刊审核首页
            if (res.data.type.indexOf("U05")!=-1 || res.data.type.indexOf("U15")!=-1) {
              //上刊施工负责页面
              wx.navigateTo({
                url: "../constructer/home/home"
              });
            } else if (res.data.type != "U05" && res.data.type == "U15"){
              wx.navigateTo({
                url: "../constructer/train_home/train_home"
              });
            } else if (res.data.type.indexOf("U06") != -1 || res.data.type.indexOf("U16") != -1) {
              //上刊施工页面
              wx.navigateTo({
                url: "../builder/home/home"
              });
            }else if (res.data.type == "U01" || res.data.type == "U17" ||res.data.type == "U18") {
              if (res.data.roleType == "1") {
                //上刊受理页面
                wx.navigateTo({
                  url: "../receiver/home/home"
                });
              } else if (res.data.roleType == "3") {
                // wx.navigateTo({
                //   url: "../station_manager/home/home"
                // });
                wx.navigateTo({
                  url: "../negotiation/home/home"
                });
              } else {
                //上刊审核人页面
                wx.navigateTo({
                  url: "../new/home/home"
                });
              }
            }  
          }
          wx.hideLoading()
        });
      }
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
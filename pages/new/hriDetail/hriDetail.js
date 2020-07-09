import { httpPost } from "../../../utils/util.js";
const VERIFY_HIS_URL = "/approvalLog"; // 历史审核人列表
const Verifier_URL = "/approval"; // 审核人 业务审批
const IMAG_URL = "/getImageByFlag";//资质、点位信息
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: "",// 点击项数据
    examine: false, // 是否显示 审批意见 输入框
    approvalOpinion: '',//审批原因
    flowstatus: '',//审批状态
    starWidth: "102rpx", // 黄星星容器宽度
    history: [ // 审批历史
      // {
      //   name: "张三",
      //   status: "发起审批",
      //   time: "2019.03.27 13:23",
      //   reason: "",
      // },
      // {
      //   name: "李四",
      //   status: "已同意",
      //   time: "2019.03.27 16:11",
      //   reason: "上刊内容正常",
      // },
      // {
      //   name: "王五",
      //   status: "已驳回",
      //   time: "2019.03.27 11:15",
      //   reason: "资质信息不够详细",
      // },
      // {
      //   name: "李四",
      //   status: "已同意",
      //   time: "2019.03.27 16:11",
      //   reason: "资质信息线下已补充",
      // },
    ]
  },

  /**
   * 阻止蒙层下面页面滚动
   */
  preventTouchmove() {

  },

  /**
   * 点击 同意/驳回 按钮
   */
  tapBtn(e) {
    let id = e.currentTarget.id;
    if (id == 'approve') {
      //同意
      this.setData({
        flowstatus: 1
      })
    } else if (id == 'reject') {
      //驳回
      this.setData({
        flowstatus: 0
      })
    }
    this.setData({
      examine: true
    });
  },

  /*
     * 失焦事件
     **/
  textarea: function (e) {
    this.setData({
      approvalOpinion: e.detail.value
    });
  },

  close(){
    wx.navigateBack({
      delta:1
    })
  },
  /**企业信息*/
  companyInfo() {
    let params = {
      type: 0
    };
    httpPost(IMAG_URL, params).then(res => {
      wx.navigateTo({
        url: '../../new/company_info/company_info?imag_url=' + res
      })
    });

  },
  /**点位信息 */
  issueContent() {
    let params = {
      type: 1
    };
    httpPost(IMAG_URL, params).then(res => {
      wx.navigateTo({
        url: '../../new/issue_content/issue_content?imag_url=' + res
      })
    });

  },
  /**
   * 
   */
  imgYu: function (e) {
    console.log(e)
    var src = e.currentTarget.dataset.src;//获取data-src
    var imgList = this.data.item.materialImage;//获取data-list

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList, // 需要预览的图片http链接列表
      fail: function () {
        console.log('图片预览 失败!!');
      }
    })
  },
  /**
   * 
   */
  getVerifyHisList() {
    let url = VERIFY_HIS_URL;
    let id = this.data.item.id; //上刊主键
    let journaltype = "3";//查询类型
    let params = {
      id: id,
      journaltype: journaltype
    };
    httpPost(url, params).then(res => {
      //console.log("审核历史list", res);
      this.setData({
        history: res || [],
      });

    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.item && options.item != "undefined") {
      this.setData({
        item: JSON.parse(options.item) //详情页数据
      });
    }
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
    this.getVerifyHisList(); //加载历史审核人列表
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
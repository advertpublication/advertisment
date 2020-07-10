import {
  httpPost,
  httpPostNew
} from "../../../utils/util.js";
const VERIFY_HIS_URL = "/approvalLog"; // 审批流历史记录
const PRE_VERIFY_HIS_URL = "/preApprovalLog"; //预审审批流历史记录
const Verifier_URL = "/approval"; // 审核人 业务审批
const IMAG_URL = "/getImageByFlag"; //资质、点位信息
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: "", // 点击项数据
    examine: false, // 是否显示 审批意见 输入框
    approvalOpinion: '同意', //审批原因
    flowstatus: '', //审批状态
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
    ],
    isMp4: [], //是否是视频
    constructionStationFlag:1,//是否开启施工洽谈 0-开启，1-不开启
    roleType:""//用户类型
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
        flowstatus: 1,
        approvalOpinion: '同意'
      })
    } else if (id == 'reject') {
      //驳回
      this.setData({
        flowstatus: 0,
        approvalOpinion: '不同意'
      })
    }
    this.setData({
      examine: true
    });
  },

  /*
   * 失焦事件
   **/
  textarea: function(e) {
    this.setData({
      approvalOpinion: e.detail.value
    });
  },

  /**
   * 执行审批
   */
  doApprove() {
    this.setData({
      examine: false
    })
    // let params = {
    //   id: this.data.item.id, // 上刊主键
    //   accountId: wx.getStorageSync("userInfo").accountId, //用户主键
    //   userName: wx.getStorageSync("userInfo").name, //用户姓名
    //   commpentval: this.data.approvalOpinion, //审批意见
    //   flowstatus: this.data.flowstatus, // 流程审批状态
    // };
    // httpPost(Verifier_URL, params).then(res => {
    //   wx.hideLoading();
    //   wx.navigateBack({
    //     delta: 1
    //   })
    // });
    var approveResult = this.approve(Verifier_URL);

  },
  approve(Verifier_URL) {
    console.log(this.data.item);
    this.setData({
      examine: false
    })
    let params = {
      id: this.data.item.id, // 上刊主键
      accountId: wx.getStorageSync("userInfo").accountId, //用户主键
      userName: wx.getStorageSync("userInfo").name, //用户姓名
      loginName:wx.getStorageSync("userInfo").loginName,//用户登录名
      commpentval: this.data.approvalOpinion, //审批意见
      //flowstatus: this.data.flowstatus, // 流程审批状态
      acttaskid:this.data.item.taskId || '',//任务id
      dwProcessId:this.data.item.procesId || '',//副流程id
      processType:this.data.item.processType || '',//流程类型 1-主流程 2-副流程
      isok:this.data.flowstatus,//1-同意 0-驳回 
    };
    httpPostNew(Verifier_URL, params).then(res => {
     console.log(res, "返回值结果！");
      if (res.message.indexOf("审批成功") != -1) {
        console.log(res.obj);
        if (res.obj && res.obj != "undefined") {
         wx.redirectTo({
            url: "../details/details?item=" + JSON.stringify(res.obj)
          });
        } else {
          // wx.showToast({
          //   title: "审批完毕",
          //   icon: 'success',
          //   duration: 3000,
          // })
          wx.redirectTo({
            url: "../home/home"
          });
        }
      } else if (res.message.indexOf("审批成功") == -1) {
        wx.showToast({
          title: res.message,
          icon: 'fail',
          duration: 3000,
        })
      }
      // wx.hideLoading();
      // wx.navigateBack({
      //   delta: 1
      // })
    });
  },

  noApprove() {
    this.setData({
      examine: false
    })
  },
  /**企业信息*/
  companyInfo() {
    let params = {
      type: 0
    };
    wx.navigateTo({
      url: '../../new/company_info/company_info?qualificationImag=' + JSON.stringify(this.data.item.qualificationImag)
    })
    // httpPost(IMAG_URL, params).then(res => {
    // wx.navigateTo({
    //   url: '../../new/company_info/company_info?imag_url='+res
    // })
    // }); 
  },
  /**媒体详情 */
  mediaInfo() {
    wx.navigateTo({
      url: '../../new/media_info/media_info?dwAdvertinstallresourceList=' + JSON.stringify(this.data.item.dwAdvertinstallresourceList),
    })
  },
  /**点位信息 */
  issueContent() {
    wx.navigateTo({
      url: '../../new/issue_content/issue_content?cmMediaImgList=' + JSON.stringify(this.data.item.cmMediaImgList),
    })
  },

  imgYu: function(e) {
    // console.log(e)
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = this.data.item.materialImage; //获取data-list

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList, // 需要预览的图片http链接列表
      fail: function() {
        console.log('图片预览 失败!!');
      }
    })
  },
  /**
   * 得到审核详情列表
   */
  getVerifyHisList() {
    let url='';//请求路径
    let params={};//请求参数
    let id = this.data.item.id; //上刊主键
    if(wx.getStorageSync('userInfo').roleType && wx.getStorageSync('userInfo').roleType==4){
      url=PRE_VERIFY_HIS_URL
      params={
        id:id,//上刊id
        applyname:this.data.item.contractName,//申请初审的人
        processType:this.data.item.processType,//流程类型
      }
    }else{
      url = VERIFY_HIS_URL;
      let journaltype = "3"; //查询类型
      params = {
        id: id,
        journaltype: journaltype ||'',//审批类型
        flowstatus:this.data.item.flowstatus || '',//审批状态
        dwProcesSetId:this.data.item.dwProcesSetId ||'',//上刊副流程管理id
        acceptancename:this.data.item.acceptancename ||'',//受理人姓名
        flowstatus2:this.data.item.flowstatus2 || '',//审批状态
        applyname:this.data.item.contractName || '',//申请初审的人
      };
    }
    //console.log(this.data.item.flowstatus2);
    httpPost(url, params).then(res => {
      console.log("审核历史list", res);
      this.setData({
        history: res || [],//审批流程
        roleType: wx.getStorageSync("userInfo").roleType //用户类型
      });
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.item && options.item != "undefined") {
      for (var index in JSON.parse(options.item).materialImage) {
        this.data.isMp4[index] = JSON.parse(options.item).materialImage[index].indexOf(".mp4") == -1;
      }
      this.setData({
        item: JSON.parse(options.item), //详情页数据
        isMp4: this.data.isMp4, //是否是视频
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
    this.getVerifyHisList(); //加载历史审核人列表
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
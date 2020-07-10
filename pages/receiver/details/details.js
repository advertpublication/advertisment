import {
  httpPost,
  httpPostNew,
  HOST
} from "../../../utils/util.js";
const DW_APPLY_URL = "/dwadvertinstallApply"; //获取审批流程
const APPROVAL_REJECT_URL = "/acceptancestatus"; //同意驳回接口
const IMAG_URL = "/getImageByFlag"; //资质、点位信息
const INNER_END_URL = "/updateflowstatus1"; //结束内审
const BUILDER_LIST_URL = "/appSelectConstruction"; //得到施工人员列表
const BUILDER_YES_URL = "/ajaxadd";//车站转施工
const VERIFY_HIS_URL = "/approvalLog"; // 历史审核人列表
const PRE_VERIFY_HIS_URL = "/preApprovalLog"; //预审审批流历史记录
const DO_BUILD_APPROVE_AGAIN ="/constructionapprovalagain";//再次开启施工审批
const TRAIN_CONS_URL="/dwAdConstructionByTrain";//列车施工分配转施工
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: "", // 点击项数据
    commonPath: '', //图片的虚拟路径
    roleType: 0, //用户的角色类型
    examineyes: false, //同意受理弹出框标识
    examine: false, //驳回意见输入框出现的条件
    approvalOpinion: '', //驳回原因
    starWidth: "102rpx", // 黄星星容器宽度
    select: false, //流程下拉框数组
    openInApply: 0, //是否开启内审 0-开启 1-不开启
    innerexamine: false, //是否结束内审 false-不开启 true-开启
    outerexamine: false, //是否结束外审 false-不结束 true-结束
    endbuildexamine:false,//是否转施工申请 false-否 true是
    // pickerArray: [],
    // pickerIndex: [0, 0, 0], // picker选中项
    ssl: [], //三级联动json数据
    thisSheng: 0,
    multiIndex: [0, 0, 0],
    checkitems: [{
        name: '0',
        value: '内审',
        color: 'green',
        checked: 'true',
        disabled: false
      },
      {
        name: '2',
        value: '外审',
        checked: 'true',
        color: 'green',
        disabled: true
      },
    ],
    loginName: '', //施工负责人姓名
    isMp4: [], //是否是视频
    selectArray: [],
    dwProcesSetId: '', //选中的流程的id
    history: [], // 审批历史
    constructionApproval: 0, //转施工审批操作权限
    examinebuild: false, //转施工审批 false - 否 true-是
    distribution: false,
    DistributionData: [[]],
    areaInfo: [[]],//转施工人员回显
    srrpop: [],//二维数组
  },

  /**
   * 跳转到 企业信息
   */
  companyInfo() {
    wx.navigateTo({
      url: '../../new/company_info/company_info?qualificationImag=' + JSON.stringify(this.data.item.qualificationlist)
    })
  },

  /**施工分配 */
  saveConsDist() {
    this.setData({
      distribution: !this.data.distribution
    })
  },
  /**添加施工分配 */
  addDistribution() {
    let arr = this.data.DistributionData
    let areaInfo = this.data.areaInfo
    arr.push([])
    areaInfo.push([])
    console.log(arr)
    this.setData({
      areaInfo: areaInfo,
      DistributionData: arr
    })
  },
  /**删除施工分配 */
  delDistribution(e) {
    let index = e.target.dataset.index
    // let arr = this.data.srrpop
    let DistributionData = this.data.DistributionData
    // arr.splice(index, 1)
    DistributionData.splice(index, 1)
    // console.log(index, arr, 'arr')
    let areaInfo = this.data.areaInfo
    areaInfo.splice(index, 1)
    // console.log(this.data.areaInfo,'areaInfo')

    this.setData({
      // srrpop: arr,
      areaInfo: areaInfo,
      DistributionData: DistributionData
    })
  },
  /**
   * 取消施工分配
   */
  closeDistribution() {
    // let karr=[]
    // this.data.srrpop=[]
    // let arr = this.data.srrpop
    // arr=[]
    this.setData({
      areaInfo:[[]],
      DistributionData:[[]],
      distribution: !this.data.distribution,

    })
  },
  /**
   * 跳转到点位信息
   */
  /**点位信息 */
  issueContent() {
    //console.log(this.data.item.cmMediaImgList);
    wx.navigateTo({
      url: '../../new/issue_content/issue_content?cmMediaImgList=' + JSON.stringify(this.data.item.cmMediaImgList),
    })
  },
  /**
   * 跳转到媒体详情
   */
  mediaInfo() {
    wx.navigateTo({
      url: '../../new/media_info/media_info?dwAdvertinstallresourceList=' + JSON.stringify(this.data.item.dwAdvertinstallresourceList),
    })
  },

  /**
   * 预览 效果图 图片
   */
  previewImage: function(e) {
    //console.log(e)
    let src = e.currentTarget.dataset.src; //获取data-src
    let materiallist = this.data.item.materiallist; //获取data-list
    let imgList = [];
    materiallist.forEach((item, index) => {
      imgList[index] = this.data.item.commonPath + "/" + item.belongdoc + "/" + item.filename
    })
    // 图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList, // 需要预览的图片http链接列表
      fail: function() {
        // console.log('图片预览 失败!!');
      }
    })
  },

  /**
   * 同意申请，得到审批流，并开启内审和外审
   */
  agree() {
    let url = DW_APPLY_URL;
    let params = {
      dwId: this.data.item.id,
      type: "0",
      publType: this.data.item.publType, //上刊类型
      railwayBureau: wx.getStorageSync("userInfo").railwaybureau, //路局编码
    };
    httpPostNew(url, params).then(res => {
      let dwProcesSetId="" //审批流拼接字符串
      if (res.data[0].inApproval == null || res.data[0].inApproval == '') {
        this.data.checkitems[0].checked = false
        this.setData({
          "checkitems[0].checked": false,
          "checkitems[0].disabled": true,
          openInApply: 1
        })
      }
      if(res.data || res.data.length>0){
        for(var i=0;i<res.data.length;i++){
          if(res.data[i].deafultFlag == 0 && res.data[i].delState == 0){
            dwProcesSetId += res.data[i].id+",";
          }
        }
      }

      this.setData({
        selectArray: res.data || [],
        examineyes: true,
        dwProcesSetId:dwProcesSetId
      });
      wx.hideLoading();
    });
  },

  /**
   * 驳回申请，并填写驳回原因，刷新状态
   */
  reject() {
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
   * 得到复选框的属性值
   */
  checkboxChange(e) {
    for (var i = 0; i < e.detail.value.length; i++) {
      if (e.detail.value[i] != "2" && e.detail.value[i] == "0") {
        this.setData({
          openInApply: 0
        })
      } else {
        this.setData({
          openInApply: 1
        })
      }
    }
  },

  /**
   * select下拉框选中得到的值
   */
  getDate: function(e) {
    let dwProcesSetId = e.detail.id;
    this.setData({
      dwProcesSetId: dwProcesSetId,
    })
  },

  /**
   * 执行同意
   */
  doApprove() {
    let acceptancestatus = "1";
    this.doAprAndRec(acceptancestatus);
  },

  /**执行驳回 */
  doReject() {
    let acceptancestatus = "2";
    this.doAprAndRec(acceptancestatus);
  },

  /**
   * 执行受理同意或驳回
   */
  doAprAndRec(acceptancestatus) {
   // console.log(this.data.dwProcesSetId,"this.data.dwProcesSetId");
    if (acceptancestatus == "1") {
      if (this.data.dwProcesSetId == "") {
        wx.showToast({
          title: "请先选择审批流程",
          icon: 'none',
          duration: 2000,
        })
        return;
      }
    }
    let url = APPROVAL_REJECT_URL;
    let dwProcesSetId = (this.data.dwProcesSetId).substring(0,this.data.dwProcesSetId.length-1);
    let params = {
      id: this.data.item.id,
      acceptancestatus: acceptancestatus, //同意
      openInApply: this.data.openInApply, //是否开启内审 
      dwProcesSetId: this.data.dwProcesSetId, //流程id
      railwayBureau: wx.getStorageSync("userInfo").railwaybureau, //路局编码
      loginName: wx.getStorageSync("userInfo").loginName, //用户名
      userId: wx.getStorageSync("userInfo").accountId, //用户id
      remarks:this.data.approvalOpinion,//审批意见
    };
    
    httpPostNew(url, params).then(res => {
     // console.log(res,"受理情况");
      if (res.obj == "1") {
        if (res.message == "受理成功") {
          wx.showToast({
            title: res.message,
            icon: 'none', //图标，支持"success"、"loading" 
            duration: 2000, //提示的延迟时间，单位毫秒，默认：1500 
          })
          this.setData({
            examineyes: false
          })
          wx.navigateBack({
            delta: 1,
          })

        } else if (res.message == "驳回成功") {
          wx.showToast({
            title: res.message,
            icon: 'none', //图标，支持"success"、"loading" 
            duration: 2000, //提示的延迟时间，单位毫秒，默认：1500 
          })
          this.setData({
            examineyes: false,
            examine: false
          })
          wx.navigateBack({
            delta: 1,
          })
        }
      } else if (res.obj == "0") {
        //失败
        console.log("失败!");
      }
      wx.hideLoading();
    });
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
   * 取消驳回
   */
  noApprove() {
    this.setData({
      examine: false,
      examineyes: false,
      dwProcesSetId: ''
    })
  },
  /**
   * 返回，返回到上刊受理列表页
   */
  back() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 下拉框
   */
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      tihuoWay: name,
      select: false,
    })
  },
  /**
   * 结束内审
   */
  endInner() {
    this.setData({
      innerexamine: true
    })
  },
  noInnerApprove() {
    this.setData({
      innerexamine: false
    })
  },
  doInnerReject() {
    let url = INNER_END_URL;
    let params = {
      id: this.data.item.id,
      taskid: this.data.item.actTaskId,
      processType: 4,
      intervene: this.data.approvalOpinion,
      journalid: wx.getStorageSync("userInfo").accountId, //用户id
      journalname: wx.getStorageSync("userInfo").loginName, //用户名
    }
    httpPostNew(url, params).then(res => {
      //console.log("内审结束", res);
      if (res.obj) {
        this.setData({
          innerexamine: false
        })
        wx.hideLoading();
        wx.navigateBack({
          delta: 1,
        })

      }
      wx.hideLoading();
    });
  },
  /**
   * 结束外审
   */
  endOuter() {
    this.setData({
      outerexamine: true
    })
  },
  noOuterApprove() {
    this.setData({
      outerexamine: false
    })
  },
  doOuterReject() {
    let url = INNER_END_URL;
    let params = {
      id: this.data.item.id,
      taskid: this.data.item.actTaskId,
      processType: 5,
      intervene: this.data.approvalOpinion,
      journalid: wx.getStorageSync("userInfo").accountId,
      journalname: wx.getStorageSync("userInfo").loginName
    }
    httpPostNew(url, params).then(res => {
      //console.log("外审结束", res);
      if (res.obj) {
        this.setData({
          outerexamine: false
        })
        wx.hideLoading();
        wx.navigateBack({
          delta: 1,
        })
      }
    });
  },
  /**
   * 得到施工人列表
   */
  getBuilderList() {
    let url = BUILDER_LIST_URL
    let params = {
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, //路局编码
      publType:this.data.item.publType,//上刊类型
    }
    httpPostNew(url, params).then(res => {
      var ssls = res.obj;
      if (!res) {

      } else {
        var sheng = [];
        var shi = [];
        var qu = [];
        for (var i in ssls) {
          sheng.push(ssls[i].companyName)
          if (i == 0) {
            for (var u in ssls[i].nameList) {
              shi.push(ssls[i].nameList[u].name)
              if (u == 0) {
                for (var j in ssls[i].nameList[u].loginNameList) {
                  qu.push(ssls[i].nameList[u].loginNameList[j].loginName)
                }
              }
            }
          }
        }
        //console.log(sheng, shi, qu, "qu");
        this.setData({
          multiArray: [sheng, shi, qu],
          ssl: ssls
        });
      }
      wx.hideLoading();
    });
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
  getCity: function(x, y = 999, z = 999) {
    var ssls = this.data.ssl;
    var shi = [];
    var qu = [];
    for (var i in ssls) {
      if (i == x) {
        for (var u in ssls[i].nameList) {
          shi.push(ssls[i].nameList[u].name)
          if (u == y) {
            for (var j in ssls[i].nameList[u].loginNameList) {
              qu.push(ssls[i].nameList[u].loginNameList[j].loginName)
            }
            break;
          }
          if (y == 999) {
            if (u == 0) {
              for (var j in ssls[i].nameList[u].loginNameList) {
                qu.push(ssls[i].nameList[u].loginNameList[j].loginName)
              }
            }
          }

        }
        break;
      }
    }
    return [shi, qu];
  },
  bindinputAddress(event) {
    console.log(event, 'event')
    // let address = this.data.address;
    // address.address = event.detail.value;
    // this.setData({
    //   address: address
    // });
  },

  changeInput(e){
    this.data.activeIndex = e.target.dataset.index

  },
  // 
  citySure: function (e) {
    console.log(e, this.data.activeIndex,'==e')
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

    var areaInfo = [].concat.apply([], this.data.multiArray);
    this.data.DistributionData[this.data.activeIndex] = e.detail.value
    this.data.areaInfo[this.data.activeIndex] = [areaInfo.join(' - ')]
    console.log(this.data.areaInfo)
    this.setData({
      areaInfo: this.data.areaInfo,
      DistributionData: this.data.DistributionData
    })
  },
  // bindMultiPickerChange
  SubmitDistribution: function(e) {
    // let loginName = '';
    // if (this.data.ssl[e.detail.value[0]].nameList[e.detail.value[1]].loginNameList.length != 0) {
    //   loginName = this.data.ssl[e.detail.value[0]].nameList[e.detail.value[1]].loginNameList[e.detail.value[2]].loginName; //所属区域
    // } else {
    //   loginName = "";
    // }
    // 刷新数据
    let url = BUILDER_YES_URL;
    let params = {
      // loginName: loginName,
      dwId: this.data.item.id,
      shoiArray: JSON.stringify(this.data.DistributionData)
    };
    httpPostNew(url, params).then(res => {
      if (res.obj) {
        wx.showToast({
          title: '转施工成功',
          icon: 'success',
          duration: 2000
        })
        wx.hideLoading();
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  /**转施工申请 */
  toBuildApproval() {
    this.setData({
      examinebuild: true
    })
    let url = DW_APPLY_URL;
    let params = {
      dwId: this.data.item.id,
      type: "0",
      publType: "3", //上刊类型
      railwayBureau: wx.getStorageSync("userInfo").railwaybureau, //路局编码
    };
    httpPostNew(url, params).then(res => {
      this.setData({
        selectArray: res.data || []
      });
      wx.hideLoading();
    });
  },
  /**施工审批取消 */
  noBuildApproval() {
    this.setData({
      examinebuild: false,
      dwProcesSetId: ''
    })
  },
  /**施工审批确定 */
  doBuildApproval() {
   // console.log(this.data.dwProcesSetId == undefined);
    if (this.data.dwProcesSetId == undefined) {
      wx.showToast({
        title: "请先配置流程",
        icon: 'none',
        duration: 2000,
      })
      return;
    } else if (this.data.dwProcesSetId == "") {
      wx.showToast({
        title: "请先选择审批流程",
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    //console.log(this.data.dwProcesSetId)
    let url = APPROVAL_REJECT_URL;
    let bulidApproval = "0";
    let params = {
      id: this.data.item.id,
      acceptancestatus: "1", //同意
      bulidApproval: bulidApproval, //是否是开启施工审批
      dwProcesSetId: this.data.dwProcesSetId, //流程id
      railwayBureau: wx.getStorageSync("userInfo").railwaybureau, //路局编码
      loginName: wx.getStorageSync("userInfo").loginName, //用户名
      userId: wx.getStorageSync("userInfo").accountId, //用户id
    };
    httpPostNew(url, params).then(res => {
      if (res.obj == "1") {
        if (res.message == "开启施工审批成功") {
          wx.showToast({
            title: res.message,
            icon: 'none', //图标，支持"success"、"loading" 
            duration: 2000, //提示的延迟时间，单位毫秒，默认：1500 
          })
          this.setData({
            examinebuild: false
          })
          wx.navigateBack({
            delta: 1,
          })
        }
      } else if (res.obj == "0") {
        //失败
      }
      wx.hideLoading();
    });
  },
  /**结束转施工审批 */
  endBuild(){
   this.setData({
     endbuildexamine:true
   })
  },
  /**取消转施工申请 */
  noEndBuild(){
    this.setData({
      endbuildexamine: false
    })
  },
  /**确定结束转施工审批 */
  doEndBuild() {
    let url = INNER_END_URL;
    let params = {
      id: this.data.item.id,
      taskid: this.data.item.actTaskId,
      processType: 6,
      intervene: this.data.approvalOpinion,
      journalid: wx.getStorageSync("userInfo").accountId,
      journalname: wx.getStorageSync("userInfo").loginName
    }
    httpPostNew(url, params).then(res => {
      //console.log("外审结束", res);
      if (res.obj) {
        this.setData({
          endbuildexamine: false
        })
        wx.hideLoading();
        wx.navigateBack({
          delta: 1,
        })
      }
    });
  },
  toBuildApprovalagain(){
    let url = DO_BUILD_APPROVE_AGAIN;
    let params = {
      dwId: this.data.item.id,
      loginName: wx.getStorageSync("userInfo").loginName
    }
    httpPostNew(url, params).then(res => {
      //console.log("外审结束", res);
      if (res.obj) {
        this.setData({
          endbuildexamine: false
        })
        wx.hideLoading();
        wx.navigateBack({
          delta: 1,
        })
      }
    });
  },
  /**
   * 列车进行直接转施工
   */
  toBuildTrain(){
    let url = TRAIN_CONS_URL;
    let params = {
      dwId: this.data.item.id,
      publType: this.data.item.publType, //上刊类型
      railwayBureau: wx.getStorageSync("userInfo").railwaybureau, //路局编码
    };
    httpPostNew(url, params).then(res => {
      console.log(res.message, res.obj,"列车转施工")
      if (res.obj) {
        wx.hideLoading();
        wx.navigateBack({
          delta: 1,
        })
      }else{
        wx.showToast({
            title: res.message,
            icon: 'success',
            duration: 30000,
          })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.item && options.item != "undefined") {
      //console.log(JSON.parse(options.item))
      for (var index in JSON.parse(options.item).materiallist) {
        this.data.isMp4[index] = JSON.parse(options.item).materiallist[index].filename.indexOf(".mp4") == -1;
      }
      this.setData({
        item: JSON.parse(options.item), //详情页数据
        commonPath: JSON.parse(options.item).commonPath, //图片的虚拟路径
        roleType: wx.getStorageSync("userInfo").roleType,
        isMp4: this.data.isMp4, //是否是视频
        constructionApproval: wx.getStorageSync("constructionApproval"), //转施工审批操作权限
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
    //得到施工人列表
    this.getBuilderList();
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
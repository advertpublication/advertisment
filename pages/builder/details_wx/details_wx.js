import { httpPost, httpPostNew, HOST } from "../../../utils/util.js";
const VERIFY_HIS_URL = "/approvalLog"; // 历史审核人列表
const Verifier_URL = "/approval"; // 审核人 业务审批
const UPLOAD_URL = HOST + "/file";//上刊上传图片
const EXPLAIN_URL = "/saveBulidresult"; //施工反馈结果
const IMAG_URL = "/getImageByFlag";//资质、点位信息
const DETAIL_BUIL_URL ='/details_builder';//施工详情页面
const BUILD_TIME_URL = "/getBuildTime";//得到施工时间
const APPROVE_TIME_URL ="/getApproveTime";//得到审批通过时间
const BUILD_END="/buildEnd";//确定施工完毕给施工负责人或者站段负责人发消息
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: "", // 点击项数据
    flowstatus: '', //审批状态
    starWidth: "102rpx", // 黄星星容器宽度
    constructionexplain: "", // 施工说明
    photoList: [], // 照片
    i: 0,//第几张照片
    success: 0,//上传成功的个数
    fail: 0, //上传失败的个数
    dwId: '',//上刊主键
    advertstatus:'',//上刊状态
    loginName: '',//登录名
    // name: '',//用户姓名
    userId: '',//用户主键
    isMp4: [], //是否是视频
    buildtime:'',//施工时间
    approveTime:'',//审批通过时间
    myArray: [], //存放车底号和索引的数组
    myResourceArray: [], //存放车底号和车底号对应的媒体资源的数组
    traincount: 0//列车的总组数
  },

  /**
   * 输入施工说明
   */
  inputExplain(e) {
    this.setData({
      constructionexplain: e.detail.value
    });
  },

  /**
   * 添加照片
   */
  addPhoto() {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 2000,
          success: function (ress) {
             console.log('成功上传图片');
          }
        })
        const { tempFilePaths } = res;
        //photoList: [...this.data.photoList, ...tempFilePaths]
        this.setData({
          photoList: [...this.data.photoList, ...tempFilePaths]
        });
      },
    })
  },

  /**
   * 预览照片
   */
  previewPhoto(e) {
    var src = e.currentTarget.dataset.src;//获取data-src
    var imgList = []//获取data-list
    if(this.data.item.buildImage.length>0){
      for(var i = 0;i < this.data.item.buildImage.length;i++){
          imgList[i]=this.data.item.buildImage[i].filename
      }
    }
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList, // 需要预览的图片http链接列表
      fail: () => {
        console.log('图片预览 失败!!');
      }
    })
  },

  /**
   * 删除照片
   */
  deletePhoto(e) {
    let index = e.currentTarget.dataset.index;
    const {
      photoList
    } = this.data;
    photoList.splice(index, 1);
    this.setData({
      photoList
    });
  },

  /**
   * 点击 提交 按钮
   */
  tapBtn(e) {
    this.uploadText();
  },
  /**
    * input框
    */
  doInput(e) {
    //console.log(this.data.myResourceArray, "开始")
    var resourceList = this.data.item.dwAdvertinstallresourceList
    var input = e.detail.value;
    var index1 = e.target.dataset.resource;
    var index2 = e.target.dataset.num;
    var myItem = [
      index1,
      index2,
      input
    ];
    var myResourceItem = [
      this.data.item.dwAdvertinstallresourceList[index1],
      index1,
      index2,
      input
    ]
    if (input) {
      //先判断myArray是否为空数组
      if (this.data.myArray.length != 0) {
        if (!this.isSame(myItem)) {
          this.data.myArray.push(myItem);
          this.data.myResourceArray.push(myResourceItem);
        }
      } else {
        this.data.myArray.push(myItem);
        this.data.myResourceArray.push(myResourceItem);
      }
    }
    resourceList = resourceList.map(function (item, index) {
      let [, index1, index2, input] = myResourceItem;
      if (index === index1) {
        item.inputArray[index2] = input;
      }
      return item;
    })
    this.setData({
      item: {
        ...this.data.item,
        dwAdvertinstallresourceList: resourceList
      }
    })
  },

  isSame(myItem) {
    let myArray = this.data.myArray;
    let myResourceArray = this.data.myResourceArray;
    if (myResourceArray.length == 0 || myArray.length == 0) {
      return false;
    }
    return myArray.some(function (item, index) {
      var flag = item.every(function (itm, idx) {
        if (idx < 2) {
          return itm == myItem[idx];
        } else {
          myResourceArray[index][idx + 1] = myItem[idx];
          myArray[index][idx] = myItem[idx];
          return true;
        }
      })
      return flag;
    })
  },

  // Input数组
  myArrayInput() {
    var resourceList = this.data.item.dwAdvertinstallresourceList;
    //console.log(this.data.item, "resourceList");
    resourceList = resourceList.map(function (item, index) {
      var myArrayInput = [];
      for (var i = 0; i < item.mediacount; i++) {
        myArrayInput[i] = ""
      }
      item.inputArray = myArrayInput;
      return item;
    });
    this.setData({
      item: {
        ...this.data.item,
        dwAdvertinstallresourceList: resourceList
      }
    })
    //console.log(this.data.item,"item");
  },

  /**
   * 上传施工说明
   */
  uploadText() {
    let params = {
      userId:this.data.userId,
      dwid: this.data.dwId,//上刊主键
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, //局码
      publType: this.data.item.publType, //上刊类型
      myResourceArray: encodeURIComponent(JSON.stringify(this.data.myResourceArray)), //存放车底号和车底号对应的媒体资源的数组
      traincount: this.data.traincount,//列车的总组数
      constructionexplain: this.data.constructionexplain,//施工结果说明
    }
    if (this.data.item.publType == "1" && this.data.myResourceArray.length == 0) {
      wx.showToast({
        title: '请至少输入一个车底号',
        icon: 'none',
      })
    } else if (this.data.photoList.length == 0) {
      wx.showToast({
        title: '请至少上传一张上刊图',
        icon: 'none',
        duration: 2000
      })
      return;
    } else {
      httpPostNew(EXPLAIN_URL, params)
        .then(res => {
          this.setData({
            drid: res.data.drid,
            advertstatus:res.data.advertstatus
          });

          let resourceList = this.data.item.dwAdvertinstallresourceList;
          if (res.endList) {
            var list = this.distinct(res.endList);
            this.setData({
              myResourceArray: list
            })
          }
          if (res.endList) {
            var endList = res.endList
            for (var i = 0; i < endList.length; i++) {
              var endListItem = endList[i];
              resourceList = resourceList.map(function (item, index) {
                if (endListItem[0] == index) {
                  item.inputArray[endListItem[1]] = '';
                }
                return item;
              })
            }
            this.setData({
              item: {
                ...this.data.item,
                dwAdvertinstallresourceList: resourceList
              }
            })
          }
          if (res.message && res.message.indexOf("不存在") != -1) {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 3000
            });
            //wx.hideLoading();
            return;
          } else if (res.message && res.message.indexOf("重复") != -1) {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 3000
            });
            //wx.hideLoading();
            return;
          }
          this.uploadImage();
        })
        .catch(err => {
          console.log(err);
          wx.hideLoading();
        });
    }
  },

  //查重

  distinct(endList) {
    var myResourceArray = this.data.myResourceArray;
    var myArray = this.data.myArray;
    for (var i = 0; i < endList.length; i++) {
      var endListItem = endList[i];
      myResourceArray = myResourceArray.filter(function (item, index) {
        if (!(endListItem[0] == item[1] && endListItem[1] == item[2])) {
          return item;
        }
      })

      myArray = myArray.filter(function (item, index) {
        if (!(endListItem[0] == item[0] && endListItem[1] == item[1])) {
          return item;
        }
      })
    }
    this.setData({
      myArray
    })
    return myResourceArray;
  },

  /**
   * 上传图片
   */
  uploadImage() {
    let that = this,
      i = this.data.i ? this.data.i : 0,//当前上传的哪张图片
      success = this.data.success ? this.data.success : 0,//上传成功的个数
      fail = this.data.fail ? this.data.fail : 0;//上传失败的个数

    wx.showToast({
      title: '正在上传第' + (i + 1) + '张',
      icon: 'success',
      duration: 2000
    });

    wx.uploadFile({
      url: UPLOAD_URL,
      filePath: this.data.photoList[this.data.i],
      formData: {
        drid: this.data.drid,
        type: 'media_build'
      },
      name: 'file',
      success: res => {
        console.log(JSON.parse(res.data).code == 0);
        if (res.statusCode == 200 && JSON.parse(res.data).code == 0) {
          success++ //图片上传成功，图片上传成功的变量+1

          let i = this.data.i;
          i++;//这个图片执行完上传后，开始上传下一张
          this.setData({
            i
          });

          if (this.data.i == this.data.photoList.length) {
            console.log('成功：' + success + " 失败：" + fail);
           this.getDetailsBuilder()
           if(this.data.item.publType=='1'){
             this.setData({
               photoList:[],
               i:0,
               myArray:[],
               myResourceArray:[]
             })
           }
          } else {
            that.uploadImage();
          }
        } else {
          wx.showToast({
            title: '上传失败，请重新上传图片',
            icon: 'fail',
            duration: 2000
          });
        }
        wx.hideLoading();
      },
      fail: err => {
        fail++;//图片上传失败，图片上传失败的变量+1
        wx.showToast({
          title: '上传失败，请重新上传图片',
          icon: 'fail',
          duration: 2000
        });
        wx.hideLoading();
      }
    });
  },

  /**
   * 跳转到 企业信息
   */
  companyInfo() {
    let params = {
      type: 0
    };
    wx.navigateTo({
      url: '../../new/company_info/company_info?qualificationImag=' + JSON.stringify(this.data.item.qualificationImag)
    })
  },

  /**点位信息 */
  issueContent() {
    wx.navigateTo({
      url: '../../new/issue_content/issue_content?cmMediaImgList=' + JSON.stringify(this.data.item.cmMediaImgList),
    })
  },

  /**媒体详情 */
  mediaInfo() {
    wx.navigateTo({
      url: '../../new/media_info/media_info?dwAdvertinstallresourceList=' + JSON.stringify(this.data.item.dwAdvertinstallresourceList),
    })
  },
  
  /**
   * 预览 
   * 效果图 图片
   */
  previewImage: function (e) {
    // console.log(e)
    let src = e.currentTarget.dataset.src; //获取data-src
    let imgList = this.data.item.materialImage; //获取data-list

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList, // 需要预览的图片http链接列表
      fail: function () {
        // console.log('图片预览 失败!!');
      }
    })
  },
  //得到施工详情页信息 
  getDetailsBuilder() {
    console.log("dejio");
    let url = DETAIL_BUIL_URL;
    let id = this.data.dwId; //上刊主键
    let userId= this.data.userId;
    let loginName=this.data.loginName;
    let params = {
      dwId: id,
      loginName: loginName,
      userId: userId
    };
    httpPostNew(url, params).then(res => {
      for (var index in res.obj.materialImage) {
        this.data.isMp4[index] = res.obj.materialImage[index].indexOf(".mp4") == -1;
      }
      let traincount = 0;
      for (var index in res.obj.dwAdvertinstallresourceList) {
        traincount += parseInt(res.obj.dwAdvertinstallresourceList[index].mediacount);
      }
      this.setData({
        item: res.obj || [],
        isMp4: this.data.isMp4, //是否是视频
        traincount: traincount
      });
      // this.getBuildTime(res.obj);
      this.getApproveTime(res.obj);
      this.myArrayInput();
    });
   
  },

  //得到施工时间
  // getBuildTime(item) {
  //   let url = BUILD_TIME_URL;
  //   let params = {
  //     dwId: item.id,
  //     userId:userId
  //   };
  //   httpPost(url, params).then(res => {
  //     this.setData({
  //       buildtime: res[0].consTime
  //     });
  //     wx.hideLoading();
  //   });
  // },

  /**
   * 得到施工通过时间
   */
  getApproveTime(item) {
    let url = APPROVE_TIME_URL;
    let params = {
      dwId: item.id,
    };
    httpPostNew(url, params).then(res => {
     // console.log(res);
      this.setData({
        approveTime: res.obj
      });
      wx.hideLoading();
    });
  },

   //施工完毕提交给施工负责人或者站段负责人进行施工确认
   buildEnd(){
    let url= BUILD_END;
    let params={
      id:this.data.item.id,//上刊id
      railwaybureau:this.data.item.railwaybureau ||'',//局码
      publType:this.data.item.publType,//上刊类型
    }
    httpPostNew(url, params).then(res => {
     if(res.obj){
      wx.showToast({
        title: "施工完毕待负责人确认",
        icon: 'none',
        duration: 30000,
        success:function(){
          this.onShow();
        }
      });
     }else{
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 5000
      });
     }
      wx.hideLoading()
    });
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options != null) {
      if (options.dwId && options.dwId != "undefined") {
        this.setData({
          dwId: options.dwId,
        })
      }
      if (options.loginName && options.loginName != "undefined") {
        this.setData({
          loginName: options.loginName,
        })
      }
      if (options.userId && options.userId != "undefined") {
        this.setData({
          userId: options.userId,
        })
      }
    }
    //this.myArrayInput();
    this.getDetailsBuilder();
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
    //this.getDetailsBuilder();//得到施工详情页
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
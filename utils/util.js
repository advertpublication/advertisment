  // const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second =/ date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

/*1*************************/
const HOST = "https://ad.12306.cn/app/advertpublication/admin/app/publish/";
//HOST ="http://172.20.10.2:8081/admin/app/publish";
//const HOST ="http://localhost:8080/advertpublication/admin/app/publish";
//const HOST="https://ad.12306.cn/app/advert_test/admin/app/publish";
// const HOST = "http://localhost:8080/admin/app/publish";

/**
 * get请求
 */
const httpGet = (url, data={}) => {
  wx.showLoading({
    title: '加载中',
  });

  return new Promise((resolve, reject) => {
    wx.request({
      method: "GET",
      url: HOST + url,
      data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if(res.statusCode == 200 && res.data.code == 0){
          resolve(res.data.data);
        }else{
          reject(res.data.message);
        }

        wx.hideLoading();
      },
      fail(err) {
        console.log(err);
        wx.hideLoading();
      }
    });
  });
}

/**
 * post 请求
 */
const httpPost = (url, data = {}) => {
  wx.showLoading({
    title: '加载中',
  });

  return new Promise((resolve, reject) => {
    wx.request({
      method: "POST",
      url: HOST + url,
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        //console.log(res);
        if (res.statusCode == 200 && res.data.code == 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.message);
        }

        // wx.hideLoading();
      },
      fail(err) {
        //console.log(err+"1111");
        wx.hideLoading();
      }
    });
  });
}

/**
 * post 请求
 */
const httpPostNew = (url, data = {}) => {
  wx.showLoading({
    title: '加载中',
  });

  return new Promise((resolve, reject) => {
    wx.request({
      method: "POST",
      url: HOST + url,
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        //console.log(res);
        if (res.statusCode == 200 && res.data.code == 0) {
          // console.log(res);
          resolve(res.data);
        } else {
          reject(res.data.message);
        }

        // wx.hideLoading();
      },
      fail(err) {
        console.log(err);

        wx.hideLoading();
      }
    });
  });
}

/**
 * post 请求
 */
const httpPostJson = (url, data = {}) => {
  wx.showLoading({
    title: '加载中',
  });

  return new Promise((resolve, reject) => {
    wx.request({
      method: "POST",
      url: HOST + url,
      data,
      header: {
        'content-type': 'application/json;charset=utf-8'
      },
      success(res) {
        //console.log(res);
        if (res.statusCode == 200 && res.data.code == 0) {
          // console.log(res);
          resolve(res.data);
        } else {
          reject(res.data.message);
        }

        // wx.hideLoading();
      },
      fail(err) {
        console.log(err);

        wx.hideLoading();
      }
    });
  });
}

module.exports = {
  // formatTime: formatTime
  httpGet,
  httpPost,
  HOST,
  httpPostNew,
  httpPostJson
}

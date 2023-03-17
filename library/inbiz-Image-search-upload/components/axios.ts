import axios from 'axios';
import { message } from 'antd';
// 响应时间
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;

// 处理请求返回的数据
function checkStatus(response:any) {
  return new Promise((resolve, reject) => {
    if(response && (response.status === 200 || response.status === 304 || response.status === 400)){
      resolve(response.data);
    }else{
      message.error('网络异常，请检查网络连接是否正常！');
    }
  });
}

export default {
  post(url: string, data:any, config:any={}) {
    return axios({
      method: "post",
      url,
      data,
      ...config
    }).then(response => {
      return checkStatus(response);
    });
  },
  get(url:string, data:any, config:any={}) {
    return axios({
      method: "get",
      url,
      params: data,
      ...config
    }).then(response => {
      return checkStatus(response);
    });
  }
};
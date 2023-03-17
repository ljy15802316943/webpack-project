import React, { useEffect, useState, useRef } from 'react';
import { message } from "antd";
import { iconIcDetails, iconUpload, iconClose } from './components/icon';
// import axios from './components/axios';
import Cookies from 'js-cookie';
import { LoadingOutlined } from '@ant-design/icons';
import './index.less';

interface propsType {
  token:string;//请求koken。
  uploadUrl:string;//上传图片接口地址
  visible: boolean;//显示组件
  onOk?:Function;//上传完成获取图片结果
  onCancel:Function;//关闭组件回调
  themeColor?: string;//主题色
  style?: any;
  className?:any;//自定义样式
  close?:boolean;//是否支持点击组件外关闭组件。
};

const Index: React.FC<propsType> = (props) => {
  const { 
    themeColor="#1989fa", 
    token="",
    style={},
    uploadUrl="",
  } = props;
  const [uploadErrText, setUploadErrText] = useState<string>('');
  const [load, setLoad] = useState<boolean>(false);
  //获取主题色
  let styleColor: any = { '--themeColor': themeColor };
  //支持上传格式
  const imgType = 'image/png, image/jpg, image/bmg, image/gif, image/jpeg, image/bmp, image/dib, image/jpe, image/jp2, image/webp, image/pbm, image/pgm, image/pxm, image/pxm, image/pnm, image/pfm, image/sr, image/ras, image/tiff, image/tif, image/exr, image/hdr, image/pic';
  // 获取元素信息并绑定拖拽事件
  let uploadBoxBg: any = useRef(null);
  let fileupload: any = useRef(null);

  useEffect(() => {
    //监听拖拽上传
    onDragUpload();
    //监听点击上传
    onClickUpload();

    if (props.close) {
      document.addEventListener('click', () => {
        props.onCancel&&props.onCancel();
      });
    };
    return () => {
      uploadBoxBg = null;
      fileupload = null;
    };
  }, []);

  useEffect(() => {
    //监听复制上传
    if (props.visible) {
      document.addEventListener('paste', onCopyUpload)
    };
    return () => {
      document.removeEventListener('paste', onCopyUpload);
    };
  }, [props.visible]);

  //监听拖拽上传
  const onDragUpload = () => {
    let onEvent = (event:any) => {
      event.stopPropagation();
      event.preventDefault();
    };
    uploadBoxBg.current.addEventListener("dragover", function (event:any) {
      onEvent(event);
      event.target.style.opacity = 1;
      event.dataTransfer.dropEffect = 'copy';
      // console.log('拖拽前');
    }, false);
    uploadBoxBg.current.addEventListener("dragleave", function (event:any) {
      onEvent(event);
      event.target.style.opacity = 0;
      // console.log('拖拽离开');
    }, false);
    /* 放下目标节点时触发事件 */
    uploadBoxBg.current.addEventListener("drop", function (event:any) {
      onEvent(event);
      event.target.style.opacity = 0;
      getFiles(event.dataTransfer.files);
      // console.log('拖拽放开');
    }, false);
  };

  //监听点击上传
  const onClickUpload = () => {
    if (fileupload.current) {
      fileupload.current.addEventListener('change', function (this:any, e:any) {
        getFiles(this.files);
      });
    };
  };
  
  //监听复制上传
  const onCopyUpload = (event:any) => {
    event.stopPropagation();
    const ws: any = window;
    const data = event.clipboardData || ws.clipboardData;
    const items = data.items;
    let tempFile = null; // 存储文件数据
    if (items && items.length) {
      // 检索剪切板items
      for (const item of items) {
        tempFile = item.getAsFile()||{};
        if (!tempFile.size) {
          message.error(`${tempFile.name || ""}上传文件为空,请重新上传!`)
          break;
        } else if (!imgType.includes(tempFile.type) || !tempFile.type) {
          message.error(`${tempFile.name}不支持此文件格式,请重新上传!`)
          break;
        }
      }
    }
    getFiles([tempFile]);
  };

  // 获取上传图片结果
  const getFiles = (files:any) => {
    if (!files.length) return;
    const file = files[files.length - 1];
    if (imgType.indexOf(file.type) == -1 || !file.type) {
      setUploadErrText('抱歉，您上传的文件不是图片格式，请');
      return;
    }
    let size = file.size / 1024 / 1024 < 10;
    if (!size) {
      setUploadErrText('抱歉，您上传的文件大小超过10M，请');
      return;
    }
    setUploadErrText('');
    let formData = new window.FormData();
    formData.append('file', file);
    onUpload(uploadUrl, formData);
  };

  //上传图片请求
  const onUpload = (url:string, data:any) => {
    fileupload.current.value = '';
    setLoad(true);
    Cookies.set('token', token);
    // axios.post(url, data).then((res:any) => {
    //   setLoad(false);
    //   props.onOk&&props.onOk(res);
    // })
  };

  return (
    <div id="drop_area" className={`uploadBox ${props.className||''}`} style={{...styleColor, display: props.visible?'block':'none', ...style}}
      onClick={(e)=>{
        e.stopPropagation();
        fileupload.current.click()
      }}
    >
      <div id="uploadBoxBg" ref={uploadBoxBg} />
      <div className="uploadGroup">
        {!uploadErrText ? (
          <div className="t1">
            <p className="p1">拖拽一张图片至此区域任意位置</p>
            <p className="p2">或</p>
            <div className="btn">
              <span className="iconUpload" dangerouslySetInnerHTML={{__html: iconUpload}} />
              <span>选择图片</span>
            </div>
          </div>
        ) : (
        <div className="t2">
          <span className="iconIcDetails" dangerouslySetInnerHTML={{__html: iconIcDetails}} /><span>{uploadErrText}</span><a> 重新上传</a>
        </div>)}
      </div>
      <div className="uploadFooter">
        <span>支持10M以下jpg、jpeg、png、bmg、gif等格式图片</span>
        <span className="uploadBoxClose" dangerouslySetInnerHTML={{__html: iconClose}}
          onClick={(e)=>{
            e.stopPropagation();
            props.onCancel&&props.onCancel();
          }}
        />
      </div>
      <input style={{ display: 'none' }} id="fileupload" ref={fileupload} type="file" name="file" accept="image/*" multiple></input>
      <div className='spin' style={{visibility: load?'visible':'hidden'}} onClick={(e)=>e.stopPropagation()}>
        <LoadingOutlined style={{fontSize: 38}} />
      </div>
    </div>
  )
};

export default Index;
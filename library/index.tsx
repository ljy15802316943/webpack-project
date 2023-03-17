import React, { useEffect, useState, useRef } from 'react';
import Index from './inbiz-Image-search-upload';

export const InbizImageSearchUpload = () => {
  const [open, setOpen] = useState(234);
  return (
    <Index 
      token='eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE2Nzg4ODc5NzcsInVzZXJuYW1lIjoiamlhbmd5YW5nLmxpIn0.Yd5ZFZLFo1Ww1JaBHD_mRwQqGJArRgmkcufzXRDIV9o'
      uploadUrl=''
      visible={true}
      onCancel={()=>{}}
    />
  )
}
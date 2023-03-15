import React, { useEffect, useState } from 'react';

const Index = () => {
  const [index, $index] = useState(1);

  useEffect(() => {
    new Promise((resolve, reject) => {
      resolve('promise...')
    }).then(data => {
      setTimeout(() => {
        alert(data)
      }, 2000);
    })
  }, []);
  return (
    <div key={'xxx'} id="app">
      <div key={1} onClick={()=>$index(index+1)}>点击</div>
      <div key={2}>22</div>
    </div>
  )
}
export default Index;

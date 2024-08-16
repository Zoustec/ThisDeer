document.addEventListener('click', IosDeviceCHECK);
//window.addEventListener('load', InitDeviceMotion);
//window.addEventListener('load', InitDeviceOrientation);

// IOS啟動陀螺儀判斷
function IosDeviceCHECK(event) {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    // 該瀏覽器支持 DeviceOrientationEvent 並且有 requestPermission 方法
    DeviceOrientationEvent.requestPermission()
      .then(function (response) {
        if (response === 'granted') {
          //InitDeviceMotion();
          InitDeviceOrientation();
        }
      })
      .catch(console.error);
  } else {
    // 該瀏覽器不需要請求許可權
    //InitDeviceMotion();
    InitDeviceOrientation();
  }

  var orientationDiv = document.getElementById('orientationData');
  if (orientationDiv) {
    orientationDiv.parentNode.removeChild(orientationDiv);
    document.removeEventListener('click', IosDeviceCHECK);
  }

}

function StartGyro() {
  //InitDeviceMotion();
  InitDeviceOrientation();
}


// 停止裝置運動和方向事件的監聽
function StopGyro() {
  // if (window.DeviceMotionEvent) {
  //   window.removeEventListener('devicemotion', DeviceMotion);
  // } else {
  //   console.log('裝置不支援DeviceMotionEvent');
  // }

  if (window.DeviceOrientationEvent) {
    window.removeEventListener('deviceorientation', DeviceOrientation);
  } else {
    console.log('裝置不支援DeviceOrientationEvent');
  }
}

// 初始化裝置運動事件
function InitDeviceMotion() {
  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', DeviceMotion);
  } else {
    console.log('裝置不支援DeviceMotionEvent');
  }
}

function DeviceMotion(event) {
  if (!event) { return; }

  var acc = event.acceleration || { x: 0, y: 0, z: 0 }; //加速度（不含重力）
  var accG = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 }; //加速度（含重力）
  var rate = event.rotationRate || { x: 0, y: 0, z: 0 }; //旋轉速率
  var inter = event.interval || 0; //時間間隔

  // 檢查並設置默認值
  var accx = acc.x !== null && acc.x !== undefined ? acc.x.toFixed(3) : 0;
  var accy = acc.y !== null && acc.y !== undefined ? acc.y.toFixed(3) : 0;
  var accz = acc.z !== null && acc.z !== undefined ? acc.z.toFixed(3) : 0;

  var accGx = accG.x !== null && accG.x !== undefined ? accG.x.toFixed(3) : 0;
  var accGy = accG.y !== null && accG.y !== undefined ? accG.y.toFixed(3) : 0;
  var accGz = accG.z !== null && accG.z !== undefined ? accG.z.toFixed(3) : 0;

  var ratex = rate.x !== null && rate.x !== undefined ? rate.x.toFixed(3) : 0;
  var ratey = rate.y !== null && rate.y !== undefined ? rate.y.toFixed(3) : 0;
  var ratez = rate.z !== null && rate.z !== undefined ? rate.z.toFixed(3) : 0;

  var motionData = {
    acceleration: {
      x: accx,
      y: accy,
      z: accz
    },
    accelerationIncludingGravity: {
      x: accGx,
      y: accGy,
      z: accGz
    },
    rotationRate: {
      x: rate.x,
      y: rate.y,
      z: rate.z
    },
    interval: inter
  };

  var jsonData = JSON.stringify(motionData);

  // 調用 Unity 方法，傳遞 JSON 字符串
  if (typeof gameInstance.SendMessage !== 'undefined') {
    gameInstance.SendMessage('DeviceManager', 'OnDeviceMotion', jsonData);
  }
}

// 初始化裝置方向事件
function InitDeviceOrientation() {
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', DeviceOrientation);
  } else {
    console.log('裝置不支援DeviceOrientationEvent');
  }
}

function DeviceOrientation(event) {
  if (!event) { return; }
  var _alpha = event.alpha || 0; //加速度（不含重力）
  var _beta = event.beta || 0; //加速度（含重力）
  var _gamma = event.gamma || 0; //旋轉速率
  var _absolute = event.absolute || false; //時間間隔

  var orientationData = {
    alpha: _alpha.toFixed(3),//設備圍繞 z 軸的旋轉角度，範圍為 0 到 360 度
    beta: _beta.toFixed(3),//設備圍繞 x 軸的旋轉角度，範圍為 -180 到 180 度
    gamma: _gamma.toFixed(3),//設備圍繞 y 軸的旋轉角度，範圍為 -90 到 90 度
    absolute: _absolute//表示方向數據是否是相對於地球坐標系（true）還是相對於設備初始參考系（false）
  };

  var jsonData = JSON.stringify(orientationData);

  // 調用 Unity 方法，傳遞 JSON 字符串
  if (typeof gameInstance.SendMessage !== 'undefined') {
    gameInstance.SendMessage('DeviceManager', 'OnDeviceOrientation', jsonData);
  }
}

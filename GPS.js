//window.addEventListener('load', StartGPS);

let interval_location;
let isTracking = false; // 追蹤狀態

// 啟動位置追蹤
function StartGPS() {
    if (!isTracking) {
        interval_location = setInterval(GetLocation, 10000); // 每10秒獲取一次位置
        isTracking = true;
        console.log('位置追蹤已啟動');
    }
}

// 停止位置追蹤
function StopGPS() {
    if (isTracking) {
        clearInterval(interval_location);
        interval_location = null; // 清除定時器引用
        isTracking = false;
        console.log('位置追蹤已停止');
    }
}

// 獲取地理位置
function GetLocation() {
    if (navigator.geolocation) {
        try {
            const options = {
                enableHighAccuracy: true, // 啟用高精度定位
                timeout: 5000,            // 設置超時
                maximumAge: 0             // 禁用緩存
            };

            navigator.geolocation.getCurrentPosition(GPSPosition, GPSError, options);
        } catch (e) {
            console.log('地理位置獲取異常:', e);
        }
    } else {
        // 顯示用戶友好的提示
        console.log('您的瀏覽器不支援地理位置功能。');
        StopGPS(); // 停止定時器
    }
}

// 示例：成功獲取位置的回調函數
function GPSPosition(position) {
    clat = position.coords.latitude;
    clng = position.coords.longitude;

    var GPSData = {
        lat: clat,
        lon: clng
    };

    var jsonData = JSON.stringify(GPSData);

    // 調用 Unity 方法，傳遞 JSON 字符串
    if (typeof gameInstance.SendMessage !== 'undefined') {
        gameInstance.SendMessage('DeviceManager', 'OnDeviceGPS', jsonData);
    }
}

// 示例：處理位置獲取錯誤的回調函數
function GPSError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            //alert("用戶拒絕了請求地理位置。");
            console.log('用戶拒絕了請求地理位置。');
            break;
        case error.POSITION_UNAVAILABLE:
            //alert("無法獲取到位置資訊。");
            console.log('無法獲取到位置資訊。');
            break;
        case error.TIMEOUT:
            //alert("獲取位置資訊超時。");
            console.log('獲取位置資訊超時。');
            break;
        case error.UNKNOWN_ERROR:
            //alert("發生未知錯誤。");
            console.log('發生未知錯誤。');
            break;
    }
    StopGPS();
}

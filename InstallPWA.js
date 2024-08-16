let deferredPrompt; // 存儲事件對象

window.addEventListener('beforeinstallprompt', (e) => {
  // 防止瀏覽器顯示預設的提示
  e.preventDefault();
  // 儲存事件對象
  deferredPrompt = e;
  // 顯示自定義的安裝提示
  showInstallPromotion();
});

function showInstallPromotion() {
  const installButton = document.getElementById('installButton');
  installButton.style.display = 'block'; // 顯示安裝按鈕
  installButton.addEventListener('click', () => {
    // 顯示安裝提示
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((result) => {
      if (result.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
}


deferredPrompt.userChoice.then((result) => {
  if (result.outcome === 'accepted') {
    console.log('User accepted the A2HS prompt');
  } else {
    console.log('User dismissed the A2HS prompt');
  }
  deferredPrompt = null;
});

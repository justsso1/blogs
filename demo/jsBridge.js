const JSBridge = (function () {
  // check if JSBridge has already been created
  if (window?.JSBridge) {
    return window.JSBridge;
  }

  const isAndroid = window.android ? true : false;
  const isiOS = window.webkit ? true : false;
  const callbackMap = new Map();
  const eventListeners = new Map();
  let callbackCounter = 0;

  // Call a native method and return a promise
  function callNative(method, params) {
    return new Promise((resolve, reject) => {
      const callbackId = 'cb_' + callbackCounter++;
      callbackMap.set(callbackId, {resolve, reject});

      // 具体的messages设计要看桥方法的协议
      let message = {
        method,
        params,
        callbackId
      };

      try {
        if(isAndroid) {
          window.android.call(JSON.stringify(message));
        } else if(isiOS) {
          window.webkit.messageHandlers.call.postMessage(message);
        } else {
          throw new Error("Unsupported environment")
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // Called by native code
  function onNativeCallback(callbackId, result, error) {
    const callback = callbackMap.get(callbackId);
    if(callback) {
      if(error) {
        callback.reject(error)
      } else {
        callback.resolve(result)
      } 
      callbackMap.delete(callbackId);
    }
  }

  // Called by Native code
  function onNativeEvent(eventName, ...args) {
    const listeners = eventListeners.get(eventName);
    if(listeners) {
      listeners.forEach(listener => listener(... args));
    }
  }

  // Add an event listener
  function addEventListener(eventName, listener) {
    let listeners = eventListeners.get(eventName);
    if(!listeners) {
      listeners = new Set();
      eventListeners.set(eventName, listeners)
    }
    listeners.add(listener);
  }

  // Remove an event listener
  function removeEventListener(eventName, listener) {
    const listeners = eventListeners.get(eventName);
    if(listeners) {
      listeners.delete(listener);
    }
  }

  // Expose to global scope for native code to call
  window.onNativeCallback = onNativeCallback;
  window.onNativeEvent = onNativeEvent;

  // The public API
  return {
    callNative,
    addEventListener,
    removeEventListener
  };
})();


// 使用示例
async function getDeviceId() {
  try {
    const deviceId = await JSBridge.callNative('getDeviceId');
    console.log(deviceId);
  } catch (error) {
    console.log('Failed to get device id:', error);
  }
}
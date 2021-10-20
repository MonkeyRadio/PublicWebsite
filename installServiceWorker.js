if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("serviceWorker.js")
      .then(registration => {
      })
      .catch(error => {
      });
  } else {
  
  }
  
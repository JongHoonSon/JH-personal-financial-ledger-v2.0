export const fetcher = (endpoint, method, body) => {
  fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })
    .then(async (res) => {
      const json = await res.json();
      if (!res.ok) {
        return Promise.reject(json);
      }
      return json;
    })
    .then((redirectURL) => location.replace(redirectURL))
    .catch((errorMessage) => {
      if (errorMessage.haveToRedirect) {
        location.replace(errorMessage.redirectURL);
      }
    });
};

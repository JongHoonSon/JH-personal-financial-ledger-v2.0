export const fetcher = ({
  endpoint,
  method,
  body,
  isBodyJsonData,
  isBodyFormData,
}) => {
  const fetchOption = { method };

  if (body) {
    if (isBodyJsonData) {
      fetchOption.body = JSON.stringify(body);
      fetchOption.headers = {
        "Content-Type": "application/json",
      };
    } else if (isBodyFormData) {
      fetchOption.body = body;
    }
  }

  return fetch(endpoint, fetchOption)
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

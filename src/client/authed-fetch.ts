// @flow

export default function authedFetch(
  url: string,
  fetchConfig?: any
): Promise<Response> {
  let fetchOptions = fetchConfig || {};
  let headers = fetchOptions.headers || new Headers();
  fetchOptions.credentials = "include";
  fetchOptions.headers = headers;
  fetchOptions.method = fetchOptions.method || "GET";

  const myRequest = new Request(url, fetchOptions);
  return fetch(myRequest);
}

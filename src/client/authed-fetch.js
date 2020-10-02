// @flow

export default function authedFetch(
  url: string,
  fetchConfig?: any
): Promise<Response> {
  let fetchOptions = fetchConfig || {};
  let headers = fetchOptions.headers || new Headers();
//   console.log(`token is ${user.token}`);
// TODO: Remove the POESessid from code
  headers.append("Cookie", `POESESSID=5b6a653b9212f84e9a0f88a4d5274f84`);
  headers.append("Access-Control-Allow-Origin", "*");
  headers.append('Accept', 'application/json');
  fetchOptions.headers = headers;
  fetchOptions.method = fetchOptions.method || "GET";

  const myRequest = new Request(url, fetchOptions);
  return fetch(myRequest);
}

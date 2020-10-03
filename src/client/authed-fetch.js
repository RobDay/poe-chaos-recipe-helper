// @flow

export default function authedFetch(
  url: string,
  fetchConfig?: any
): Promise<Response> {
  let fetchOptions = fetchConfig || {};
  let headers = fetchOptions.headers || new Headers();
//   console.log(`token is ${user.token}`);
// TODO: Remove the POESessid from code
  // headers.append("Cookie", "POESESSID=***REMOVED***");
  // headers.append("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:59.0) Gecko/20100101 Firefox/59.0");
  // headers.append("Access-Control-Allow-Origin", "*");
  // headers.append('Accept', 'application/json');
  // fetchOptions.mode = 'no-cors';
  fetchOptions.credentials = "include";
  fetchOptions.headers = headers;
  fetchOptions.method = fetchOptions.method || "GET";

  const myRequest = new Request(url, fetchOptions);
  return fetch(myRequest);
}

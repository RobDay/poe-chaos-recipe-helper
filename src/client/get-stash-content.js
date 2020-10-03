// @flow
import authedFetch from "./authed-fetch";


export default async function getStashContent(
  username: string,
  stashIndex: number
): Promise<JSON> {
  const url = "https://www.pathofexile.com/character-window/get-stash-items?league=Heist&tabs=0&tabIndex=3&accountName=yousillygoose";
  console.log(`Fetching ${url}`);

  let response = await authedFetch(url);
  console.log('response is')
  console.log(response);
  let json = await response.json();
  if (!response.ok) {
    console.log('throwing');
    throw json.reason;
  }
  console.log('made it here');
  console.log(json);
  return json;
}

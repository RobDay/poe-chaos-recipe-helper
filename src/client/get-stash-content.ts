// @flow
import authedFetch from "./authed-fetch";
import { getValidResponse } from "../__tests__/mocks/gets-stashes-response";
import adaptStashAPIResponse from "../adapters/adapt-stash-contents";

export default async function getStashContent(
  username: string,
  stashIndex: number
): Promise<any> {
  // console.log('Called the underlying function');
  // return getValidResponse();
  const url =
    "https://www.pathofexile.com/character-window/get-stash-items?league=Heist&tabs=0&tabIndex=3&accountName=yousillygoose";
  console.log(`Fetching ${url}`);

  let response = await authedFetch(url);
  // console.log("response is");
  // console.log(JSON.stringify(response));
  let json = await response.json();
  if (!response.ok) {
    console.log("throwing");
    throw json.reason;
  }
  console.log("made it here");
  console.log(json);
  return adaptStashAPIResponse(json);
}

// @flow
import authedFetch from "./authed-fetch";

export default async function getStashContent(
  username: string,
  stashIndex: number
): Promise<JSON> {
  const url = "https://www.pathofexile.com/character-window/get-stash-items";
  console.log(`Fetching ${url}`);

  let response = await authedFetch(url);
  let json = await response.json();
  if (!response.ok) {
    throw json.reason;
  }
  return json;
}

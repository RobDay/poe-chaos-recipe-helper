// @flow
import authedFetch from "./authed-fetch";
import { getValidResponse } from "../../__tests__/mocks/gets-stashes-response";
import log from "electron-log";
import adaptStashAPIResponse from "../adapters/adapt-stash-contents";

export default async function getStashContent(
  username: string,
  stashIndex: number,
  league: string
): Promise<any> {
  // log.info('Called the underlying function');
  // return getValidResponse();
  const url = `https://www.pathofexile.com/character-window/get-stash-items?league=${league}&tabs=0&tabIndex=${stashIndex}&accountName=${username}`;
  log.info(`Fetching ${url}`);

  let response = await authedFetch(url);
  // log.info("response is");
  // log.info(JSON.stringify(response));
  let json = await response.json();
  if (!response.ok) {
    log.info("throwing");
    throw json.reason;
  }
  log.info("made it here");
  return adaptStashAPIResponse(json);
}

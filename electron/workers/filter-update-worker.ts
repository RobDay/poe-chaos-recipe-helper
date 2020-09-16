import { ipcMain } from "electron";
import { IPCAction } from "../../shared/constants";
import { FilterConfig, RefreshStashPayload } from "../../shared/models";
import RecipeManager from "../../src/recipe-manager";
import FilterUpdater from "../filter-updater";

export default async function filterUpdateWorker(filterConfig: FilterConfig) {
  const chaosFilterPath = `${__dirname}/../ChaosFilter.filter`;
  const filterUpdater = new FilterUpdater(chaosFilterPath, filterConfig);
  const loaded = filterUpdater.load();

  ipcMain.on(IPCAction.stashItemsRefreshed, (event: any, payload: RefreshStashPayload) => {
    const recipeManager = new RecipeManager(payload.items);
    const itemCounts = recipeManager.generateItemStatistics();
    filterUpdater.updateWithItemCounts(itemCounts);
  });
}

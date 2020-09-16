import { Config } from "../../shared/models";
import filterUpdateWorker from "./filter-update-worker";

export default function registerWorkers(config: Config) {
  filterUpdateWorker(config.filter);
}

import { Core } from "sc-game-base";

import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import { generateResult, getSettlementResult, generateRawResultForHash } from "./helpers/result-helper";
import ContainerRegistry from "./container-registry";
import TableGameData from "./game-data";
import TableGameDefinition from "./game-definition";

export const run = async () => {
    const definition = new TableGameDefinition(gameSettings, generateResult, getSettlementResult, generateRawResultForHash);
    const gameData = new TableGameData(gameSettings.durations.wholeRound);
    const container = new ContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("WinThreeCards", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();

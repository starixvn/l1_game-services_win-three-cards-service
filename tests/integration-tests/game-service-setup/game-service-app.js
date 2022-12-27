import { Core } from "sc-game-base";
import { initAPIStub, stubUserService } from "sc-game-service-integration-utils";

import appConfigs from "../../../src//app-configs.IGT";
import TableGameData from "../../../src/game-data";
import TableGameDefinition from "../../../src/game-definition";
import gameSettings from "../../../src/game-settings";
import { generateResult, getSettlementResult, generateRawResultForHash } from "../../../src/helpers/result-helper";
import GameServiceContainerRegistry from "./game-service-container-registry";

export const run = async () => {
    initAPIStub(appConfigs.apiSettings.apiUrl);
    stubUserService(appConfigs);

    const definition = new TableGameDefinition(gameSettings, generateResult, getSettlementResult, generateRawResultForHash);
    const gameData = new TableGameData(gameSettings.durations.wholeRound);
    const container = new GameServiceContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("WinThreeCards", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();

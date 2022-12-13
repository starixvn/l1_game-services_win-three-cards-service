import awilix from "awilix";
import { Table, Core } from "sc-game-base";

import { bets, rounds, tmpBets, results, betLogs } from "./models";
import { PlaceBetConsumer, RoundResultConsumer, SettleGameRoundConsumer, RebetConsumer, RebetProcessBetQueue } from "./consumers";
import { RebetContainerRegistry } from "sc-rebet-mode";

const { asClass, asValue } = awilix;

export default class ContainerRegistry extends Table.TableContainerRegistry {
    register(appConfigs, definition, gameData) {
        super.register(appConfigs, definition, gameData);

        this.container.register(new RebetContainerRegistry().registerTableGame(Core.Routers.BaseSocketRouter));

        this.container.register({
            rebetConsumer: asClass(RebetConsumer).singleton(),
            processBetQueue: asClass(RebetProcessBetQueue).singleton().proxy(),
        });

        return this.container;
    }

    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(rounds),
            betsRepository: asValue(bets),
            tempBetsRepository: asValue(tmpBets),
            resultsRepository: asValue(results),
            betLogsRepository: asValue(betLogs),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            placeBetConsumer: asClass(PlaceBetConsumer).singleton(),
            roundResultConsumer: asClass(RoundResultConsumer).singleton(),
            settleGameRoundConsumer: asClass(SettleGameRoundConsumer).singleton().proxy(),
        });
    }
}

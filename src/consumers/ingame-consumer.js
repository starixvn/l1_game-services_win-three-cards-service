import { Table } from "sc-game-base";
import { calculateBetUserPercentage } from "../helpers/result-helper";

export default class InGameConsumer extends Table.EventConsumers.TableInGameConsumer {
    async buildPayload(realPlayer) {
        const payload = await super.buildPayload(realPlayer);
        payload.betPercentage = calculateBetUserPercentage(this.gameData.betUserCount);

        return payload;
    }
}

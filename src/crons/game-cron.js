import { Table } from "sc-game-base";

export default class GameCron extends Table.Crons.TableGameCron {
    resetForNewRound() {
        super.resetForNewRound();
        this.gameData.betUserCount = {};
    }
}

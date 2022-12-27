import { Table } from "sc-game-base";

export default class TableGameData extends Table.TableGameData {
    constructor(remainingTime) {
        super(remainingTime);

        this.betUserCount = {};
    }
}

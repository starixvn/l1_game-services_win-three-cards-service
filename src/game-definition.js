import { Table } from "sc-game-base";

export default class GameDefinition extends Table.TableGameDefinition {
    constructor(
        {
            id = 0,
            name = "",
            durations = {},
            choices = [],
            choicesMapper = {},
            hedgeBetGroups = [],
            numberOfRoundHistory = 100,
            historyPageSize = 8,
            commonChoices = [],
        },
        generateResult,
        settle,
        generateRawResultForHash
    ) {
        super(
            { id, name, durations, choices, choicesMapper, hedgeBetGroups, numberOfRoundHistory, historyPageSize },
            generateResult,
            settle,
            generateRawResultForHash
        );
        this.commonChoices = commonChoices;
    }
}

import { Core } from "sc-game-base";

import RoundResultConsumer from "../../../src/consumers/round-result-consumer";
import { generateResult } from "../../../src/helpers/result-helper";

describe("Round result consumer tests", () => {
    const playerName = "nhanvat01";
    const player = {
        UID: "123",
        profile: {
            name: playerName,
            minBet: 1,
            maxBet: 1000,
        },
        session: {
            currency: "US",
        },
    };

    const gameData = new Core.GameData();
    gameData.ingame = {
        [playerName]: {
            name: player.profile.name,
            betTracks: {},
            betQueue: [],
        },
    };
    gameData.remainingTime = 20;
    gameData.gameConfigs = {
        enabled: true,
        minbet: 1,
        maxbet: 1000,
        choices_maxbet: {
            dragon: 200,
        },
    };

    const gameDefinition = new Core.GameDefinition({
        choices: ["dragon"],
        durations: {
            wholeRound: 45,
            placingBets: 30,
            lockingBet: 5,
            dealCards: 2,
        },
        roundId: 1,
    });

    describe("when admin set Result", () => {
        it("return Result", () => {
            // Arrange
            gameData.gameConfigs.enabled = false;
            gameData.gameConfigs.randomMode = 1;
            gameData.settlementResultFromAdmin = {
                result: {
                    dragon: {
                        card1: {
                            rank: 1,
                            suit: 0,
                        },
                        card2: {
                            rank: 3,
                            suit: 0,
                        },
                        card3: {
                            rank: 5,
                            suit: 0,
                        },
                    },
                    phoenix: {
                        card1: {
                            rank: 2,
                            suit: 0,
                        },
                        card2: {
                            rank: 4,
                            suit: 0,
                        },
                        card3: {
                            rank: 6,
                            suit: 0,
                        },
                    },
                },
                roundId: 1,
            };

            const placeBetConsumer = new RoundResultConsumer(gameData, gameDefinition);

            // Act
            const criterions = placeBetConsumer.generateResult();

            // Assert
            expect(criterions).not.toBeEmpty();
            expect(criterions.dragon.cards.card1.rank).toEqual(gameData.settlementResultFromAdmin.result.dragon.card1.rank);
        });
    });

    describe("when admin without set Result", () => {
        it.each([1, 2, 3])("Using mode (%p) - generateResult", (mode) => {
            // Arrange
            gameData.gameConfigs.enabled = false;
            gameData.gameConfigs.randomMode = mode;
            gameData.settlementResultFromAdmin = {
                result: {
                    dragon: {
                        card1: {
                            rank: 1,
                            suit: 0,
                        },
                        card2: {
                            rank: 3,
                            suit: 0,
                        },
                        card3: {
                            rank: 5,
                            suit: 0,
                        },
                    },
                    phoenix: {
                        card1: {
                            rank: 2,
                            suit: 0,
                        },
                        card2: {
                            rank: 4,
                            suit: 0,
                        },
                        card3: {
                            rank: 6,
                            suit: 0,
                        },
                    },
                },
                roundId: 2,
            };
            gameDefinition.generateResult = generateResult;

            const placeBetConsumer = new RoundResultConsumer(gameData, gameDefinition);

            // Act
            const criterions = placeBetConsumer.generateResult();

            // Assert
            expect(criterions).not.toBeEmpty();
        });
    });
});

import { Core } from "sc-game-base";
import SettleGameRoundConsumer from "../../../src/consumers/settle-game-round-consumer";

describe("Settle game round consumer tests", () => {
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
    const odds = { dragon: 1.95, phoenix: 1.95, pair8Plus: 3, threeOfAKind: 121, straightFlush: 101, flush: 9, straight: 8 };

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
        odds: odds,
        randomMode: 1,
        enabled: false,
    };

    const gameDefinition = new Core.GameDefinition({
        choices: ["dragon", "phoenix", "pair8Plus", "threeOfAKind", "straightFlush", "flush", "straight"],
        durations: {
            wholeRound: 45,
            placingBets: 30,
            lockingBet: 5,
            dealCards: 2,
        },
        roundId: 1,
    });

    describe("Tie round", () => {
        it("Return totalWin equal totalBetAmount on bet-result", () => {
            // Arrange
            const bet = {
                roundId: 111,
                uid: 123,
                betwin: 0,
                currency: "$US",
                dragon: 100,
                phoenix: 100,
                pair8Plus: 100,
                name: "NormalUser",
                odd: 0,
                odds: odds,
                operatorId: "dummy-partner-id",
                rate: 1,
                siteId: "111",
                paid: true,
                choice: "dragon",
                freeBet: false,
            };

            const settlementResult = {
                dragon: false,
                phoenix: false,
                tie: true,
                threeOfAKind: false,
                straightFlush: false,
                flush: false,
                straight: true,
                pair8Plus: false,
                killer235: false,
                highCard: false,
            };

            const settleConsumer = new SettleGameRoundConsumer({ definition: gameDefinition, gameData });

            // Act
            const criterions = settleConsumer.calculateBetResult(settlementResult, bet, odds);

            // Assert

            expect(criterions.totalWin).toEqual(bet.dragon + bet.phoenix + bet.pair8Plus);
            expect(criterions.totalBetAmount).toEqual(bet.dragon + bet.phoenix + bet.pair8Plus);
        });
    });

    describe("Normal round", () => {
        it("Return bet-result", () => {
            // Arrange
            const bet = {
                roundId: 111,
                uid: 123,
                betwin: 0,
                currency: "$US",
                dragon: 100,
                phoenix: 100,
                pair8Plus: 100,
                name: "NormalUser",
                odd: 0,
                odds: odds,
                operatorId: "dummy-partner-id",
                rate: 1,
                siteId: "111",
                paid: true,
                choice: "dragon",
                freeBet: false,
            };

            const settlementResult = {
                dragon: true,
                phoenix: false,
                tie: false,
                threeOfAKind: false,
                straightFlush: false,
                flush: false,
                straight: true,
                pair8Plus: false,
                killer235: false,
                highCard: false,
            };

            const settleConsumer = new SettleGameRoundConsumer({ definition: gameDefinition, gameData });

            // Act
            const criterions = settleConsumer.calculateBetResult(settlementResult, bet, odds);

            // Assert

            expect(criterions.totalWin).toEqual(bet.dragon * odds.dragon);
        });

        it("With freeBet = true return bet-result", () => {
            // Arrange
            const bet = {
                roundId: 111,
                uid: 123,
                betwin: 0,
                currency: "$US",
                dragon: 100,
                phoenix: 100,
                pair8Plus: 100,
                name: "NormalUser",
                odd: 0,
                odds: odds,
                operatorId: "dummy-partner-id",
                rate: 1,
                siteId: "111",
                paid: true,
                choice: "dragon",
                freeBet: true,
            };

            const settlementResult = {
                dragon: true,
                phoenix: false,
                tie: false,
                threeOfAKind: false,
                straightFlush: false,
                flush: false,
                straight: false,
                pair8Plus: true,
                killer235: false,
                highCard: false,
            };

            const settleConsumer = new SettleGameRoundConsumer({ definition: gameDefinition, gameData });

            // Act
            const criterions = settleConsumer.calculateBetResult(settlementResult, bet, odds);

            // Assert
            expect(criterions.totalWin).toEqual(bet.dragon * (odds.dragon - 1) + bet.pair8Plus * (odds.pair8Plus - 1));
        });
    });
});

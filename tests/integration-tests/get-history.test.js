import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { initUserSession } from "./init-user-session";
import { socketOptions } from "./stubs/test-data";

export const getHistoryTest = () => {
    describe("Get history", () => {
        it("should does not return bet history when user request", (done) => {
            // Arrange
            const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
            client.handleSignedInEvent(() => {
                client.sendInGameEvent();
            });

            const expectedData = [
                {
                    dragon: 0,
                    phoenix: 0,
                    threeOfAKind: 100,
                    straightFlush: 0,
                    flush: 0,
                    straight: 0,
                    pair8Plus: 0,
                    betwin: 0,
                    freeBet: false,
                    roundId: 111,
                    name: "NormalUser",
                    odds: { dragon: 1.95, phoenix: 1.95, pair8Plus: 3, threeOfAKind: 121, straightFlush: 101, flush: 9, straight: 8 },
                    rate: 1,
                    phien: 111,
                    betLogDetails: [
                        {
                            amount: 100,
                            choice: "dragon",
                        },
                    ],
                },
                {
                    dragon: 100,
                    phoenix: 0,
                    threeOfAKind: 0,
                    straightFlush: 0,
                    flush: 0,
                    straight: 0,
                    pair8Plus: 0,
                    betwin: 0,
                    freeBet: false,
                    roundId: 111,
                    name: "NormalUser",
                    odds: { dragon: 1.95, phoenix: 1.95, pair8Plus: 3, threeOfAKind: 121, straightFlush: 101, flush: 9, straight: 8 },
                    rate: 1,
                    phien: 111,
                    betLogDetails: [
                        {
                            amount: 100,
                            choice: "dragon",
                        },
                    ],
                },
            ];

            client.on(socketOptions.gameName, (inGameData) => {
                if (inGameData.remainingTime) {
                    setTimeout(() => {
                        // Act
                        client.sendGetHistoryEvent();

                        // Assert
                        client.on(socketOptions.gameName, (data) => {
                            if (data.history) {
                                const actualBetLogs = data.history.betLogs.map((betLog) => {
                                    delete betLog.result;
                                    delete betLog.settlementResult;
                                    return betLog;
                                });
                                expect(actualBetLogs).toEqual(expectedData);
                                expect(data.history.total).toBeGreaterThan(0);
                                expect(data.history.page).toBe(1);
                                expect(data.history.pageSize).toBe(8);

                                client.close();
                                done();
                            }
                        });
                    }, 1000);
                }
            });
        });
    });
};

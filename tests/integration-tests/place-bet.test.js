import { GameClientDriver, normalUser, eventTypes } from "sc-game-service-integration-utils";
import { socketOptions } from "./stubs/test-data";
import { initUserSession } from "./init-user-session";
import gameSettings from "../../src/game-settings";

export const placeBetTest = () => {
    describe("place bet", () => {
        const getTimeOutToBet = (remainingTime, durations) => {
            let timeout = 0;
            if (remainingTime <= durations.lockingBet) {
                timeout = durations.wholeRound - durations.placingBets + remainingTime + 2;
            } else if (remainingTime >= durations.placingBets) {
                timeout = remainingTime - durations.placingBets + 2;
            }

            return timeout;
        };

        describe("when place bet in placing bet time", () => {
            it("should return own bet data", (done) => {
                // Arrange
                const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
                client.handleSignedInEvent(() => {
                    client.sendInGameEvent();
                });
                let receivedRemainingTime = false;

                // Act
                client.on(socketOptions.gameName, (inGameData) => {
                    if (inGameData.remainingTime && !receivedRemainingTime) {
                        receivedRemainingTime = true;
                        setTimeout(() => {
                            client.emit(eventTypes.bet, { betChoice: "dragon", amount: 100 });
                        }, getTimeOutToBet(inGameData.remainingTime, gameSettings.durations) * 1000);
                    }
                });

                // Assert
                client.on(socketOptions.gameName, (data) => {
                    if (data.endBet) {
                        expect(data.betChoice).toBe("dragon");
                        expect(data.endBet).toBe(100);
                        expect(data.ownBets).toEqual({ dragon: 200 });
                        expect(data.ownChip).toEqual({ betChoice: "dragon", amount: 100 });

                        client.close();
                        done();
                    }
                });
            });
        });

        it("should return total bet", (done) => {
            // Arrange
            const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
            client.handleSignedInEvent(() => {
                client.sendInGameEvent();
            });
            let receivedRemainingTime = false;

            // Act
            client.on(socketOptions.gameName, (inGameData) => {
                if (inGameData.remainingTime && !receivedRemainingTime) {
                    receivedRemainingTime = true;
                    setTimeout(() => {
                        client.emit(eventTypes.bet, { betChoice: "dragon", amount: 123 });
                    }, getTimeOutToBet(inGameData.remainingTime, gameSettings.durations) * 1000);
                }
            });

            // Assert
            client.on(socketOptions.gameName, (data) => {
                if (data.totalBets) {
                    client.close();
                    done();
                }
            });
        });

        // it("should return bet user percentage", (done) => {
        //     // Arrange
        //     const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
        //     client.handleSignedInEvent(() => {
        //         client.sendInGameEvent();
        //     });
        //     let receivedRemainingTime = false;

        //     // Act
        //     client.on(socketOptions.gameName, (inGameData) => {
        //         if (inGameData.remainingTime && !receivedRemainingTime) {
        //             receivedRemainingTime = true;
        //             setTimeout(() => {
        //                 client.emit(eventTypes.bet, { betChoice: "dragon", amount: 100 });
        //             }, getTimeOutToBet(inGameData.remainingTime, gameSettings.durations) * 1000);
        //         }
        //     });

        //     // Assert
        //     client.on(socketOptions.gameName, (data) => {
        //         if (data.betPercentage && data.betPercentage.dragon > 0) {
        //             client.close();
        //             done();
        //         }
        //     });
        // });
    });
};

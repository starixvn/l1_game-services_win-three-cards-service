import gameSettings from "../../src/game-settings";
import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { socketOptions } from "./stubs/test-data";
import { initUserSession } from "./init-user-session";

export const botTest = () => {
    describe("Bot", () => {
        it("Should receive bot bets", (done) => {
            // Arrange
            const gameServiceClient = new GameClientDriver(socketOptions, initUserSession(normalUser));

            // Act
            gameServiceClient.handleSignedInEvent(() => {
                gameServiceClient.sendInGameEvent();
            });

            // Assert
            gameServiceClient.handleInGameEvent((data) => {
                if (data.playerChip) {
                    const checkChoice = gameSettings.choices.includes(data.playerChip.betChoice);
                    expect(checkChoice).toBe(true);

                    gameServiceClient.close();
                    done();
                }
            });
        });

        it("Should receive total bot bets", (done) => {
            // Arrange
            const gameServiceClient = new GameClientDriver(socketOptions, initUserSession(normalUser));

            // Act
            gameServiceClient.handleSignedInEvent(() => {
                gameServiceClient.sendInGameEvent();
            });

            // Assert
            gameServiceClient.handleInGameEvent((data) => {
                if (data.totalBets && (data.totalBets.phoenix || data.totalBets.dragon)) {
                    gameServiceClient.close();
                    done();
                }
            });
        });

        it("should receive bot bets percentage", (done) => {
            // Arrange
            const gameServiceClient = new GameClientDriver(socketOptions, initUserSession(normalUser));

            // Act
            gameServiceClient.handleSignedInEvent(() => {
                gameServiceClient.sendInGameEvent();
            });

            // Assert
            gameServiceClient.handleInGameEvent((data) => {
                if (data.betPercentage && (data.betPercentage.phoenix || data.betPercentage.dragon)) {
                    gameServiceClient.close();
                    done();
                }
            });
        });
    });
};

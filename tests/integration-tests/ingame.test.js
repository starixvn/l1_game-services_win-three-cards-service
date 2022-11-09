import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { socketOptions } from "./stubs/test-data";
import { initUserSession } from "./init-user-session";

export const ingameTest = () => {
    describe("when user joins game", () => {
        it("should return gameConfigs", (done) => {
            // Arrange
            const client = new GameClientDriver(socketOptions, initUserSession(normalUser));

            // Act
            client.handleSignedInEvent(() => {
                client.sendInGameEvent();
            });

            // Assert
            client.handleInGameEvent((inGameData) => {
                if (inGameData.gameConfigs && inGameData.resultHash) {
                    client.close();
                    done();
                }
            });
        });
    });
};

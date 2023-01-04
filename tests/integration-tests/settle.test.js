import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { initUserSession } from "./init-user-session";
import { socketOptions } from "./stubs/test-data";

export const settleTest = () => {
    describe("when settle", () => {
        it("should return settled finish data", (done) => {
            // Arrange & Act
            const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
            client.handleSignedInEvent(() => {
                client.sendInGameEvent();
            });

            // Assert
            client.on(socketOptions.gameName, (data) => {
                if (data.finish && data.resultHash) {
                    client.close();
                    done();
                }
            });
        });

        it("should return winners when settled", (done) => {
            // Arrange & Act
            const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
            client.handleSignedInEvent(() => {
                client.sendInGameEvent();
            });

            // Assert
            client.on(socketOptions.gameName, (data) => {
                if (data.winners) {
                    client.close();
                    done();
                }
            });
        });
    });
};

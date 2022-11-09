import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { socketOptions } from "./stubs/test-data";
import { initUserSession } from "./init-user-session";

export const signinTest = () => {
    describe("signin", () => {
        it("should receive signed in response", (done) => {
            // Arrange & Act
            const client = new GameClientDriver(socketOptions, initUserSession(normalUser));

            // Assert
            client.handleSignedInEvent(() => {
                client.close();
                done();
            });
        });
    });
};

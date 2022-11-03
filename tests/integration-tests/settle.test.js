import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { initUserSession } from "./init-user-session";

const socketOptions = {
    socketUri: `http://localhost:5002/user/${"WinThreeCards".toLowerCase()}`,
    gameName: "WinThreeCards",
    proxyRoute: "/socket.io",
};

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
                console.log(data);
                if (data.finish) {
                    console.log(data);
                    // client.close();
                    // done();
                }
            });
        });
    });
};

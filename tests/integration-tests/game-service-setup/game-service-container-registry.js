import awilix from "awilix";
const { asClass } = awilix;

import ContainerRegistry from "../../../src/container-registry";
import AdminSocketRouter from "./routers/admin-socket-router";

export default class GameServiceContainerRegistry extends ContainerRegistry {
    registerRouters() {
        super.registerRouters();

        this.container.register({
            adminSocketRouter: asClass(AdminSocketRouter).proxy(),
        });
    }
}

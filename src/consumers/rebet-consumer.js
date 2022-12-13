import { Consumers } from "sc-rebet-mode";
import { checkTimeValidationCriteria } from "./place-bet-consumer";

export default class RebetConsumer extends Consumers.RebetConsumer {
    composeBettingTimeValidationCriteria(roundId) {
        return checkTimeValidationCriteria(this, roundId);
    }
}

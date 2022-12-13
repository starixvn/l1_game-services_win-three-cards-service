import BasePlaceBetConsumer from "sc-game-base/src/core/event-consumers/place-bet-consumer";
import { helpers } from "sc-common";

export const checkTimeValidationCriteria = (context, roundId) => {
    const configs = context.gameData.gameConfigs;
    const dealCardsTime = context.definition.durations.placingBets + context.definition.durations.dealCards;

    return [
        {
            failure: !configs.enabled,
            notice: context.getNoticeObj(helpers.noticeHelper.placeBetNextRound),
        },
        {
            failure: roundId !== context.gameData.roundId,
            notice: context.getNoticeObj(helpers.noticeHelper.invalidBet, { gameRoundId: roundId }),
        },
        {
            failure:
                context.gameData.remainingTime >= context.definition.durations.placingBets &&
                context.gameData.remainingTime <= dealCardsTime,
            notice: context.getNoticeObj(helpers.noticeHelper.cannotPlaceBet),
        },
        {
            failure:
                context.gameData.remainingTime < context.definition.durations.lockingBet || context.gameData.remainingTime > dealCardsTime,
            notice: context.getNoticeObj(helpers.noticeHelper.placeBetNextRound),
        },
    ];
};
export default class PlaceBetConsumer extends BasePlaceBetConsumer {
    composeBettingTimeValidationCriteria(roundId) {
        return checkTimeValidationCriteria(this, roundId);
    }
}

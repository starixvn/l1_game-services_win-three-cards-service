import { RoundResultConsumer as BaseRoundResultConsumer } from "sc-game-base/src/core/event-consumers";
import { getCardCombination, checkHandRankIDRule235, getCardRankId } from "../helpers/result-helper";

export default class RoundResultConsumer extends BaseRoundResultConsumer {
    generateResult() {
        const { roundId } = this.gameData;
        const { randomMode } = this.gameData.gameConfigs;
        const resultFromAdmin = this.gameData.settlementResultFromAdmin;

        if (roundId === resultFromAdmin.roundId) {
            const cards = [];
            const { dragon, phoenix } = resultFromAdmin.result;
            const cardCombination = getCardCombination({ dragon: { ...dragon }, phoenix: { ...phoenix } });
            const cardCombinationFinal = checkHandRankIDRule235(cardCombination.dragon, cardCombination.phoenix);
            const dragonData = cardCombinationFinal.dragon;
            const phoenixData = cardCombinationFinal.phoenix;
            [1, 2, 3].forEach((value) => {
                cards.push(dragon[`card${value}`], phoenix[`card${value}`]);
            });

            return {
                dragon: {
                    cards: dragon,
                    handRankId: dragonData.handRankId,
                    cardRankId: getCardRankId(dragonData.handRankId, dragonData),
                },
                phoenix: {
                    cards: phoenix,
                    handRankId: phoenixData.handRankId,
                    cardRankId: getCardRankId(phoenixData.handRankId, phoenixData),
                },
                cards: cards,
            };
        } else {
            return this.definition.generateResult(randomMode);
        }
    }
}

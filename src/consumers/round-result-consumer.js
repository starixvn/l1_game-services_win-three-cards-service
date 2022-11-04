import { RoundResultConsumer as BaseRoundResultConsumer } from "sc-game-base/src/core/event-consumers";
import { WinThreeCardsGame } from "../helpers";

export default class RoundResultConsumer extends BaseRoundResultConsumer {
    generateResult() {
        const { roundId } = this.gameData;
        const resultFromAdmin = this.gameData.settlementResultFromAdmin;

        if (roundId === resultFromAdmin.roundId) {
            const { dragon, phoenix } = resultFromAdmin.result;
            const cardsFromAdmin = dragon.concat(phoenix);

            const baccaratGame = new WinThreeCardsGame([...cardsFromAdmin]);
            const cards = [];
            let index = 0;
            while (index < 3) {
                cards.push(dragon.shift());
                cards.push(phoenix.shift());
                index++;
            }
            baccaratGame.cards = cards;
            baccaratGame.receiveSixCards();

            return { dragon: baccaratGame.dragon, phoenix: baccaratGame.phoenix, cards };
        } else {
            return this.definition.generateResult();
        }
    }
}

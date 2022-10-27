import CardRule from "./card-rule";
import { ranks } from "./constants";

export default class CardCombination {
    constructor(cards) {
        this.poker = new CardRule(cards);
        this.metadata = this.poker.combinationResult();
        this.result = this.getResult();
    }

    getResult() {
        const { pair, threeOfAKind, sequence, suit, cards, margin, pairOverEight } = this.metadata;

        const criterions = {
            straightFlush: {
                condition: suit && sequence,
                id: ranks.straightFlush,
                cards: cards,
            },
            flush: {
                condition: suit,
                id: ranks.flush,
                cards: cards,
            },
            straight: {
                condition: sequence,
                id: ranks.straight,
                cards: cards,
            },
            threeOfAKind: {
                condition: threeOfAKind.length,
                id: ranks.threeKind,
                cards: threeOfAKind.length ? threeOfAKind[0] : [],
            },
            pair: {
                condition: pair.length,
                id: ranks.onePair,
                cards: cards,
                cardPair: pair.length ? pair[0] : [],
            },
            pair8Plus: {
                condition: pairOverEight || suit || sequence || threeOfAKind.length || (suit && sequence),
                id: ranks.onePair,
                cards: cards,
                cardPair: pair.length ? pair[0] : [],
            },
            highCard: {
                condition: true,
                id: ranks.highCard,
                cards: cards,
            },
        };
        const result = Object.values(criterions).find((criteria) => criteria.condition);
        delete result.condition;

        return result;
    }
}

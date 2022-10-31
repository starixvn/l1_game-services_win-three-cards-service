import CardRule from "./card-rule";
import { ranks } from "./constants";

export default class CardCombination {
    constructor(cards, choice) {
        this.choice = choice;
        this.poker = new CardRule(cards);
        this.metadata = this.poker.combinationResult();
        this.result = this.getResult();
    }

    getResult() {
        const { pair, threeOfAKind, sequence, suit, cards, margin, isKiller235 } = this.metadata;

        const criterions = {
            threeOfAKind: {
                condition: threeOfAKind.length,
                id: ranks.threeOfAKind,
                combinationCards: threeOfAKind.length ? threeOfAKind[0] : [],
            },
            straightFlush: {
                condition: suit && sequence,
                id: ranks.straightFlush,
                combinationCards: cards,
            },
            flush: {
                condition: suit,
                id: ranks.flush,
                combinationCards: cards,
            },
            straight: {
                condition: sequence,
                id: ranks.straight,
                combinationCards: cards,
            },
            pair: {
                condition: pair.length,
                id: ranks.onePair,
                combinationCards: pair.length ? pair[0] : [],
            },
            // pair8Plus: {
            //     condition: pairOverEight || suit || sequence || threeOfAKind.length || (suit && sequence),
            //     id: ranks.onePair,
            //     cards: cards,
            //     cardPair: pair.length ? pair[0] : [],
            // },
            highCard: {
                condition: true,
                id: ranks.highCard,
                combinationCards: [margin.max],
                isKiller235: isKiller235,
            },
        };
        const result = Object.values(criterions).find((criteria) => criteria.condition);
        delete result.condition;

        const cardFilter = (card) => !result.combinationCards.includes(card);
        result.cards = result.combinationCards.concat(cards.filter(cardFilter));
        result.choice = this.choice;

        return result;
    }
}

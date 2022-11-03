import WinThreeCardsGame from "./win-three-cards-game";
import CardCombination from "./card-combination";
import { Helpers } from "sc-card-game-base";
import { ranks, BetOptions } from "./constants";

const getCards = (randomMode) => {
    let cards = [...Helpers.CardData.deck];
    cards = Helpers.ShuffleHelper.shuffle[randomMode](cards);
    return cards;
};

const generateResult = (mode) => {
    const selectedMode = mode >= 1 && mode <= 3 ? mode : 1;
    const cards = getCards(selectedMode);
    const baccaratGame = new WinThreeCardsGame([...cards]);
    baccaratGame.receiveSixCards();
    return { dragon: baccaratGame.dragon, phoenix: baccaratGame.phoenix, cards: cards.slice(0, 6) };
};

const settlementRuleEntries = Object.entries({
    dragon: (dragon) => {
        return dragon.choice === BetOptions.dragon;
    },
    phoenix: (phoenix) => {
        return phoenix.choice === BetOptions.phoenix;
    },
    tie: (cardCompare) => {
        return cardCompare.choice !== BetOptions.dragon && cardCompare.choice !== BetOptions.phoenix;
    },
    threeOfAKind: (cardCompare) => {
        return cardCompare.id === ranks.threeOfAKind || cardCompare.isPair8Plus || false;
    },
    straightFlush: (cardCompare) => {
        return cardCompare.id === ranks.straightFlush || cardCompare.isPair8Plus || false;
    },
    flush: (cardCompare) => {
        return cardCompare.id === ranks.flush || cardCompare.isPair8Plus || false;
    },
    straight: (cardCompare) => {
        return cardCompare.id === ranks.straight || cardCompare.isPair8Plus || false;
    },
    pair: (cardCompare) => {
        return cardCompare.id === ranks.onePair || cardCompare.isPair8Plus || false;
    },
    pair8Plus: (cardCompare) => {
        return cardCompare.isPair8Plus ?? false;
    },
    highCard: (cardCompare) => {
        return cardCompare.id === ranks.highCard;
    },
    killer235: (cardCompare) => {
        return cardCompare.isKiller235 ?? false;
    },
});

const getSettlementResult = (roundResult) => {
    const cardCombination = Object.values(roundResult).reduce((cardCompare, cards, currentIndex) => {
        cardCompare[Object.keys(roundResult)[currentIndex]] = new CardCombination(
            Object.values(cards),
            Object.keys(roundResult)[currentIndex]
        ).result;

        return cardCompare;
    }, []);

    const dragon = cardCombination.dragon;
    const phoenix = cardCombination.phoenix;
    const settleResult = checkCompareCombination(dragon, phoenix);
    let cardValidate = dragon;
    if (settleResult > 0) {
        cardValidate = phoenix;
    } else if (settleResult === 0) {
        cardValidate.choice = "tie";
    }

    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(cardValidate);

        return result;
    }, {});
};

export const checkCompareCombination = (a, b) => {
    if (a.id === b.id) {
        for (let index = 0; index < a.combinationCards.length; index++) {
            const rankA = a.combinationCards[index].rank || 13;
            const rankB = b.combinationCards[index].rank || 13;
            if (rankA !== rankB) {
                return rankB - rankA;
            }
        }
        for (let i = a.combinationCards.length; i < a.cards.length; i++) {
            const rankA = a.cards[i].rank || 13;
            const rankB = b.cards[i].rank || 13;
            if (rankA !== rankB) {
                return rankB - rankA;
            }
        }
        return 0;
    }

    return checkCompareCombinationOtherCase(a, b);
};

const checkCompareCombinationOtherCase = (a, b) => {
    if (a.id === ranks.highCard && a.isKiller235 && b.id === ranks.threeOfAKind) {
        a.id = ranks.killer235;
    }

    if (b.id === ranks.highCard && b.isKiller235 && a.id === ranks.threeOfAKind) {
        b.id = ranks.killer235;
    }

    return b.id - a.id;
};

const generateRawResultForHash = ({ cards }) => {
    let rawResult = "{";
    rawResult += cards.map((card) => `${Helpers.CardData.name[card.card]}${Helpers.CardData.type[card.type]}`).join(" ") + "}";
    return rawResult;
};

export { generateResult, getSettlementResult, getCards, generateRawResultForHash };

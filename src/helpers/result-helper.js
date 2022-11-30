import WinThreeCardsGame from "./win-three-cards-game";
import CardCombination from "./card-combination";
import { ranks, betOptions, names, suits, deck } from "./constants";
import { shuffle } from "./shuffle-helper";

function getCards(randomMode) {
    let cards = [...deck];
    cards = shuffle[randomMode](cards);
    return cards;
}

const generateResult = (mode) => {
    const selectedMode = mode >= 1 && mode <= 3 ? mode : 1;
    const cards = getCards(selectedMode);
    const baccaratGame = new WinThreeCardsGame([...cards]);
    baccaratGame.receiveSixCards();
    const cardCombination = getCardCombination({ dragon: baccaratGame.dragon, phoenix: baccaratGame.phoenix });
    return {
        dragon: {
            cards: baccaratGame.dragon,
            handRankId: cardCombination.dragon.handRankId,
        },
        phoenix: {
            cards: baccaratGame.phoenix,
            handRankId: cardCombination.phoenix.handRankId,
        },
        cards: cards.slice(0, 6),
    };
};

const getCardCombination = (roundResult) => {
    return Object.values(roundResult).reduce((cardCompare, cards, currentIndex) => {
        cardCompare[Object.keys(roundResult)[currentIndex]] = new CardCombination(
            Object.values(cards),
            Object.keys(roundResult)[currentIndex]
        ).result;

        return cardCompare;
    }, []);
};

const settlementRuleEntries = Object.entries({
    dragon: (dragon) => {
        return dragon.choice === betOptions.dragon;
    },
    phoenix: (phoenix) => {
        return phoenix.choice === betOptions.phoenix;
    },
    tie: (cardCompare) => {
        return cardCompare.choice !== betOptions.dragon && cardCompare.choice !== betOptions.phoenix;
    },
    threeOfAKind: (cardCompare) => {
        return cardCompare.handRankId === ranks.threeOfAKind || cardCompare.isPair8Plus || false;
    },
    straightFlush: (cardCompare) => {
        return cardCompare.handRankId === ranks.straightFlush || cardCompare.isPair8Plus || false;
    },
    flush: (cardCompare) => {
        return cardCompare.handRankId === ranks.flush || cardCompare.isPair8Plus || false;
    },
    straight: (cardCompare) => {
        return cardCompare.handRankId === ranks.straight || cardCompare.isPair8Plus || false;
    },
    pair: (cardCompare) => {
        return cardCompare.handRankId === ranks.onePair || cardCompare.isPair8Plus || false;
    },
    pair8Plus: (cardCompare) => {
        return cardCompare.isPair8Plus ?? false;
    },
    highCard: (cardCompare) => {
        return cardCompare.handRankId === ranks.highCard;
    },
    killer235: (cardCompare) => {
        return cardCompare.isKiller235 ?? false;
    },
});

const getSettlementResult = (roundResult) => {
    const cardCombination = getCardCombination({ dragon: roundResult.dragon.cards, phoenix: roundResult.phoenix.cards });
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
    if (a.handRankId === b.handRankId) {
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
    if (a.handRankId === ranks.highCard && a.isKiller235 && b.handRankId === ranks.threeOfAKind) {
        a.handRankId = ranks.killer235;
    }

    if (b.handRankId === ranks.highCard && b.isKiller235 && a.handRankId === ranks.threeOfAKind) {
        b.handRankId = ranks.killer235;
    }

    return b.handRankId - a.handRankId;
};

const generateRawResultForHash = ({ cards }) => {
    let rawResult = "{";
    rawResult +=
        cards
            .map((card) => {
                return `${names[card.rank]}${suits[card.suit]}`;
            })
            .join(" ") + "}";
    return rawResult;
};

export { generateResult, getSettlementResult, getCards, generateRawResultForHash };

import WinThreeCardsGame from "./win-three-cards-game";
import CardCombination from "./card-combination";
import { ranks, betOptions, names, suits, deck } from "./constants";
import { shuffle } from "./shuffle-helper";

const generateResult = (mode) => {
    const selectedMode = mode >= 1 && mode <= 3 ? mode : 1;
    const cards = getCards(selectedMode);
    const baccaratGame = new WinThreeCardsGame([...cards]);
    baccaratGame.receiveSixCards();
    const cardCombination = getCardCombination({ dragon: baccaratGame.dragon, phoenix: baccaratGame.phoenix });
    const cardCombinationFinal = checkHandRankIDRule235(cardCombination.dragon, cardCombination.phoenix);
    const dragonData = cardCombinationFinal.dragon;
    const phoenixData = cardCombinationFinal.phoenix;

    return {
        dragon: {
            cards: baccaratGame.dragon,
            handRankId: dragonData.handRankId,
            cardRankId: getCardRankId(dragonData.handRankId, dragonData),
        },
        phoenix: {
            cards: baccaratGame.phoenix,
            handRankId: phoenixData.handRankId,
            cardRankId: getCardRankId(phoenixData.handRankId, phoenixData),
        },
        cards: cards.slice(0, 6),
    };
};

const getSettlementResult = (roundResult) => {
    const cardCombination = getCardCombination({ dragon: roundResult.dragon.cards, phoenix: roundResult.phoenix.cards });
    const dragon = cardCombination.dragon;
    const phoenix = cardCombination.phoenix;
    const settleResult = checkCompareCombination(dragon, phoenix);
    let cardValidate = dragon;
    if (settleResult > 0) {
        cardValidate = phoenix;
    } else if (settleResult === 0) {
        cardValidate.choice = betOptions.tie;
    }

    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        if (cardValidate.choice === betOptions.tie) {
            result[choice] = choice === betOptions.tie ? true : false;
        } else {
            result[choice] = rule(cardValidate);
        }

        return result;
    }, {});
};

const getCards = (randomMode) => {
    let cards = [...deck];
    cards = shuffle[randomMode](cards);
    return cards;
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
        return cardCompare.handRankId === ranks.threeOfAKind || false;
    },
    straightFlush: (cardCompare) => {
        return cardCompare.handRankId === ranks.straightFlush || false;
    },
    flush: (cardCompare) => {
        return cardCompare.handRankId === ranks.flush || false;
    },
    straight: (cardCompare) => {
        return cardCompare.handRankId === ranks.straight || false;
    },
    pair: (cardCompare) => {
        return cardCompare.handRankId === ranks.onePair || false;
    },
    pair8Plus: (cardCompare) => {
        return (
            cardCompare.isPair8Plus ||
            cardCompare.handRankId === ranks.flush ||
            cardCompare.handRankId === ranks.straight ||
            cardCompare.handRankId === ranks.threeOfAKind ||
            cardCompare.handRankId === ranks.straightFlush ||
            false
        );
    },
    highCard: (cardCompare) => {
        return cardCompare.handRankId === ranks.highCard;
    },
    killer235: (cardCompare) => {
        return cardCompare.isKiller235 || false;
    },
});

const getCardCombination = (roundResult) => {
    return Object.values(roundResult).reduce((cardCompare, cards, currentIndex) => {
        cardCompare[Object.keys(roundResult)[currentIndex]] = new CardCombination(
            Object.values(cards),
            Object.keys(roundResult)[currentIndex]
        ).result;

        return cardCompare;
    }, []);
};

const getCardRankId = (rankId, cardCompare) => {
    switch (rankId) {
        case ranks.threeOfAKind:
        case ranks.straightFlush:
        case ranks.straight:
        case ranks.flush:
        case ranks.killer235:
            return -1;
        default:
            return cardCompare.combinationCards[0].rank;
    }
};

export const checkCompareCombination = (dragon, phoenix) => {
    if (dragon.handRankId === phoenix.handRankId) {
        for (let index = 0; index < dragon.combinationCards.length; index++) {
            const rankA = dragon.combinationCards[index].rank || 13;
            const rankB = phoenix.combinationCards[index].rank || 13;
            if (rankA !== rankB) {
                return rankB - rankA;
            }
        }
        for (let i = dragon.combinationCards.length; i < dragon.cards.length; i++) {
            const rankA = dragon.cards[i].rank || 13;
            const rankB = phoenix.cards[i].rank || 13;
            if (rankA !== rankB) {
                return rankB - rankA;
            }
        }
        return 0;
    }

    return checkCompareCombinationOtherCase(dragon, phoenix);
};

const checkCompareCombinationOtherCase = (dragon, phoenix) => {
    const result = checkHandRankIDRule235(dragon, phoenix);

    return result.phoenix.handRankId - result.dragon.handRankId;
};

const checkHandRankIDRule235 = (dragon, phoenix) => {
    if (dragon.handRankId === ranks.highCard && dragon.isKiller235 && phoenix.handRankId === ranks.threeOfAKind) {
        dragon.handRankId = ranks.killer235;
    }

    if (phoenix.handRankId === ranks.highCard && phoenix.isKiller235 && dragon.handRankId === ranks.threeOfAKind) {
        phoenix.handRankId = ranks.killer235;
    }

    return { dragon, phoenix };
};

const countUniqueBetUser = (betUserArr) => {
    return [...new Set(betUserArr)].length;
};

const calculateBetUserPercentage = (betUserCount) => {
    if (!betUserCount) {
        return {};
    }

    const choices = Object.keys(betUserCount);
    const total = Object.values(betUserCount).reduce((accumulator, currentValue) => accumulator + countUniqueBetUser(currentValue), 0);

    return total > 0
        ? choices.reduce((result, choice) => {
              result[choice] = parseFloat(((countUniqueBetUser(betUserCount[choice]) * 100) / total).toFixed(2));

              return result;
          }, {})
        : {};
};

export {
    generateResult,
    getSettlementResult,
    getCards,
    generateRawResultForHash,
    getCardRankId,
    getCardCombination,
    checkHandRankIDRule235,
    calculateBetUserPercentage,
};

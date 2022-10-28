import WinThreeCardsGame from "./win-three-cards-game";
import CardCombination from "./card-combination";
import { getCardValue } from "./card-helper";
import { Helpers } from "sc-card-game-base";
import { killer235, ranks } from "./constants";

const getCards = (randomMode = 1) => {
    let cards = [...Helpers.CardData.deck];
    cards = Helpers.ShuffleHelper.shuffle(randomMode)(cards);
    return cards;
};

const generateResult = (mode) => {
    const selectedMode = mode >= 1 && mode <= 3 ? mode : 1;
    const cards = getCards(selectedMode);
    const baccaratGame = new WinThreeCardsGame([...cards]);
    baccaratGame.receiveSixCards();
    return { result: { dragon: baccaratGame.dragon, phoenix: baccaratGame.phoenix } };
};

const settlementRuleEntries = Object.entries({
    player: ({ player, banker }) => {
        const playerScore = getTotalScore(player);
        const bankerScore = getTotalScore(banker);
        return playerScore > bankerScore;
    },
});

const getTotalScore = (handResult) => {
    return Object.values(handResult).reduce((result, card) => {
        const cardValue = getCardValue(card);

        return (result + cardValue) % 10;
    }, 0);
};

const getSettlementResult = (roundResult) => {
    const cardCombination = Object.values(roundResult).reduce((result, cardResult) => {
        result = Object.values(cardResult).reduce((cardCompare, cards, currentIndex) => {
            cardCompare[Object.keys(cardResult)[currentIndex]] = new CardCombination(Object.values(cards)).result;

            return cardCompare;
        }, []);

        return result;
    }, {});

    return Object.values(cardCombination).sort(checkCompareCombination)[0];
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

    if (a.id === 1 && a.isKiller235 && b.id === ranks.threeOfAKind) {
        a.id = ranks.killer235;
    }

    if (b.id === 1 && b.isKiller235 && a.id === ranks.threeOfAKind) {
        b.id = ranks.killer235;
    }

    return b.id - a.id;
};

const generateRawResultForHash = ({ cards }) => {
    let rawResult = "{";
    rawResult += cards.map((card) => `${Helpers.CardData.name[card.value]}${Helpers.CardData.type[card.type]}`).join(" ") + "}";
    return rawResult;
};

export { generateResult, getSettlementResult, generateRawResultForHash, getCards };

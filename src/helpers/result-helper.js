import WinThreeCardsGame from "./win-three-cards-game";
import CardCombination from "./card-combination";
import { getCardValue } from "./card-helper";
import { Helpers } from "sc-card-game-base";

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
    return Object.values(roundResult).reduce((result, cardResult) => {
        result = Object.values(cardResult).reduce((cardCompare, cards, currentIndex) => {
            cardCompare[Object.keys(cardResult)[currentIndex]] = new CardCombination(Object.values(cards)).result;

            return cardCompare;
        }, {});

        return result;
    }, {});
   
};

const generateRawResultForHash = ({ cards }) => {
    let rawResult = "{";
    rawResult += cards.map((card) => `${Helpers.CardData.name[card.value]}${Helpers.CardData.type[card.type]}`).join(" ") + "}";
    return rawResult;
};

export { generateResult, getSettlementResult, generateRawResultForHash, getCards };

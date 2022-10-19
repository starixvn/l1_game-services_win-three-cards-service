import WinThreeCardsPlayer from "./win-three-cards-player";

const Actions = {
    receiveTwoCards: "receiveTwoCards",
    playerReceiveThirdCard: "playerReceiveThirdCard",
    bankerReceiveThirdCard: "bankerReceiveThirdCard",
    finalComparison: "finalComparison",
};

class WinThreeCardsGame {
    constructor(cards) {
        this.dragon = new WinThreeCardsPlayer();
        this.phoenix = new WinThreeCardsPlayer();
        this.cards = cards;
    }

    receiveTwoCards() {
        this.dragon.card1 = this.cards.shift();
        this.phoenix.card1 = this.cards.shift();
        this.dragon.card2 = this.cards.shift();
        this.phoenix.card2 = this.cards.shift();
    }

    playerReceiveThirdCard() {
        const card = this.cards.shift();

        this.dragon.card3 = card;
    }

    bankerReceiveThirdCard() {
        const card = this.cards.shift();

        this.phoenix.card3 = card;
    }

    finalComparison() {
        const score = this.getTotalScore();
        const numberOfCards = this.dragon.getNumberOfCards() + this.phoenix.getNumberOfCards();

        return {
            player: score.player > score.banker,
            banker: score.player < score.banker,
            tie: score.player === score.banker,
            big: numberOfCards === 5 || numberOfCards === 6,
            small: numberOfCards === 4,
            playerPair: this.dragon.hasPair(),
            bankerPair: this.phoenix.hasPair(),
            natural: numberOfCards === 4 && (score.player >= 8 || score.banker >= 8),
        };
    }

    getFinalCards() {
        return {
            playerCards: this.dragon.getCards(),
            bankerCards: this.phoenix.getCards(),
            playerPoint: this.dragon.getTotalScore(),
            bankerPoint: this.phoenix.getTotalScore(),
        };
    }

    getTotalScore() {
        return {
            player: this.dragon.getTotalScore(),
            banker: this.phoenix.getTotalScore(),
        };
    }

    getNumberOfCards() {
        return {
            player: this.dragon.getNumberOfCards(),
            banker: this.phoenix.getNumberOfCards(),
        };
    }

    getAction() {
        const numberOfCards = this.getNumberOfCards();
        const score = this.getTotalScore();

        if (numberOfCards.player < 2 || numberOfCards.banker < 2) {
            return Actions.receiveTwoCards;
        }

        if (numberOfCards.player === 2 && numberOfCards.banker === 2) {
            if (score.player >= 8 || score.banker >= 8) {
                return Actions.finalComparison;
            }

            if (score.player <= 5) {
                return Actions.playerReceiveThirdCard;
            }

            // Player score: 6 or 7
            if (score.banker <= 5) {
                return Actions.bankerReceiveThirdCard;
            }

            return Actions.finalComparison;
        }

        if (numberOfCards.player === 3 && numberOfCards.banker === 2) {
            const thirdCardOfPlayer = this.dragon.getThirdCardValue();
            const hasBankerReceiveThirdCard = this.checkBankerHasReceiveThirdCard(score, thirdCardOfPlayer);

            if (hasBankerReceiveThirdCard) {
                return Actions.bankerReceiveThirdCard;
            }

            return Actions.finalComparison;
        }

        return Actions.finalComparison;
    }

    checkBankerHasReceiveThirdCard(score, thirdCardOfPlayer) {
        return (
            score.banker <= 2 ||
            (score.banker === 3 && thirdCardOfPlayer !== 8) ||
            (score.banker === 4 && thirdCardOfPlayer >= 2 && thirdCardOfPlayer <= 7) ||
            (score.banker === 5 && thirdCardOfPlayer >= 4 && thirdCardOfPlayer <= 7) ||
            (score.banker === 6 && thirdCardOfPlayer >= 6 && thirdCardOfPlayer <= 7)
        );
    }

    setResult({ player, banker }) {
        this.dragon.setCards(player);
        this.phoenix.setCards(banker);
    }
}

WinThreeCardsGame.Actions = Actions;

export default WinThreeCardsGame;

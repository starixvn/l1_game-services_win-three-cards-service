import WinThreeCardsPlayer from "./win-three-cards-player";

class WinThreeCardsGame {
    constructor(cards) {
        this.dragon = new WinThreeCardsPlayer();
        this.phoenix = new WinThreeCardsPlayer();
        this.cards = cards;
    }

    receiveSixCards() {
        this.dragon.card1 = this.cards.shift();
        this.phoenix.card1 = this.cards.shift();
        this.dragon.card2 = this.cards.shift();
        this.phoenix.card2 = this.cards.shift();
        this.dragon.card3 = this.cards.shift();
        this.phoenix.card3 = this.cards.shift();
    }
}

export default WinThreeCardsGame;

export default class CardRule {
    constructor(cards) {
        this.cards = cards;
    }

    card(rank) {
        const cardFilter = (card) => card.rank === rank;

        return this.cards.findIndex(cardFilter) !== -1;
    }

    margin() {
        const cards = this.cards.sort((cardA, cardB) => cardA.rank - cardB.rank);
        const min = cards.find((card) => card.rank !== 0);
        const max = cards[0].rank === 0 ? cards[0] : cards[cards.length - 1];

        return {
            min,
            max,
        };
    }

    rank(number) {
        const selector = (card) => card.rank || 13;

        return this.getGroupWithCounter(number, selector);
    }

    suit(number) {
        const selector = (card) => card.suit;

        return this.getGroupWithCounter(number, selector);
    }

    sequence() {
        const straights = [
            [11, 12, 0],
            [10, 11, 12],
            [9, 10, 11],
            [8, 9, 10],
            [7, 8, 9],
            [6, 7, 8],
            [5, 6, 7],
            [4, 5, 6],
            [3, 4, 5],
            [2, 3, 4],
            [1, 2, 3],
            [0, 1, 2],
        ];

        const reducer = (hasSequence, straightTemplate) => {
            const cardRemaining = straightTemplate.map((rank) => this.card(rank)).filter((x) => !x);

            return hasSequence || (cardRemaining.length === 0 ? straightTemplate : hasSequence);
        };

        return straights.reduce(reducer, false);
    }

    getGroupWithCounter(number, selector) {
        const group = this.groupCard(selector);
        const filterFn = (group) => group.length === number;

        return Object.values(group).filter(filterFn);
    }

    groupCard(selector) {
        return this.cards.reduce((result, card) => {
            const labels = selector(card);
            if (result[labels]) {
                result[labels].push(card);
            } else {
                result[labels] = [card];
            }

            return result;
        }, {});
    }

    pairOverEight() {
        const criterions = [8, 9, 10, 11, 12, 0];
        const cards = this.rank(2);
        return cards.length > 0 && criterions.includes(cards[0][0].rank);
    }

    checkExist235(cards) {
        const exist235 = [4, 2, 1];
        const difference = Object.values(this.sortCards(cards)).filter((x) => !exist235.includes(x.rank));

        return difference?.length > 0 ? false : true;
    }

    sortCards(cards) {
        return cards.sort((cardA, cardB) => (cardB.rank || 13) - (cardA.rank || 13));
    }

    combinationResult() {
        const sequence = this.sequence();
        const pair = this.rank(2);
        const margin = this.margin();
        const threeOfAKind = this.rank(3);
        const pairOverEight = this.pairOverEight();
        const suit = this.suit(3).length > 0;
        const cards = this.sortCards(this.cards);
        const isKiller235 = this.checkExist235(cards) && (this.suit(2).length > 0 || this.suit(3).length === 0);

        return {
            sequence: sequence !== false,
            pair,
            threeOfAKind,
            margin,
            pairOverEight,
            cards,
            suit,
            isKiller235,
        };
    }
}

import { ranks } from "../../../src/helpers/constants";
import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";

const cardSample = {
    data: null,
};
jest.mock("sc-card-game-base", () => {
    const orig = {
        ...jest.requireActual("sc-card-game-base"),
    };

    return {
        Helpers: { CardData: { deck: orig.Helpers.CardData.deck }, ShuffleHelper: { shuffle: (_) => (cards) => cardSample.data } },
    };
});

describe("ResultHelper", () => {
    describe("generateResult", () => {
        it("check generateResult", () => {
            // Arrange
            const card1 = { rank: 1, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 3, suit: 0 };
            const card4 = { rank: 4, suit: 0 };
            const card5 = { rank: 5, suit: 0 };
            const card6 = { rank: 6, suit: 0 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;

            // Act
            const result = generateResult();

            // Assert
            expect(result.result.dragon.card1).toEqual(card1);
            expect(result.result.phoenix.card1).toEqual(card2);
            expect(result.result.dragon.card2).toEqual(card3);
            expect(result.result.phoenix.card2).toEqual(card4);
            expect(result.result.dragon.card3).toEqual(card5);
            expect(result.result.phoenix.card3).toEqual(card6);
        });
    });

    describe("getSettlementResult", () => {
        it("check same HighCard return highCard", () => {
            // Arrange
            const card1 = { rank: 1, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 3, suit: 1 };
            const card4 = { rank: 4, suit: 2 };
            const card5 = { rank: 5, suit: 2 };
            const card6 = { rank: 6, suit: 3 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const value = ranks.highCard;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.id).toEqual(value);
        });

        it("check Pair and High card return Pair", () => {
            // Arrange
            const card1 = { rank: 1, suit: 0 };
            const card2 = { rank: 2, suit: 1 };
            const card3 = { rank: 1, suit: 1 };
            const card4 = { rank: 4, suit: 0 };
            const card5 = { rank: 5, suit: 0 };
            const card6 = { rank: 6, suit: 3 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const value = ranks.onePair;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.id).toEqual(value);
        });

        it("check Three of a Kind and Straight flush return Three of a Kind", () => {
            // Arrange
            const card1 = { rank: 1, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 1, suit: 0 };
            const card4 = { rank: 3, suit: 0 };
            const card5 = { rank: 1, suit: 0 };
            const card6 = { rank: 4, suit: 0 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const value = ranks.threeOfAKind;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.id).toEqual(value);
        });

        it("check Straight Flush and Flush return Straight Flush", () => {
            // Arrange
            const card1 = { rank: 2, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 3, suit: 0 };
            const card4 = { rank: 3, suit: 0 };
            const card5 = { rank: 4, suit: 0 };
            const card6 = { rank: 6, suit: 0 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const value = ranks.straightFlush;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.id).toEqual(value);
        });

        it("check Flush and Straight return Flush", () => {
            // Arrange
            const card1 = { rank: 2, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 7, suit: 0 };
            const card4 = { rank: 3, suit: 1 };
            const card5 = { rank: 4, suit: 0 };
            const card6 = { rank: 4, suit: 0 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const value = ranks.flush;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.id).toEqual(value);
        });

        it("check High Card and 235 return  High Card", () => {
            // Arrange
            const card1 = { rank: 2, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 7, suit: 1 };
            const card4 = { rank: 3, suit: 1 };
            const card5 = { rank: 4, suit: 0 };
            const card6 = { rank: 5, suit: 2 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const value = ranks.highCard;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.id).toEqual(value);
        });

        it("check Three of a Kind and 235 return 235 (High Card)", () => {
            // Arrange
            const card1 = { rank: 2, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 2, suit: 1 };
            const card4 = { rank: 3, suit: 1 };
            const card5 = { rank: 2, suit: 2 };
            const card6 = { rank: 5, suit: 2 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const value = ranks.killer235;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.id).toEqual(value);
        });

        it("check two Three of a Kind return Three of a Kind bigger", () => {
            // Arrange
            const card1 = { rank: 3, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 3, suit: 1 };
            const card4 = { rank: 2, suit: 1 };
            const card5 = { rank: 3, suit: 2 };
            const card6 = { rank: 2, suit: 2 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const value = ranks.threeOfAKind;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.id).toEqual(value);
            expect(settlement.cards[0].rank).toEqual(card1.rank);
        });

        it("check two Straight Flush return Straight Flush bigger", () => {
            // Arrange
            const card1 = { rank: 4, suit: 0 };
            const card2 = { rank: 7, suit: 1 };
            const card3 = { rank: 5, suit: 0 };
            const card4 = { rank: 8, suit: 1 };
            const card5 = { rank: 6, suit: 0 };
            const card6 = { rank: 9, suit: 1 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const value = ranks.straightFlush;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.id).toEqual(value);
            expect(settlement.cards[0].rank).toEqual(card6.rank);
        });

        it("check two Pair same value return Pair which one card remain bigger", () => {
            // Arrange
            const card1 = { rank: 4, suit: 0 };
            const card2 = { rank: 4, suit: 1 };
            const card3 = { rank: 4, suit: 1 };
            const card4 = { rank: 4, suit: 0 };
            const card5 = { rank: 6, suit: 0 };
            const card6 = { rank: 9, suit: 2 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const value = ranks.onePair;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.id).toEqual(value);
            expect(settlement.cards[2].rank).toEqual(card6.rank);
        });

        it("check two High Card return High Card which one card remain bigger", () => {
            // Arrange
            const card1 = { rank: 0, suit: 0 };
            const card2 = { rank: 0, suit: 1 };
            const card3 = { rank: 4, suit: 1 };
            const card4 = { rank: 4, suit: 0 };
            const card5 = { rank: 6, suit: 2 };
            const card6 = { rank: 9, suit: 2 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const value = ranks.highCard;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.id).toEqual(value);
            expect(settlement.cards[1].rank).toEqual(card6.rank);
        });

        it("check two High Card return tie", () => {
            // Arrange
            const card1 = { rank: 0, suit: 0 };
            const card2 = { rank: 0, suit: 1 };
            const card3 = { rank: 4, suit: 1 };
            const card4 = { rank: 4, suit: 0 };
            const card5 = { rank: 9, suit: 2 };
            const card6 = { rank: 9, suit: 2 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const value = "tie";

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.choice).toEqual(value);
        });
    });
});

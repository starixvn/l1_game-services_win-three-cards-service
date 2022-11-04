import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";

const cardSample = {
    data: null,
};
jest.mock("sc-card-game-base", () => {
    const originalModule = {
        ...jest.requireActual("sc-card-game-base"),
    };

    return {
        Helpers: {
            CardData: { deck: originalModule.Helpers.CardData.deck },
            ShuffleHelper: { shuffle: { 1: (_) => cardSample.data, 2: (_) => cardSample.data, 3: (_) => cardSample.data } },
        },
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
            expect(result.dragon.card1).toEqual(card1);
            expect(result.phoenix.card1).toEqual(card2);
            expect(result.dragon.card2).toEqual(card3);
            expect(result.phoenix.card2).toEqual(card4);
            expect(result.dragon.card3).toEqual(card5);
            expect(result.phoenix.card3).toEqual(card6);
        });
    });

    describe("generateResult follow mode ", () => {
        it.each([1, 2, 3])("When using mode (%p) - generateResult", (mode) => {
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
            const result = generateResult(mode);

            // Assert
            expect(result.dragon.card1).toEqual(card1);
            expect(result.phoenix.card1).toEqual(card2);
            expect(result.dragon.card2).toEqual(card3);
            expect(result.phoenix.card2).toEqual(card4);
            expect(result.dragon.card3).toEqual(card5);
            expect(result.phoenix.card3).toEqual(card6);
        });
    });

    describe("getSettlementResult", () => {
        it("check dragon HighCard and phoenix HighCard return phoenix Win", () => {
            // Arrange
            const card1 = { rank: 1, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 3, suit: 1 };
            const card4 = { rank: 4, suit: 2 };
            const card5 = { rank: 5, suit: 2 };
            const card6 = { rank: 6, suit: 3 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.phoenix).toEqual(expected);
            expect(settlement.highCard).toEqual(expected);
        });

        it("check dragon Pair and phoenix High card return dragon Win", () => {
            // Arrange
            const card1 = { rank: 1, suit: 0 };
            const card2 = { rank: 2, suit: 1 };
            const card3 = { rank: 1, suit: 1 };
            const card4 = { rank: 4, suit: 0 };
            const card5 = { rank: 5, suit: 0 };
            const card6 = { rank: 6, suit: 3 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.dragon).toEqual(expected);
            expect(settlement.pair).toEqual(expected);
        });

        it("check Dragon Three of a Kind and Phoenix Straight flush return Dragon Win", () => {
            // Arrange
            const card1 = { rank: 1, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 1, suit: 0 };
            const card4 = { rank: 3, suit: 0 };
            const card5 = { rank: 1, suit: 0 };
            const card6 = { rank: 4, suit: 0 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.dragon).toEqual(expected);
            expect(settlement.threeOfAKind).toEqual(expected);
        });

        it("check Dragon Straight Flush and Phoenix Flush return Dragon Win", () => {
            // Arrange
            const card1 = { rank: 2, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 3, suit: 0 };
            const card4 = { rank: 3, suit: 0 };
            const card5 = { rank: 4, suit: 0 };
            const card6 = { rank: 6, suit: 0 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.dragon).toEqual(expected);
            expect(settlement.straightFlush).toEqual(expected);
        });

        it("check Dragon Flush and Phoenix Straight return Dragon Win", () => {
            // Arrange
            const card1 = { rank: 2, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 7, suit: 0 };
            const card4 = { rank: 3, suit: 1 };
            const card5 = { rank: 4, suit: 0 };
            const card6 = { rank: 4, suit: 0 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.dragon).toEqual(expected);
            expect(settlement.flush).toEqual(expected);
        });

        it("check Dragon High Card and Phoenix 235 return Dragon Win", () => {
            // Arrange
            const card1 = { rank: 2, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 7, suit: 1 };
            const card4 = { rank: 3, suit: 1 };
            const card5 = { rank: 4, suit: 0 };
            const card6 = { rank: 5, suit: 2 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.dragon).toEqual(expected);
            expect(settlement.highCard).toEqual(expected);
        });

        it("check Dragon Three of a Kind and Phoenix 235 return Phoenix win", () => {
            // Arrange
            const card1 = { rank: 2, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 2, suit: 1 };
            const card4 = { rank: 3, suit: 1 };
            const card5 = { rank: 2, suit: 2 };
            const card6 = { rank: 5, suit: 2 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.phoenix).toEqual(expected);
            expect(settlement.killer235).toEqual(expected);
        });

        it("check Dragon and Phoenix Three of a Kind return Three of a Kind bigger", () => {
            // Arrange
            const card1 = { rank: 3, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 3, suit: 1 };
            const card4 = { rank: 2, suit: 1 };
            const card5 = { rank: 3, suit: 2 };
            const card6 = { rank: 2, suit: 2 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.dragon).toEqual(expected);
            expect(settlement.threeOfAKind).toEqual(expected);
        });

        it("check Dragon and Phoenix Straight Flush return Straight Flush bigger", () => {
            // Arrange
            const card1 = { rank: 4, suit: 0 };
            const card2 = { rank: 7, suit: 1 };
            const card3 = { rank: 5, suit: 0 };
            const card4 = { rank: 8, suit: 1 };
            const card5 = { rank: 6, suit: 0 };
            const card6 = { rank: 9, suit: 1 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.phoenix).toEqual(expected);
        });

        it("check Dragon and Phoenix Pair same value return Pair which one card remain bigger", () => {
            // Arrange
            const card1 = { rank: 4, suit: 0 };
            const card2 = { rank: 4, suit: 1 };
            const card3 = { rank: 4, suit: 1 };
            const card4 = { rank: 4, suit: 0 };
            const card5 = { rank: 6, suit: 0 };
            const card6 = { rank: 9, suit: 2 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.phoenix).toEqual(expected);
        });

        it("check Dragon and Phoenix High Card return High Card which one card remain bigger", () => {
            // Arrange
            const card1 = { rank: 0, suit: 0 };
            const card2 = { rank: 0, suit: 1 };
            const card3 = { rank: 4, suit: 1 };
            const card4 = { rank: 4, suit: 0 };
            const card5 = { rank: 6, suit: 2 };
            const card6 = { rank: 9, suit: 2 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.phoenix).toEqual(expected);
        });

        it("check two High Card same rank return tie", () => {
            // Arrange
            const card1 = { rank: 0, suit: 0 };
            const card2 = { rank: 0, suit: 1 };
            const card3 = { rank: 4, suit: 1 };
            const card4 = { rank: 4, suit: 0 };
            const card5 = { rank: 9, suit: 2 };
            const card6 = { rank: 9, suit: 2 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.tie).toEqual(expected);
            expect(settlement.highCard).toEqual(expected);
        });

        it("check Dragon Pair 8 Plush and Phoenix Hight Card return Dragon", () => {
            // Arrange
            const card1 = { rank: 8, suit: 0 };
            const card2 = { rank: 7, suit: 1 };
            const card3 = { rank: 8, suit: 1 };
            const card4 = { rank: 5, suit: 0 };
            const card5 = { rank: 6, suit: 0 };
            const card6 = { rank: 2, suit: 2 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.dragon).toEqual(expected);
            expect(settlement.pair).toEqual(expected);
            expect(settlement.pair8Plus).toEqual(expected);
            expect(settlement.flush).toEqual(expected);
            expect(settlement.straightFlush).toEqual(expected);
            expect(settlement.straight).toEqual(expected);
            expect(settlement.threeOfAKind).toEqual(expected);
        });

        it("check Dragon and Phoenix same Pair return tie", () => {
            // Arrange
            const card1 = { rank: 1, suit: 0 };
            const card2 = { rank: 1, suit: 1 };
            const card3 = { rank: 1, suit: 2 };
            const card4 = { rank: 1, suit: 3 };
            const card5 = { rank: 0, suit: 0 };
            const card6 = { rank: 0, suit: 1 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.tie).toEqual(expected);
            expect(settlement.pair).toEqual(expected);
        });

        it("check Dragon Straight bigger rank A and Phoenix Straight bigger rank K return Dragon", () => {
            // Arrange
            const card1 = { rank: 0, suit: 0 };
            const card2 = { rank: 10, suit: 1 };
            const card3 = { rank: 1, suit: 2 };
            const card4 = { rank: 11, suit: 3 };
            const card5 = { rank: 2, suit: 0 };
            const card6 = { rank: 12, suit: 1 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.dragon).toEqual(expected);
            expect(settlement.straight).toEqual(expected);
        });
    });
});

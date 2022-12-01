import { generateResult, getSettlementResult, generateRawResultForHash } from "../../../src/helpers/result-helper";

const cardSample = {
    data: null,
};

jest.mock("../../../src/helpers/shuffle-helper", () => {
    const _shuffle = (_) => cardSample.data;
    return {
        shuffle: { 1: _shuffle, 2: _shuffle, 3: _shuffle },
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
            expect(result.dragon.cards.card1).toEqual(card1);
            expect(result.phoenix.cards.card1).toEqual(card2);
            expect(result.dragon.cards.card2).toEqual(card3);
            expect(result.phoenix.cards.card2).toEqual(card4);
            expect(result.dragon.cards.card3).toEqual(card5);
            expect(result.phoenix.cards.card3).toEqual(card6);
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
            expect(result.dragon.cards.card1).toEqual(card1);
            expect(result.phoenix.cards.card1).toEqual(card2);
            expect(result.dragon.cards.card2).toEqual(card3);
            expect(result.phoenix.cards.card2).toEqual(card4);
            expect(result.dragon.cards.card3).toEqual(card5);
            expect(result.phoenix.cards.card3).toEqual(card6);
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
            const card2 = { rank: 1, suit: 0 };
            const card3 = { rank: 7, suit: 1 };
            const card4 = { rank: 2, suit: 0 };
            const card5 = { rank: 4, suit: 0 };
            const card6 = { rank: 4, suit: 2 };
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

        it("check Dragon Three of a Kind and Phoenix 235 same 2 suit return Phoenix win", () => {
            // Arrange
            const card1 = { rank: 2, suit: 0 };
            const card2 = { rank: 1, suit: 0 };
            const card3 = { rank: 2, suit: 1 };
            const card4 = { rank: 4, suit: 0 };
            const card5 = { rank: 2, suit: 2 };
            const card6 = { rank: 2, suit: 2 };
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

        it("check Dragon Three of a Kind and Phoenix 235 different suit return Phoenix win", () => {
            // Arrange
            const card1 = { rank: 2, suit: 0 };
            const card2 = { rank: 1, suit: 0 };
            const card3 = { rank: 2, suit: 1 };
            const card4 = { rank: 4, suit: 1 };
            const card5 = { rank: 2, suit: 2 };
            const card6 = { rank: 2, suit: 2 };
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

        it("check Dragon 235 all same suit (not 235) and Phoenix Three of a Kind return Phoenix win", () => {
            // Arrange
            const card1 = { rank: 1, suit: 0 };
            const card2 = { rank: 5, suit: 0 };
            const card3 = { rank: 4, suit: 0 };
            const card4 = { rank: 5, suit: 1 };
            const card5 = { rank: 2, suit: 0 };
            const card6 = { rank: 5, suit: 2 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const expected = true;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.phoenix).toEqual(expected);
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

    describe("generate RawResultForHash", () => {
        it("check return true", () => {
            // Arrange
            const card1 = { rank: 0, suit: 0 };
            const card2 = { rank: 10, suit: 1 };
            const card3 = { rank: 1, suit: 2 };
            const card4 = { rank: 11, suit: 3 };
            const card5 = { rank: 2, suit: 0 };
            const card6 = { rank: 12, suit: 1 };
            const cards = [card1, card2, card3, card4, card5, card6];
            const expected = "{A♥ J♦ 2♣ Q♠ 3♥ K♦}";

            // Act
            const actual = generateRawResultForHash({ cards });

            // Assert
            expect(actual).toStrictEqual(expected);
        });
    });
});

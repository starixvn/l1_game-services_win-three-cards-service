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
        it("check return highCard", () => {
            // Arrange
            const card1 = { rank: 1, suit: 0 };
            const card2 = { rank: 2, suit: 0 };
            const card3 = { rank: 3, suit: 0 };
            const card4 = { rank: 4, suit: 0 };
            const card5 = { rank: 5, suit: 0 };
            const card6 = { rank: 6, suit: 0 };
            const cards = [card1, card2, card3, card4, card5, card6];

            cardSample.data = cards;
            const value = ranks.highCard;

            // Act
            const result = generateResult();
            const settlement = getSettlementResult(result);

            // Assert
            expect(settlement.dragon.id).toEqual(value);
            expect(settlement.phoenix.id).toEqual(value);
        });
    });
});

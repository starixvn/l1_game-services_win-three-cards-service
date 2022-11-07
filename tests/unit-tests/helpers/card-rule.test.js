import CardRule from "../../../src/helpers/card-rule";

describe("CardRule", () => {
    describe("card", () => {
        const cards = [{ rank: 1 }, { rank: 2 }, { rank: 3 }];
        const cardRule = new CardRule(cards);

        describe("when card exist", () => {
            it("should return true", () => {
                // Act
                const actual = cardRule.card(1);

                // Assert
                expect(actual).toBeTrue();
            });
        });

        describe("when card not exist", () => {
            it("should return false", () => {
                // Act
                const actual = cardRule.card(0);

                // Assert
                expect(actual).toBeFalse();
            });
        });
    });

    describe("margin", () => {
        it("should return expected", () => {
            // Arrange
            const cards = [{ rank: 3 }, { rank: 0 }, { rank: 12 }, { rank: 10 }, { rank: 2 }];
            const cardRule = new CardRule(cards);

            // Act
            const actual = cardRule.margin();

            // Assert
            expect(actual.min.rank).toBe(2);
            expect(actual.max.rank).toBe(0);
        });
    });

    describe("rank", () => {
        it("should return expected", () => {
            // Arrange
            const cards = [{ rank: 0 }, { rank: 3 }, { rank: 0 }];
            const cardRule = new CardRule(cards);
            const expected = [[cards[0], cards[2]]];
            cardRule.getGroupWithCounter = jest.fn().mockReturnValue(expected);

            // Act
            const actual = cardRule.rank(0);

            // Assert
            expect(cardRule.getGroupWithCounter).toHaveBeenCalledWith(0, expect.any(Function));
            expect(actual).toStrictEqual(expected);
        });
    });

    describe("suit", () => {
        it("should return expected", () => {
            // Arrange
            const cards = [{ suit: 0 }, { suit: 5 }, { suit: 0 }];
            const cardRule = new CardRule(cards);
            const expected = [[cards[0], cards[2]]];
            cardRule.getGroupWithCounter = jest.fn().mockReturnValue(expected);

            // Act
            const actual = cardRule.suit(0);

            // Assert
            expect(cardRule.getGroupWithCounter).toHaveBeenCalledWith(0, expect.any(Function));
            expect(actual).toStrictEqual(expected);
        });
    });

    describe("sequence", () => {
        it("should return expected", () => {
            // Arrange
            const cards = [{ rank: 2 }, { rank: 4 }, { rank: 3 }];
            const cardRule = new CardRule(cards);
            const expected = [cards[0].rank, cards[2].rank, cards[1].rank];

            // Act
            const actual = cardRule.sequence();

            // Assert
            expect(actual).toStrictEqual(expected);
        });
    });

    describe("pair over eight", () => {
        it("should return true", () => {
            // Arrange
            const cards = [{ rank: 8 }, { rank: 4 }, { rank: 8 }];
            const cardRule = new CardRule(cards);

            // Act
            const actual = cardRule.pairOverEight();

            // Assert
            expect(actual).toBeTrue();
        });
    });
    describe("check Exist 235", () => {
        it("should return true", () => {
            // Arrange
            const cards = [{ rank: 1 }, { rank: 4 }, { rank: 2 }];
            const cardRule = new CardRule(cards);

            // Act
            const actual = cardRule.checkExist235(cards);

            // Assert
            expect(actual).toBeTrue();
        });
    });
});

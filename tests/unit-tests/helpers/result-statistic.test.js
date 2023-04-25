import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";
import { shuffle } from "../../../src/helpers/shuffle-helper";
describe("Result statistic: 100000 times", () => {
    it.each(Object.keys(shuffle))("statistic should have expected result with mode %d", (mode) => {
        // Arrange
        const streakNumber = 4;
        const longestStreak = 4;
        const stats = {
            streaks: {
                total: 0,
                dragon: 0,
                phoenix: 0,
                pair8Plus: 0,
                threeOfAKind: 0,
                straightFlush: 0,
                flush: 0,
                straight: 0,
                pair: 0,
                highCard: 0,
                tie: 0,
            },
        };
        const streakCounts = {
            dragon: 0,
            phoenix: 0,
            pair8Plus: 0,
            threeOfAKind: 0,
            straightFlush: 0,
            flush: 0,
            straight: 0,
            pair: 0,
            highCard: 0,
            tie: 0,
        };
        const totalRounds = 100000;

        // Act
        for (let i = 0; i < totalRounds; i++) {
            const result = generateResult(mode);
            const settlement = getSettlementResult(result);
            Object.keys(settlement).forEach((choice) => {
                stats[choice] = stats[choice] ?? { count: 0, ratio: 0 };
                stats[choice].count += settlement[choice] ? 1 : 0;
                stats[choice].ratio = stats[choice].count / totalRounds;

                if (!settlement[choice]) {
                    streakCounts[choice] = 0;
                    return;
                }

                const count = streakCounts[choice] + 1;
                streakCounts[choice] = count + 1;
                if (count >= streakNumber) {
                    stats.streaks.total++;
                    stats.streaks[choice]++;
                    if (count >= longestStreak) {
                        streakCounts[choice] = 1;
                    }
                }
            });
        }

        // Assert
        console.log(`======== Run ${totalRounds} rounds for mode ${mode} ========`);
        console.log(stats);
        expect(stats["dragon"].ratio).toBeGreaterThanOrEqual(0.49);
        expect(stats["phoenix"].ratio).toBeGreaterThanOrEqual(0.49);
        expect(stats["tie"].ratio).toBeGreaterThanOrEqual(0.0008);
        expect(stats["pair8Plus"].ratio).toBeGreaterThanOrEqual(0.2);
        expect(stats["threeOfAKind"].ratio).toBeGreaterThanOrEqual(0.004);
        expect(stats["straightFlush"].ratio).toBeGreaterThanOrEqual(0.003);
        expect(stats["straight"].ratio).toBeGreaterThanOrEqual(0.05);
        expect(stats["flush"].ratio).toBeGreaterThanOrEqual(0.09);       
        expect(stats["pair"].ratio).toBeGreaterThanOrEqual(0.25);
        expect(stats["highCard"].ratio).toBeGreaterThanOrEqual(0.5);   
    });
});

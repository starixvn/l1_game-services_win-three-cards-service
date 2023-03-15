import { Table } from "sc-game-base";

export default class SettleGameRoundConsumer extends Table.EventConsumers.TableSettleGameRoundConsumer {
    calculateBetResult(settlementResult, bet, odds) {
        const betResult = Object.entries(settlementResult).reduce(
            (result, [choice, win]) => {
                let winAmount = 0;
                const betAmount = bet[choice] ?? 0;
                if (settlementResult.tie) {
                    winAmount = betAmount;
                } else {
                    const originalOdds = odds[choice] || 1;
                    const effectiveOdds = bet.freeBet ? originalOdds - 1 : originalOdds;
                    winAmount = win ? betAmount * effectiveOdds : 0;

                    if (winAmount > 0) {
                        result.netWin += winAmount - betAmount;
                    } else {
                        result.totalLost += betAmount;
                    }
                }

                result.totalWin += winAmount;
                result.winningByChoices[choice] = winAmount;
                result.totalBetAmount += betAmount;

                return result;
            },
            {
                totalBetAmount: 0,
                totalWin: 0,
                netWin: 0,
                totalLost: 0,
                winningByChoices: {},
            }
        );

        betResult.totalWin = parseFloat(betResult.totalWin.toFixed(2));
        betResult.netWin = parseFloat(betResult.netWin.toFixed(2));

        return betResult;
    }
}

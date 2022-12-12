export default {
    id: 61,
    name: "WinThreeCards",
    durations: {
        wholeRound: 45,
        placingBets: 30,
        lockingBet: 5,
        dealCards: 2,
    },
    choices: ["dragon", "phoenix", "pair8Plus", "threeOfAKind", "straightFlush", "flush", "straight"],
    choicesMapper: { dragon: 1, phoenix: 2, tie: 3, pair8Plus: 4, threeOfAKind: 5, straightFlush: 6, flush: 7, straight: 8 },
    hedgeBetGroups: [["dragon", "phoenix"]],
    numberOfRoundHistory: 102,
    numberOfDecks: 1,
};

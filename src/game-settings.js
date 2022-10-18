export default {
    id: 61, // to be updated
    name: "WinThreeCards",
    durations: {
        wholeRound: 45,
        placingBets: 30,
        lockingBet: 5,
        dealCards: 2,
    },
    choices: ["player", "banker", "big", "small", "tie", "playerPair", "bankerPair"],
    choicesMapper: { player: 1, banker: 2, big: 3, small: 4, tie: 5, playerPair: 6, bankerPair: 7 },
    hedgeBetGroups: [
        ["player", "banker"],
    ],
    numberOfRoundHistory: 102,
    numberOfDecks: 2,
};

import gameSetting from "./../../../src/game-settings";

const game = {
    id: gameSetting.id,
    name: gameSetting.name,
};

const currencyData = { code: "USD", name: "$US" };

const socketOptions = {
    socketUri: `http://localhost:5002/user/${gameSetting.name.toLowerCase()}`,
    gameName: game.name,
    proxyRoute: "/socket.io",
};

const gameConfig = {
    type: 0,
    name: gameSetting.name.toLowerCase(),
    minBet: 1,
    maxBet: 3000,
    maxBetPerChoices: {
        dragon: 3000,
        phoenix: 3000,
        pair8Plus: 3000,
        threeOfAKind: 3000,
        straightFlush: 1000,
        flush: 1000,
        straight: 3000,
    },
    odds: { dragon: 1.95, phoenix: 1.95, pair8Plus: 3, threeOfAKind: 121, straightFlush: 101, flush: 9, straight: 8 },
};

const rounds = [
    {
        id: 111,
        result: {
            dragon: {
                cards: { card1: { rank: 0, suit: 0 }, card2: { rank: 0, suit: 0 }, card3: { rank: 0, suit: 0 } },
                handRankId: 1,
            },
            phoenix: {
                cards: { card1: { rank: 0, suit: 1 }, card2: { rank: 0, suit: 2 }, card3: { rank: 2, suit: 0 } },
                handRankId: 0,
            },
        },
        settlementResult: {
            dragon: true,
            phoenix: false,
            tie: false,
            threeOfAKind: true,
            straightFlush: false,
            flush: false,
            straight: false,
            pair8Plus: false,
            killer235: false,
        },
        exchangeRateId: 1,
    },
];

const userBetData = (uid) => {
    return [
        {
            roundId: 111,
            uid: uid,
            betwin: 0,
            currency: "$US",
            dragon: 100,
            name: "NormalUser",
            odd: 0,
            odds: gameConfig.odds,
            operatorId: "dummy-partner-id",
            rate: 1,
            siteId: "111",
            paid: true,
            choice: "dragon",
        },
        {
            roundId: 111,
            uid: uid,
            betwin: 0,
            currency: "$US",
            threeOfAKind: 100,
            name: "NormalUser",
            odd: 0,
            odds: gameConfig.odds,
            operatorId: "dummy-partner-id",
            rate: 1,
            siteId: "111",
            paid: true,
            choice: "threeOfAKind",
        },
    ];
};

export { game, currencyData, socketOptions, gameConfig, rounds, userBetData };

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
            dragon: { card1: { rank: 0, suit: 0 }, card2: { rank: 0, suit: 0 }, card3: { rank: 0, suit: 0 } },
            phoenix: { card1: { rank: 0, suit: 0 }, card2: { rank: 0, suit: 0 }, card3: { rank: 2, suit: 0 } },
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
            freeBet: false,
            phien: 1190119,
            uid: uid,
            betwin: 0,
            currency: "$US",
            even: 100,
            memberId: 1,
            name: "NormalUser",
            odd: 0,
            odds: gameConfig.odds,
            partnerId: "dummy-partner-id",
            rate: 1,
            red2: 0,
            red3: 0,
            red4: 0,
            siteId: "111",
            thanhtoan: true,
            white3: 0,
            white4: 0,
            roundId: 1190119,
        },
        {
            freeBet: false,
            phien: 1190119,
            uid: uid,
            betwin: 0,
            currency: "$US",
            even: 100,
            memberId: 4,
            name: "NormalUser",
            odd: 0,
            odds: gameConfig.odds,
            partnerId: "dummy-partner-id",
            rate: 1,
            red2: 0,
            red3: 0,
            red4: 0,
            siteId: "111",
            thanhtoan: true,
            white3: 0,
            white4: 0,
            roundId: 1190119,
            paid: true,
        },
    ];
};

export { game, currencyData, socketOptions, gameConfig, rounds, userBetData };

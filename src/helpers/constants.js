const ranks = {
    killer235: 7,
    threeOfAKind: 6,
    straightFlush: 5,
    flush: 4,
    straight: 3,
    onePair: 2,
    highCard: 1,
};

const betOptions = {
    dragon: "dragon",
    phoenix: "phoenix",
    tie: "tie",
};

const names = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["♥", "♦", "♣", "♠"];

const deck = [...Array(13).keys()].reduce((result, currentValue) => {
    result.push({ rank: currentValue, suit: 0 });
    result.push({ rank: currentValue, suit: 1 });
    result.push({ rank: currentValue, suit: 2 });
    result.push({ rank: currentValue, suit: 3 });

    return result;
}, []);

export { deck, names, suits, betOptions, ranks };

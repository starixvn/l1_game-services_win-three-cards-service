import { generateResult, getSettlementResult } from "../../src/helpers/result-helper";

const TOTAL_ROUNDS = 100_000;

function initOccurrences() {
    return {
        randomMode: 0,
        total: 0,
        dragon: { count: 0, ratio: 0 },
        phoenix: { count: 0, ratio: 0 },
        tie: { count: 0, ratio: 0 },
        threeOfAKind: { count: 0 },
        straightFlush: { count: 0 },
        flush: { count: 0 },
        straight: { count: 0 },
        pair8Plus: { count: 0 },
        killer235: { count: 0 },
        highCard: { count: 0 },
    };
}

const run = (randomMode) => {
    let occurrences = initOccurrences();

    for (let index = 0; index < TOTAL_ROUNDS; index++) {
        const result = generateResult(randomMode);
        const settleResult = getSettlementResult(result);

        occurrences.total++;
        occurrences.randomMode = randomMode;
        occurrences = { ...handleCountChoice(occurrences, settleResult) };
    }

    // Handle ratio
    occurrences = handleRadio(occurrences);

    console.log(`======== Run ${TOTAL_ROUNDS} rounds for mode ${randomMode} ========`);
    console.log(occurrences);
};

const handleCountChoice = (occurrences, settleResult) => {
    const choices = [
        "dragon",
        "phoenix",
        "tie",
        "threeOfAKind",
        "straightFlush",
        "flush",
        "straight",
        "pair8Plus",
        "highCard",
        "killer235",
    ];

    choices.forEach((choice) => {
        occurrences[choice].count += settleResult[choice] ? 1 : 0;
    });

    return occurrences;
};

const handleRadio = (occurrences) => {
    const mainChoices = ["dragon", "phoenix", "tie"];
    mainChoices.forEach((choice) => {
        occurrences[choice].ratio = occurrences[choice].count / TOTAL_ROUNDS;
    });

    return occurrences;
};

const randomModes = [1, 2, 3];

for (let randomMode of randomModes) {
    run(randomMode);
}

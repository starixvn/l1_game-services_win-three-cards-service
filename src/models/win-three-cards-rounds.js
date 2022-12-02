import mongoose from "mongoose";

const modelName = "winthreecards_rounds";

const card = {
    rank: Number,
    suit: Number,
};

const hand = {
    card1: card,
    card2: card,
    card3: card,
};

const handInfo = {
    cards: hand,
    handRankId: { type: Number, require: true },
    cardRankId: { type: Number, require: true },
};

const resultSchema = new mongoose.Schema(
    {
        dragon: handInfo,
        phoenix: handInfo,
    },
    { _id: false }
);

const settlementResultSchema = new mongoose.Schema(
    {
        dragon: { type: Boolean, default: false },
        phoenix: { type: Boolean, default: false },
        tie: { type: Boolean, default: false },
        threeOfAKind: { type: Boolean, default: false },
        straightFlush: { type: Boolean, default: false },
        flush: { type: Boolean, default: false },
        straight: { type: Boolean, default: false },
        pair8Plus: { type: Boolean, default: false },
        killer235: { type: Boolean, default: false },
        highCard: { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    id: { type: Number, require: true },
    result: resultSchema,
    settlementResult: settlementResultSchema,
    time: { type: Date, default: new Date() },
    exchangeRateId: { type: Number, require: true },
});

export default mongoose.model(modelName, Schema);

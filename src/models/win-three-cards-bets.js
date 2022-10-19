import mongoose from "mongoose";

const bet = {
    uid: { type: String, required: true },
    name: { type: String, required: true },
    phien: { type: Number, required: true },
    dragon: { type: Number, default: 0 },
    phoenix: { type: Number, default: 0 },
    tie: { type: Number, default: 0 },
    threeOfAKind: { type: Number, default: 0 },
    straightFlush: { type: Number, default: 0 },
    flush: { type: Number, default: 0 },
    straight: { type: Number, default: 0 },
    pair8Plus: { type: Number, default: 0 },

    thanhtoan: { type: Boolean, default: false },
    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    memberId: { type: Number },
    siteId: { type: String },
    freeBet: { type: Boolean, default: false },
};

const bets = mongoose.model(
    "winthreecards_bets",
    new mongoose.Schema({
        ...bet,
        currency: { type: String, require: true },
        rate: { type: Number, require: true },
        partnerId: { type: String, require: true },
    })
);
const tmpBets = mongoose.model("winthreecards_tmpbets", new mongoose.Schema(bet));

export { bets, tmpBets };

import mongoose from "mongoose";
import { Models } from "sc-card-game-base";

export default mongoose.model("winthreecards_results", Models.ResultSchema);

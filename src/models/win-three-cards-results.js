import mongoose from "mongoose";
import { Core } from "sc-game-base";

export default mongoose.model("winthreecards_results", Core.Models.ResultSchema);

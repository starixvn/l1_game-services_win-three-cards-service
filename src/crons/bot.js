import { helpers } from "sc-common";
import { Table } from "sc-game-base";

import constants from "../constants";

export default class Bot extends Table.Crons.TableGameBot {
    constructor(definition, gameData, publisher, userInfosRepository, tempBetsRepository) {
        super(definition, gameData, publisher, userInfosRepository, tempBetsRepository);

        this.betChoiceRatio = { DragonPhoenixPair8Plus: 90, ThreeOfAKind: 1, StraightFlush: 2, FlushStraight: 7 };

        this.dragonPhoenixPair8PlusOpts = ["dragon", "phoenix", "pair8Plus"];
        this.threeOfAKindOpts = ["threeOfAKind"];
        this.straightFlushOpts = ["straightFlush"];
        this.flushStraightOpts = ["flush", "straight"];
    }

    resetAllBotData() {
        super.resetAllBotData();
        this.resetAllBets();
    }

    resetAllBets() {
        this.allBets = {
            dragon: 0,
            phoenix: 0,
            pair8Plus: 0,
            threeOfAKind: 0,
            straightFlush: 0,
            flush: 0,
            straight: 0,
        };

        this.smallTickets = 0;
    }

    getBetChoice(bot) {
        const totalBotBet = this.getAllBetAmount();

        const betChoiceRatios = [
            {
                group: this.dragonPhoenixPair8PlusOpts,
                underBetRatio:
                    (this.getTotalAmountOnChoiceGroup(this.dragonPhoenixPair8PlusOpts) * 100) / totalBotBet <
                    this.betChoiceRatio.DragonPhoenixPair8Plus,
            },
            {
                group: this.threeOfAKindOpts,
                underBetRatio:
                    (this.getTotalAmountOnChoiceGroup(this.threeOfAKindOpts) * 100) / totalBotBet < this.betChoiceRatio.ThreeOfAKind,
            },
            {
                group: this.straightFlushOpts,
                underBetRatio:
                    (this.getTotalAmountOnChoiceGroup(this.straightFlushOpts) * 100) / totalBotBet < this.betChoiceRatio.StraightFlush,
            },
            {
                group: this.flushStraightOpts,
                underBetRatio:
                    (this.getTotalAmountOnChoiceGroup(this.flushStraightOpts) * 100) / totalBotBet < this.betChoiceRatio.FlushStraight,
            },
        ];

        const underRatioGroups = helpers.arrayHelper.shuffle(betChoiceRatios.filter((data) => data.underBetRatio));

        const choice =
            underRatioGroups.length > 0
                ? this.getRandomChoiceFromGroup(underRatioGroups[0].group)
                : this.getRandomChoiceFromGroup(this.dragonPhoenixPair8PlusOpts);

        const previousUniqueChoices = bot.choices.filter((betChoice) => this.dragonPhoenixPair8PlusOpts.includes(betChoice));

        return previousUniqueChoices.length > 0 ? previousUniqueChoices[0] : choice;
    }

    getMaxBet(bot, choice) {
        const gameConfigs = this.gameData.gameConfigs;
        const minBet = this.getMinBet();
        const maxBetPerChoice = gameConfigs.choices_maxbet[choice];
        const botMaxBet = gameConfigs.bot_maxbet;
        const maxBet = Math.min(maxBetPerChoice, botMaxBet);

        if (this.dragonPhoenixPair8PlusOpts.includes(choice) || this.flushStraightOpts.includes(choice)) {
            const isSmallTicket = this.totalTickets === 0 ? true : (this.smallTickets * 100) / this.totalTickets < this.smallTicketRatio;
            const maxBetOfSmallTicket = Math.min(minBet * 50, botMaxBet * 0.3);
            return isSmallTicket ? maxBetOfSmallTicket : maxBet;
        }

        return Math.min(minBet * 50, maxBet * 0.2);
    }

    getRandomChoiceFromGroup(group) {
        return this.chance.pickone(group);
    }

    getTotalAmountOnChoiceGroup(choices) {
        let total = 0;
        choices.forEach((choice) => (total += this.allBets[choice] ?? 0));

        return total;
    }

    getAllBetAmount() {
        let total = 0;
        this.definition.choices.forEach((choice) => (total += this.allBets[choice] ?? 0));

        return total;
    }

    convertAmountToChip(amount) {
        const chipList = constants.chips.filter((chip) => amount / chip >= 1);

        return chipList.length > 0 ? chipList[0] : this.getMinBet();
    }

    isSmallTicket(amount) {
        return amount <= this.getMinBet() * 50;
    }

    updateBotInRoomData(bot, choice, amount, balance) {
        super.updateBotInRoomData(bot, choice, amount, balance);

        this.allBets[choice] = this.allBets[choice] ? this.allBets[choice] + amount : amount;
        this.smallTickets += this.isSmallTicket(amount) ? 1 : 0;
    }
}

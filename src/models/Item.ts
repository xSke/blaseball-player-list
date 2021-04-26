import { ItemPart, PlayerItem } from "../api/types";
import { AdvancedStats, statIndices, StatName } from "./AdvancedStats";
import { Stars } from "./Stars";

export class Item {
    stars: Stars;
    stats: AdvancedStats;

    constructor(public data: PlayerItem) {
        this.stars = this.isBroken()
            ? new Stars()
            : new Stars(
                  this.data.hittingRating * 5,
                  this.data.pitchingRating * 5,
                  this.data.baserunningRating * 5,
                  this.data.defenseRating * 5
              );
        this.stats = this.getStats();
    }

    isBroken(): boolean {
        return this.data.health === 0 && this.data.durability !== -1;
    }

    private getStats(): AdvancedStats {
        if (this.data.health === 0 && this.data.durability !== -1)
            return AdvancedStats.new();

        // mutable...
        const stats: Partial<Record<StatName, number>> = {};
        for (const id of statIndices) stats[id] = 0;

        function applyPart(part: ItemPart) {
            for (const adj of part.adjustments) {
                if (adj.type === 1) {
                    const stat = statIndices[adj.stat];
                    stats[stat] = (stats[stat] ?? 0) + adj.value;
                }
            }
        }

        if (this.data.root) applyPart(this.data.root);
        if (this.data.prePrefix) applyPart(this.data.prePrefix);
        if (this.data.postPrefix) applyPart(this.data.postPrefix);
        if (this.data.suffix) applyPart(this.data.suffix);
        if (this.data.prefixes) {
            for (const prefix of this.data.prefixes) applyPart(prefix);
        }

        return new AdvancedStats(stats as Record<StatName, number>);
    }
}

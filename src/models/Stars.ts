export class Stars {
    constructor(
        public batting: number = 0,
        public pitching: number = 0,
        public baserunning: number = 0,
        public defense: number = 0
    ) {}

    get combined(): number {
        return this.batting + this.pitching + this.baserunning + this.defense;
    }

    add(other: Stars): Stars {
        return new Stars(
            this.batting + other.batting,
            this.pitching + other.pitching,
            this.baserunning + other.baserunning,
            this.defense + other.defense
        );
    }
}

export enum AnswerDifficulty {
    WRONG,
    HARD,
    EASY,
}

export class Flashcard {
    readonly front: string;
    readonly back: string;

    constructor(front: string, back: string) {
        this.front = front;
        this.back = back;
    }

    static make(front: string, back: string): Flashcard {
        const output = new Flashcard(front, back);
        return output;
    }

    public toString(): string {
        const output:string = "back: " + this.back + ", front: " + this.front + ".";
        return output;
    }
}
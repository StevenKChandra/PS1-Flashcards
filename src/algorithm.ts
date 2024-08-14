import { Flashcard, AnswerDifficulty } from "./flashcards.js";

/**
 * Reorganize learning buckets from a map representation to a list-of-sets representation.
 * @param bucketMap maps each flashcard to a (nonnegative integer) bucket number
 * @returns a list of disjoint sets whose union is the set of cards in bucketMap, and where list[i] is the set of cards that bucketMap maps to i, for all i in [0, list.length).
 */
export function toBucketSets(bucketMap: Map<Flashcard, number>): ReadonlyArray<Set<Flashcard>> {
    let bucketSets: Array<Set<Flashcard>> = new Array<Set<Flashcard>> ();
    for (const item of bucketMap.entries()){
        while (bucketSets.length <= item[1]){
            bucketSets.push(new Set<Flashcard>());
        }
        bucketSets[item[1]].add(item[0]);
    }
    return bucketSets;
}

/**
 * Find a minimal range of bucket numbers covering a list of learning buckets.
 * @param buckets a list of disjoint sets representing learning buckets, where buckets[i] is the set of cards in the ith bucket, for all 0 <= i < buckets.length
 * @returns a pair of integers [low, high], 0 <= low <= high, such that every card in buckets has an integer bucket number in the range [low...high] inclusive, and high - low is as small as possible
 */
export function getBucketRange(buckets: Array<Set<Flashcard>>): ReadonlyArray<number> {
    let low: number = NaN;
    let high: number = NaN;
    for (let i: number = 0; i < buckets.length; i++){
        if (buckets[i].size != 0){
            if (Number.isNaN(low)){
                low = i;
            }
            high = i;
        }
    }
    return new Array(low, high);
}

/**
 * Generate a sequence of flashcards for practice on a particular day.
    @param day day of the learning process. Must be integer >= 1.
    @param bucket a list of disjoint sets representing learning buckets, where buckets[i] is the set of cards in the ith bucket for all 0 <= i <= retiredBucket.
    @param retiredBucket number of retired bucket. Must be an integer >= 0.
    @returns an array of flashcards for practice on a particular day
    */

export function practice(day: number, buckets: Array<Set<Flashcard>>, retiredBucket: number): ReadonlyArray<Flashcard> {
    let flashcardPractice: Array<Flashcard> = new Array<Flashcard> ();
    for (let i: number = 0; i < buckets.length; i++){
        if (i === retiredBucket){
            break;
        }
        let dayToRepeat: number = Math.pow(2, i);
        if (day % dayToRepeat != 0){
            continue;
        }
        for (const j of buckets[i]){
            flashcardPractice.push(j);
        }
    }
    return flashcardPractice;
}

/**
 * Update step for the Modified-Leitner algorithm.
 * @param card a flashcard the user just saw
 * @param answer the difficulty of the user's answer to the flashcard
 * @param bucketMap represents learning buckets before the flashcard was seen. Maps each flashcard in the map to a nonnegative integer bucket number in the range [0...retiredBucket] inclusive. Mutated by this method to put card in the appropriate bucket, as determined by the Modified-Leitner algorithm.
 * @param retiredBucket number of retired bucket. Must be an integer >= 0.
 * @returns void
 */
export function update(card: Flashcard, answer: AnswerDifficulty, bucketMap: Map<Flashcard, number>, retiredBucket: number): void {
    let val = bucketMap.get(card);
    if (answer === AnswerDifficulty.EASY) {
        if (val != undefined){
            bucketMap.set(card, val + 1);
        }
    }
    else if (answer === AnswerDifficulty.HARD) {
        if (val != undefined && val != 0){
            bucketMap.set(card, val - 1);
        }
    }
    else {
        bucketMap.set(card, 0);
    }
}
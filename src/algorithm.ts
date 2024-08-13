import { Flashcard, AnswerDifficulty } from "./flashcards.js";

function toBucketSets(bucketMap: Map<Flashcard, number>): ReadonlyArray<Set<Flashcard>> {
    let bucketSets: Array<Set<Flashcard>> = new Array<Set<Flashcard>> ();
    for (const item of bucketMap.entries()){
        while (bucketSets.length <= item[1]){
            bucketSets.push(new Set<Flashcard>());
        }
        bucketSets[item[1]].add(item[0]);
    }
    return bucketSets;
}
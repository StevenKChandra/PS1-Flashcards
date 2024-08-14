import assert from "assert";
import { AnswerDifficulty, Flashcard} from "../flashcards.js";
import { toBucketSets, getBucketRange, practice, update } from "../algorithm.js";

let flashcardDeck: Array<Flashcard> = new Array<Flashcard> ();
    flashcardDeck.push(new Flashcard("DRY", "Don't Repeat Yourself"));
    flashcardDeck.push(new Flashcard("RFC", "Ready for Change"));
    flashcardDeck.push(new Flashcard("SFB", "Safe from Bugs"));
    flashcardDeck.push(new Flashcard("ETU", "Easy to Understand"));
    flashcardDeck.push(new Flashcard("ADT", "Abstract Data Types"));

function createBucketSets(ordering: Array<number>): Array<Set<Flashcard>> {
    let BucketSets: Array<Set<Flashcard>> = new Array<Set<Flashcard>> ();
    for (let i:number = 0; i < ordering.length; i++) {
        while (BucketSets.length <= ordering[i]){
            BucketSets.push(new Set<Flashcard> ());
        }
        BucketSets[ordering[i]].add(flashcardDeck[i]);
    }
    return BucketSets;
}

function createBucketMap(ordering: Array<number>): Map<Flashcard, number> {
    let BucketMap: Map<Flashcard, number> = new Map<Flashcard, number> ();
    for (let i:number = 0; i < ordering.length; i++) {
        BucketMap.set(flashcardDeck[i], ordering[i]);
    }
    return BucketMap;
}

describe("toBucketSets", function() {
    /**
     * Testing strategy
     * 
     * parition on BucketMap:
     *  empty bucketMap
     *  non empty bucketMap
     *  there exist an integer 0 <= i < bucketSet.length where the bucketSet[i] is an emtpy set
     */
    it("covers empty bucketMap", function() {
        const bucketMapEmpty: Map<Flashcard, number> = new Map<Flashcard, number> ();
        const bucketSetsEmpty: Array<Set<Flashcard>> = new Array<Set<Flashcard>> ();

        assert.deepStrictEqual(toBucketSets(bucketMapEmpty), bucketSetsEmpty);
    });
    it("covers non empty bucketMap, " +
        "the case where there exist an integer 0 <= i < bucketSet.length and bucketSet[i] is an emtpy set", function() {        
        const bucketMap: Map<Flashcard, number> = createBucketMap([0,0,1,3]);
        const bucketSets: Array<Set<Flashcard>> = createBucketSets([0,0,1,3])

        assert.deepStrictEqual(toBucketSets(bucketMap), bucketSets);
    });
});

describe("getBucketRange", function() {
    /*
     * Testing strategy
     * 
     * partition on buckets:
     *  empty buckets
     *  non empty buckets
     *  there exist an integer low <= i < high where the bucket[i] is an emtpy set
     *  low == high
     */
    it("covers empty bucket", function() {
        const bucketsEmpty: Array<Set<Flashcard>> = new Array<Set<Flashcard>> ();

        assert.deepStrictEqual(getBucketRange(bucketsEmpty), [NaN, NaN]);
    });
    it("covers non empty bucket, " + 
        "the case where there exist an integer 0 <= i < bucket.Length and the bucket[i] is an emtpy set", function() {
        const bucket: Array<Set<Flashcard>> = createBucketSets([0,0,1,3])

        assert.deepStrictEqual(getBucketRange(bucket), new Array<number>(0,3));
    });
    it("covers high == low", function() {
        const bucket: Array<Set<Flashcard>> = createBucketSets([1,1,1,1])

        assert.deepStrictEqual(getBucketRange(bucket), new Array<number>(1,1));
    });
});

describe("practice", function() {
    /*
     * Testing strategy
     * 
     * partition on day:
     *  day == 1
     *  day != 1
     * 
     * partition on buckets:
     *  empty buckets
     *  non empty buckets
     *  there exist an integer low <= i < high where the bucket[i] is an emtpy set
     * 
     * partition on buckets.length and retiredBucket:
     *  bucket.length < retiredBucket
     *  bucket.length >= retiredBucket
     * 
     */
    it("covers day != 1, " + 
        "non empty buckets, " +
        "bucket.length < retiredBucket", function() {
        const bucket: Array<Set<Flashcard>> = createBucketSets([0,0,2,3,1]);
        
        const flashcardSet: ReadonlyArray<Flashcard> = practice(2, bucket, 10);
        assert.strictEqual(flashcardSet.length, 3);
        assert(flashcardSet.includes(flashcardDeck[0]), "a card that should be included is not included");
        assert(flashcardSet.includes(flashcardDeck[1]), "a card that should be included is not included");
        assert(flashcardSet.includes(flashcardDeck[4]), "a card that should be included is not included");
        assert(!flashcardSet.includes(flashcardDeck[2]), "a card that should not be included is included");
        assert(!flashcardSet.includes(flashcardDeck[3]), "a card that should not be included is included");
    });
    it("covers day == 1, " +
        "empty buckets, " +
        "bucket.length < retiredBucket", function() {
        
        const bucket: Array<Set<Flashcard>> = createBucketSets([]);
        const flashcardSet: ReadonlyArray<Flashcard> = practice(1, bucket, 10);
        assert.strictEqual(flashcardSet.length, 0);
    });
    it("covers day != 1, " +
        "non empty buckets, " +
        "bucket.length >= retiredBucket", function() {
        
        const bucket: Array<Set<Flashcard>> = createBucketSets([0,0,3,2,2]);
        const flashcardSet: ReadonlyArray<Flashcard> = practice(8, bucket, 3);
        assert.strictEqual(flashcardSet.length, 4);
        assert(flashcardSet.includes(flashcardDeck[0]), "a card that should be included is not included");
        assert(flashcardSet.includes(flashcardDeck[1]), "a card that should be included is not included");
        assert(flashcardSet.includes(flashcardDeck[3]), "a card that should be included is not included");
        assert(flashcardSet.includes(flashcardDeck[4]), "a card that should be included is not included");
        assert(!flashcardSet.includes(flashcardDeck[2]), "a card that should not be included is included");
    });
});

describe("update", function() {
    /**
     * Testing strategy
     * 
     * partition on answer:
     *  answer = AnswerDifficulty.EASY
     *  answer = AnswerDifficulty.HARD
     *  answer = AnswerDifficulty.WRONG
     * 
     * partition on retriedBucket, card, and bucketMap:
     *  card is updated to a retiredBucket
     *  card is not updated to a retriedBucket
     * 
     * parititon on answer and bucketMap:
     *  card is currently at bucket zero and answer = AnswerDifficulty.HARD
     *  card is currently not at bucket zero or answer != AnswerDifficulty.HARD
     */
    it("covers answer = AnswerDifficulty.EASY, " +
        "card is updated to a retriedBucket, " +
        "card is currently not at bucket zero or answer != AnswerDifficulty.HARD", function() {
        let bucketMap: Map<Flashcard, number> = createBucketMap([0,1,2,3,4]);

        update(flashcardDeck[3], AnswerDifficulty.EASY, bucketMap, 4);
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[3]), 4, "card updated to wrong bucket");
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[0]), 0, "updated wrong card");
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[1]), 1, "updated wrong card");
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[2]), 2, "updated wrong card");
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[4]), 4, "updated wrong card");
    });
    it("covers answer = AnswerDifficulty.HARD, " +
        "card is not updated to a retriedBucket" +
        "card is currently at bucket zero and answer = AnswerDifficulty.HARD", function() {
        let bucketMap: Map<Flashcard, number> = createBucketMap([0,1,2,3,4]);

        update(flashcardDeck[0], AnswerDifficulty.HARD, bucketMap, 3);
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[0]), 0, "card updated to wrong bucket");
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[1]), 1, "updated wrong card");
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[2]), 2, "updated wrong card");
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[3]), 3, "updated wrong card");
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[4]), 4, "updated wrong card");
    });
    it("covers answer = AnswerDifficulty.WRONG, " +
        "card is not updated to a retriedBucket" +
        "card is currently not at bucket zero or answer != AnswerDifficulty.HARD", function() {
        let bucketMap: Map<Flashcard, number> = createBucketMap([0,1,2,3,4]);

        update(flashcardDeck[4], AnswerDifficulty.WRONG, bucketMap, 5);
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[4]), 0, "card updated to wrong bucket");
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[0]), 0, "updated wrong card");
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[1]), 1, "updated wrong card");
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[2]), 2, "updated wrong card");
        assert.deepStrictEqual(bucketMap.get(flashcardDeck[3]), 3, "updated wrong card");
    });
});
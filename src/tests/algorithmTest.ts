import assert from "assert";
import { Flashcard} from "../flashcards.js";
import { toBucketSets, getBucketRange, practice } from "../algorithm.js";

let flashcardDeck: Array<Flashcard> = new Array<Flashcard> ();
    flashcardDeck.push(new Flashcard("DRY", "Don't Repeat Yourself"));
    flashcardDeck.push(new Flashcard("RFC", "Ready for Change"));
    flashcardDeck.push(new Flashcard("SFB", "Safe from Bugs"));
    flashcardDeck.push(new Flashcard("ETU", "Easy to Understand"));
    flashcardDeck.push(new Flashcard("ADT", "Abstract Data Types"));

function createBucketSets(ordering: Array<number>): Array<Set<Flashcard>> {
    let output: Array<Set<Flashcard>> = new Array<Set<Flashcard>> ();
    for (let i:number = 0; i < ordering.length; i++) {
        while (output.length <= ordering[i]){
            output.push(new Set<Flashcard> ());
        }
        output[ordering[i]].add(flashcardDeck[i]);
    }
    return output;
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
        const bucketMap: Map<Flashcard, number> = new Map<Flashcard, number> ();
        bucketMap.set(flashcardDeck[0], 0);
        bucketMap.set(flashcardDeck[1], 0);
        bucketMap.set(flashcardDeck[2], 1);
        bucketMap.set(flashcardDeck[3], 3);

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
    /**
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
        assert(flashcardSet.includes(flashcardDeck[0]));
        assert(flashcardSet.includes(flashcardDeck[1]));
        assert(flashcardSet.includes(flashcardDeck[4]));
    });
    it("covers day == 1, " +
        "empty buckets" +
        "bucket.length < retiredBucket", function() {
        
        const bucket: Array<Set<Flashcard>> = createBucketSets([]);
        const flashcardSet: ReadonlyArray<Flashcard> = practice(1, bucket, 10);
        assert.strictEqual(flashcardSet.length, 0);
    });
    it("covers day != 1, " +
        "non empty buckets" +
        "bucket.length >= retiredBucket", function() {
        
        const bucket: Array<Set<Flashcard>> = createBucketSets([0,0,3,2,2]);
        const flashcardSet: ReadonlyArray<Flashcard> = practice(8, bucket, 3);
        assert.strictEqual(flashcardSet.length, 4);
        assert(flashcardSet.includes(flashcardDeck[0]));
        assert(flashcardSet.includes(flashcardDeck[1]));
        assert(flashcardSet.includes(flashcardDeck[3]));
        assert(flashcardSet.includes(flashcardDeck[4]));
    });
});
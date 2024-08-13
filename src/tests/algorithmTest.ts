import assert from "assert";
import { Flashcard} from "../flashcards.js";
import { toBucketSets, getBucketRange} from "../algorithm.js";

const Flashcard01: Flashcard = new Flashcard("DRY", "Don't Repeat Yourself");
const Flashcard02: Flashcard = new Flashcard("RFC", "Ready for Change");
const Flashcard03: Flashcard = new Flashcard("SFB", "Safe from Bugs");
const Flashcard04: Flashcard = new Flashcard("ETU", "Easy to Understand");

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
        "covers the case where there exist an integer 0 <= i < bucketSet.length and bucketSet[i] is an emtpy set", function() {        
        const bucketMap: Map<Flashcard, number> = new Map<Flashcard, number> ();
        bucketMap.set(Flashcard01, 0);
        bucketMap.set(Flashcard02, 0);
        bucketMap.set(Flashcard03, 1);
        bucketMap.set(Flashcard04, 3);

        const bucketSets: Array<Set<Flashcard>> = new Array<Set<Flashcard>> ();
        bucketSets.push(new Set<Flashcard> ());
        bucketSets.push(new Set<Flashcard> ());
        bucketSets.push(new Set<Flashcard> ());
        bucketSets.push(new Set<Flashcard> ());

        bucketSets[0].add(Flashcard01);
        bucketSets[0].add(Flashcard02);
        bucketSets[1].add(Flashcard03);
        bucketSets[3].add(Flashcard04);

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
     *  there exist an integer low<=i<high where the bucket[i] is an emtpy set
     *  low == high
     */
    it("covers empty bucket", function() {
        const bucketsEmpty: Array<Set<Flashcard>> = new Array<Set<Flashcard>> ();

        assert.deepStrictEqual(getBucketRange(bucketsEmpty), [NaN, NaN]);
    });
    it("covers non empty bucket, " + 
        "covers the case where there exist an integer 0 <= i < bucket.Length and the bucket[i] is an emtpy set", function() {
        const bucket: Array<Set<Flashcard>> = new Array<Set<Flashcard>> ();
        bucket.push(new Set<Flashcard> ());
        bucket.push(new Set<Flashcard> ());
        bucket.push(new Set<Flashcard> ());
        bucket.push(new Set<Flashcard> ());
        bucket[0].add(Flashcard01);
        bucket[0].add(Flashcard02);
        bucket[1].add(Flashcard03);
        bucket[3].add(Flashcard04);

        assert.deepStrictEqual(getBucketRange(bucket), new Array<number>(0,3));
    });
    it("covers high == low", function() {
        const bucket: Array<Set<Flashcard>> = new Array<Set<Flashcard>> ();
        bucket.push(new Set<Flashcard> ());
        bucket.push(new Set<Flashcard> ());
        bucket[1].add(Flashcard01);
        bucket[1].add(Flashcard02);
        bucket[1].add(Flashcard03);
        bucket[1].add(Flashcard04);

        assert.deepStrictEqual(getBucketRange(bucket), new Array<number>(1,1));
    });
});
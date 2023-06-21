const findMax = require("./findMax");

describe("findMax should take an array and return its largest number", ()=>{
    test("findMax([]) => null", ()=>{
        expect(findMax([])).toEqual(null);
    
    });

    test("findMax([1]) => 1", () => {
        expect(findMax([1])).toBe(1);
    });

    test("findMax([4, 2, 8, 10, 2]) => 10", () => {
        expect(findMax([4, 2, 8, 10, 2])).toBe(10);
    })
});
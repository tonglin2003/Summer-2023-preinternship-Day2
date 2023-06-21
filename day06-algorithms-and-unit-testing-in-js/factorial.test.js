const factorial = require("./factorial");

describe("factorial(n) computes the factorial of n", () =>{
    test("factorial(5) => 120", ()=>{
        expect(factorial(5)).toEqual(120);
    });
    test("factorial(1) => 1", ()=>{
        expect(factorial(1)).toEqual(1);
    });
    test("factorial(2) => 2", ()=>{
        expect(factorial(2)).toEqual(2);
    });
});
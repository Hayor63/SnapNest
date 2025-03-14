// Function definition should come before the tests
function sumNumbers(a: number, b: number) {
    return a + b;
  }
  
  // Test suite
  describe("sum is a number", () => {
    test("add two num", () => {
      // Arrange & Act
      const result = sumNumbers(4, 5);
  
      // Assert
      expect(result).toBe(9);
    });
  });
  
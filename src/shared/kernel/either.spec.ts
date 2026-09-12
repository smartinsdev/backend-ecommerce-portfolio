import { describe, expect, it } from "vitest";
import { type Either, isLeft, isRight, left, right } from "./either.js";

function doSomething(shouldSucceed: boolean): Either<string, number> {
  return shouldSucceed ? right(10) : left("error");
}

describe("Either", () => {
  it("creates a successful result", () => {
    const result = doSomething(true);
    expect(isRight(result)).toBe(true);
    expect(isLeft(result)).toBe(false);
    if (isRight(result)) expect(result.value).toBe(10);
  });

  it("creates a failure result", () => {
    const result = doSomething(false);
    expect(isLeft(result)).toBe(true);
    expect(isRight(result)).toBe(false);
    if (isLeft(result)) expect(result.value).toBe("error");
  });

  it("exposes the success value after narrowing with isRight", () => {
    const result = doSomething(true);
    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value).toBe(10);
    }
  });

  it("exposes the failure value after narrowing with isLeft", () => {
    const result = doSomething(false);
    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value).toBe("error");
    }
  });
});

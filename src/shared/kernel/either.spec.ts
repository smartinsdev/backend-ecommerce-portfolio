import { describe, expect, it } from "vitest";
import { type Either, left, right } from "./either.js";

function doSomething(shouldSucceed: boolean): Either<string, number> {
  return shouldSucceed ? right(10) : left("error");
}

describe("Either", () => {
  it("creates a successful result", () => {
    const result = doSomething(true);
    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) expect(result.value).toBe(10);
  });

  it("creates a failure result", () => {
    const result = doSomething(false);
    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    if (result.isLeft()) expect(result.value).toBe("error");
  });

  it("exposes the success value after narrowing with isRight", () => {
    expect.assertions(1);
    const result = doSomething(true);

    if (result.isRight()) {
      const value: number = result.value;
      expect(value).toBe(10);
    }
  });

  it("exposes the failure value after narrowing with isLeft", () => {
    expect.assertions(1);
    const result = doSomething(false);

    if (result.isLeft()) {
      const value: string = result.value;
      expect(value).toBe("error");
    }
  });
});

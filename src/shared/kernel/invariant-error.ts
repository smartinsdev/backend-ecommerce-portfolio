export class InvarianError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvariantError";
  }
}

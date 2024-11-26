export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = ErrorName.NotFoundError;
  }
}

export enum ErrorName {
  NotFoundError = "NotFoundError",
}

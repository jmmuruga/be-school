export class ValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}
export class UnauthenticatedException extends Error {
  constructor(message: string) {
     super(message);
}
}
export class ApplicationException extends Error {
  constructor(protected  _message: string) {
    super(_message);
  }

  get message() {
    return this._message;
  }
}

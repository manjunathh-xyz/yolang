export class YolangError extends Error {
  constructor(
    message: string,
    public file?: string,
    public line?: number,
    public column?: number,
    public hint?: string
  ) {
    super(message);
    this.name = 'YolangError';
  }
}
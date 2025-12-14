import { YolangError } from './YolangError';

export class CliError extends YolangError {
  constructor(message: string, file?: string, line?: number, column?: number, hint?: string) {
    super(message, file, line, column, hint);
    this.name = 'CliError';
  }
}
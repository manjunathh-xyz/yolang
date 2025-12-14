import { KexraError } from './KexraError';
import { StackFrame } from '../runtime/stack';

export class RuntimeError extends KexraError {
  constructor(
    message: string,
    file?: string,
    line?: number,
    column?: number,
    hint?: string,
    stackTrace?: StackFrame[]
  ) {
    super(message, file, line, column, hint, stackTrace);
    this.name = 'RuntimeError';
  }
}

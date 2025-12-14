import { StackFrame } from '../runtime/stack';

export class KexraError extends Error {
  public stackTrace: StackFrame[] = [];
  constructor(
    message: string,
    public file?: string,
    public line?: number,
    public column?: number,
    public hint?: string,
    stackTrace?: StackFrame[]
  ) {
    super(message);
    this.name = 'KexraError';
    if (stackTrace) this.stackTrace = stackTrace;
  }
}

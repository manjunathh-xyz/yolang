import { Value } from './values';

export interface StackFrame {
  functionName: string;
  line: number;
  column: number;
}

export class CallStack {
  private frames: StackFrame[] = [];

  push(frame: StackFrame): void {
    this.frames.push(frame);
  }

  pop(): StackFrame | undefined {
    return this.frames.pop();
  }

  peek(): StackFrame | undefined {
    return this.frames[this.frames.length - 1];
  }

  getStackTrace(): StackFrame[] {
    return [...this.frames];
  }

  clear(): void {
    this.frames = [];
  }

  isEmpty(): boolean {
    return this.frames.length === 0;
  }
}
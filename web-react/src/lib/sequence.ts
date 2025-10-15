export function randomPad(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % 4;
}

export class SequenceGenerator {
  private sequence: number[] = [];
  
  startNewGame(): number[] {
    this.sequence = [randomPad()];
    return this.sequence;
  }
  
  nextRound(): number[] {
    this.sequence.push(randomPad());
    return this.sequence;
  }
  
  getCurrentSequence(): number[] {
    return [...this.sequence];
  }
}

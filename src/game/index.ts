import * as readline from "readline";

export const input = (description = "", t?: number) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  return new Promise<string>((resolve) => {
    rl.question(
      description,
      { signal: t !== undefined ? AbortSignal.timeout(t * 1000) : t },
      (answer) => {
        rl.close();
        resolve(answer);
      }
    );
  });
  }
  

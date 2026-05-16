import {
  ParamRunProgramArgument,
  ParamRunProgramReturn,
  runProgram,
} from "../Program/ChildProgram";

export class ProcessManager {
  private readonly processes = new Map<string, ParamRunProgramReturn>();

  startProcess(id: string, params: ParamRunProgramArgument): ParamRunProgramReturn {
    if (this.processes.has(id)) {
      throw new Error(`Process already exists: ${id}`);
    }

    const process = runProgram(params);
    this.processes.set(id, process);
    process.done.then(
      () => this.processes.delete(id),
      () => this.processes.delete(id),
    );

    return process;
  }

  async stopProcess(id: string): Promise<void> {
    const process = this.processes.get(id);

    if (!process) {
      return;
    }

    await process.Stop();
    this.processes.delete(id);
  }

  async stopAll(): Promise<void> {
    await Promise.all(
      [...this.processes.keys()].map((id) => this.stopProcess(id)),
    );
  }

  isRunning(id: string): boolean {
    return this.processes.has(id);
  }

  listRunningProcessIds(): string[] {
    return [...this.processes.keys()];
  }
}

export const processManager = new ProcessManager();

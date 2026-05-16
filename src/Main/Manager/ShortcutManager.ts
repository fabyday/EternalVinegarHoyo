import { globalShortcut } from "electron";

export class ShortcutManager {
  private readonly accelerators = new Set<string>();

  register(accelerator: string, callback: () => void): boolean {
    if (this.accelerators.has(accelerator)) {
      globalShortcut.unregister(accelerator);
      this.accelerators.delete(accelerator);
    }

    const registered = globalShortcut.register(accelerator, callback);

    if (registered) {
      this.accelerators.add(accelerator);
    }

    return registered;
  }

  unregister(accelerator: string): void {
    globalShortcut.unregister(accelerator);
    this.accelerators.delete(accelerator);
  }

  unregisterAll(): void {
    for (const accelerator of this.accelerators) {
      globalShortcut.unregister(accelerator);
    }

    this.accelerators.clear();
  }

  listAccelerators(): string[] {
    return [...this.accelerators];
  }
}

export const shortcutManager = new ShortcutManager();

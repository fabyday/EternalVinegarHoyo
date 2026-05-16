export interface PluginManifest {
  id: string;
  name: string;
  version?: string;
  path?: string;
  enabled?: boolean;
}

export class PluginManager {
  private readonly plugins = new Map<string, PluginManifest>();

  registerPlugin(plugin: PluginManifest): void {
    this.plugins.set(plugin.id, {
      ...plugin,
      enabled: plugin.enabled ?? true,
    });
  }

  unregisterPlugin(id: string): void {
    this.plugins.delete(id);
  }

  setEnabled(id: string, enabled: boolean): void {
    const plugin = this.plugins.get(id);

    if (!plugin) {
      throw new Error(`Plugin not found: ${id}`);
    }

    this.plugins.set(id, { ...plugin, enabled });
  }

  getPlugin(id: string): PluginManifest | undefined {
    return this.plugins.get(id);
  }

  listPlugins(): PluginManifest[] {
    return [...this.plugins.values()];
  }
}

export const pluginManager = new PluginManager();

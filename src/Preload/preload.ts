import {} from "./Communicate/WineIPC";

import {
  InvokeChannelNames,
  OnChannelNames,
  SendChannelNames,
  PayloadOf,
} from "../Common/Types/IPC";
import { ipcRenderer } from "electron";
import { ipcMain } from "electron/main";
import { contextBridge } from "electron";

type voidFunctionType = () => void;

/**
 * Expose API
 *
 * Simple and Generic Method Collections BTIH(밥똥이리호요) API
 */

const BTIH_API = {
  /**
   *
   * @param channel
   * @param payload
   * @returns
   */
  invoke: async <C extends InvokeChannelNames>(
    channel: C,
    payload: PayloadOf<C>,
  ) => {
    return await ipcRenderer.invoke(channel, payload);
  },

  /**
   *
   * @param channel
   * @param callback
   * @returns unsubscribe function.
   */
  on: <C extends OnChannelNames>(
    channel: C,
    callback: (event: any, data: PayloadOf<C>) => void | Promise<void>,
  ): voidFunctionType => {
    ipcRenderer.on(channel, callback);

    // unsubscribe function
    return () => {
      ipcRenderer.removeListener(channel, callback);
    };
  },

  /**
   *
   * @param channel
   * @param payload
   */
  send: <C extends SendChannelNames>(channel: C, payload: PayloadOf<C>) => {
    ipcRenderer.send(channel, payload);
  },
};

contextBridge.exposeInMainWorld("BTIH_API", BTIH_API);

export type BTIH_API = typeof BTIH_API;

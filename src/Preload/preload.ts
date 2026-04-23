
import { InvokeChannelNames, PayloadOf } from "../Common/Constant/IPC";
import { } from "./Communicate/WineIPC"



const BTIH_API = {

    invoke: async<C extends InvokeChannelNames>(channel: C, payload: PayloadOf<C>) => {
        channel
    }

}


BTIH_API.invoke("wine:install", { version: "", installPath: "" })


export type BTIH_API = typeof BTIH_API;

import { getWebSocketRef } from "./ConnectBlade.js";

let ws = getWebSocketRef()
let dataObject = {}

export const pushTextToBlade = (text, utterance, status) => {
    dataObject.html = true;
    dataObject.status = status || null;
    dataObject.subheading = text || null;
    dataObject.content = utterance || null;

    // push text to Blade
        try {
            ws.send(JSON.stringify(dataObject));
        } catch(err) {
            console.log('Cannot connect to Blade server.', err)
        }
}

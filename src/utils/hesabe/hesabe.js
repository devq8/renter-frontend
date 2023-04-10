import hesabeCrypt from "hesabe-crypt";
import aesjs from "aes-js";

function handlePayment(params) {
  let secret = "XZx9dzjrPM748jD10JMapOkbVYyBALGR"; // Secret provided by Hesabe
  let ivCode = "PM748jD10JMapOkb"; // IV provided by Hesabe

  key = aesjs.utils.utf8.toBytes(secret);
  iv = aesjs.utils.utf8.toBytes(ivKey);

  let instance = new hesabeCrypt(key, iv);

  let text = "XXXXX"; // Any random text
  let encrypted = instance.encryptAes(text);

  let decrypted = instance.decryptAes(encrypted);
}

export default { handlePayment };

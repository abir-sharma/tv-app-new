//@ts-ignore
import * as crypto from 'crypto-js'

export const setJSONValue = (key: CookieKeys, data: any = '') => {
  const _config = config[key];
  if (_config) {
    document.cookie = `${key}=${data}; expires=${new Date(
      new Date().getTime() + _config.expiryInSeconds * 1000
    ).toUTCString()}; domain:${_config.domainsToShare};path=/`;
  }
}

export enum CookieKeys {
  'TOKEN_CONTEXT' = 'TOKEN_CONTEXT',
  'KEY_PAIR_ID' = 'CloudFront-Key-Pair-Id',
  'POLICY' = 'CloudFront-Policy',
  'SIGNATURE' = 'CloudFront-Signature',
}

const config = {
  [CookieKeys.TOKEN_CONTEXT]: {
    expiryInSeconds: 60 * 60 * 24 * 7,
    domainsToShare: 'pw.live',
  },
  [CookieKeys.KEY_PAIR_ID]: {
    expiryInSeconds: 60 * 60 * 6,
    domainsToShare: 'pw.live',
  },
  [CookieKeys.POLICY]: {
    expiryInSeconds: 60 * 60 * 6,
    domainsToShare: 'pw.live',
  },
  [CookieKeys.SIGNATURE]: {
    expiryInSeconds: 60 * 60 * 6,
    domainsToShare: 'pw.live',
  },
};

export function cookieSplitter(cookie: string) {
  let decryptedCookie = '';
  if (!cookie) {
    return '';
  }
  let cookieArr = cookie.split('&');
  for (let i = 0; i < 3; i++) {
    let cookiePart = cookieArr[i].split(/=(.*)/s); //splits from first occurrence of "="
    if (cookiePart[0] == "?Policy") decryptedCookie += "CloudFront-Policy"
    else if (cookiePart[0] == "Signature") decryptedCookie += "CloudFront-Signature"
    else if (cookiePart[0] == "Key-Pair-Id") decryptedCookie += "CloudFront-Key-Pair-Id"
    decryptedCookie +=
      '=' + getDecryptCookie(cookiePart[1]).toString() + ';';
  }
  return decryptedCookie;
}

function getDecryptCookie(cookie: any) {
  const key = crypto.enc.Utf8.parse(KEYS.VIDEO_ENCRYPTION_KEY);
  const iv = crypto.enc.Utf8.parse(KEYS.INITIALISATION_VECTOR);
  const decryptedKey = crypto.AES.decrypt(cookie, key, { iv: iv });
  return decryptedKey.toString(crypto.enc.Utf8);
  // let decipher = crypto.createDecipheriv('aes-256-cbc', KEYS.VIDEO_ENCRYPTION_KEY, KEYS.INITIALISATION_VECTOR);
  // let decrypted = decipher.update(cookie, 'base64', 'utf8');
  // return (decrypted + decipher.final('utf8'));
}

enum KEYS {
  VIDEO_ENCRYPTION_KEY = 'pw3c199c2911cb437a907b1k0907c17n',
  INITIALISATION_VECTOR = '5184781c32kkc4e8',
}
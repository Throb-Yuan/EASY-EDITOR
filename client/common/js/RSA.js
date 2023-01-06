/**
 * @file: RSA.加密算法
 * @authors: zhengyanfeng
 * @createDate: 2022/8/4.
 * @versionss: 1.0.
 * @copyright
 */
const crypto = require('crypto')

const pubKey = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAOo50wSIwTrgeFYd99BpZ9XYX+o1JVX7
tjOcSo4Z2V0GKEz+oR5PsZgQvhLg7nu1nnJUAuxEND0VYi9olhFFzT0CAwEAAQ==
-----END PUBLIC KEY-----`

export default function publicEncrypt(message) {
  const enc_by_pub = crypto.publicEncrypt(
    {
      key: pubKey,
      padding: crypto.constants.RSA_PKCS1_PADDING
    },
    Buffer.from(message, 'utf8')
  )
  return enc_by_pub.toString('hex')
}

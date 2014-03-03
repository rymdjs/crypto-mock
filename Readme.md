Interface
---

The interface will provide the following functions
- generateKeyPair: function() -> Promise({Uint8array,Uint8array})
- exportKey: function(WebCrypto::Key) -> Promise({Uint8array})
- importKey: function(String,Uint8array) -> Promise(WebCrypto::Key)
- signKey: function(WebCrypto::Key,String) -> Promise 
- verifyKey: function(WebCrypto::Key,String) -> Promise
- encrypt**: function(??) -> ?
- generateAsymmetricKey: function() -> ?

These will always work even if the underlying structure of the module might change. 


Get started
---

```javascript
    Crypto.generateKeyPair().then(
      function(key){
        var publicKey = key.publicKey
        var privatekey = key.privateKey
        //store private key in local store before import.

        Crypto.importKey("public",publicKey).then(
          function(pubkey){
            //do some encryption/decryption
          })
        Crypto.importKey("private",publicKey).then(
          function(privkey){
            //do some encryption/decryption 
          })
      });
```




Keys in Openssl
---

The following tests can be performed to ensure the key has been correctly generated;

Fist run ``Utils._uint8ArrayToString(arg)`` for both keys to get the keys in base64.

Now paste them into a new files to make it look somethig like this for the private.
```
-----BEGIN PRIVATE KEY-----
MIICeQIBADANBgkqhkiG9w0BAQEFAASCAmMwggJfAgEAAoGBAOpSXb05KoLox1yb
OB8AIYzia1qFoGzkflySq4lV/0OveQq30Y9wdNEIuWH1HnykSLbfsmybSwhL+Fla
6TfB8/zbKQJvM/muLGASs2685f9IGp+lWBODI3c35YuQqXvvirCw6Rzj5q6B7ny8
ZqYqM1mdiAHy/pi3Ya3Ifrd8TouxAgMBAAECgYEA1p/y9Gr0IUwNrykNUnfQQzbw
lc1nj9YKV8iQDg8S7HBBMiwEapnapcyT4MGf1xKy964Vw5zKMSNEqrO2gjfIvcVa
Ij7g5Et2OIdM7NaCTz/VduibI3Pfi5EquQf2tuckrEhpZqfgP622nzMxF8iLxEop
Vod/81K0nG/qlpuOgEECQQD4Ef/pn49HmEKj1VPK7zMgguOaW6n0SGB8f7X78a1P
8aPlUDtm7PY1kR5cBdKgfPHLNS3bOoym3dcCG5MMxSqlAkEA8c/cFY8UbF4oiCR0
a6W+e0M7J9LSrZDVqsXZL5hWsVuXBHJZY20bXezljxnMWWd4qte/OfmZc+qWUy1L
VmMrHQJBAOXHvnWHX69ggPHCq1ABSyllNDAJkh59YCpSHZ6WmQPA/yBstek7uz+Z
ATcaCaSwt0OUKbq0vA3g1MTWB9q/UyUCQQC7nDi2JVeEKJ2r2xTUfDjIa8YWxLQe
Y7PTFkPGcJw6aMRHd+ywfnNwMR9+Ilbwup3ddxxvf582VzigehDsim5lAkEAniRw
0dYsMoNiWQyfSKQpRwNej7HEeiGtfAdZZzIykXEoT2Fg4S0uoPuWNbdNmI7DTZwK
3Qwlmev+SV8dczsxMg==
-----END PRIVATE KEY----- 

```
and something like this for the public.
```
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDqUl29OSqC6MdcmzgfACGM4mta
haBs5H5ckquJVf9Dr3kKt9GPcHTRCLlh9R58pEi237Jsm0sIS/hZWuk3wfP82ykC
bzP5rixgErNuvOX/SBqfpVgTgyN3N+WLkKl774qwsOkc4+auge58vGamKjNZnYgB
8v6Yt2GtyH63fE6LsQIDAQAB
-----END PUBLIC KEY-----

```
and name them example.pem and example.pub. 

To check that the key has a valid asn1 structure run
``$ openssl asn1parse -in example.pem``

To verify the components of the key run
``$ openssl rsa -in example.pem  -noout -text``

Encrypt 
``$ openssl rsautl -encrypt -inkey example.pub -pubin -in file.txt -out file.ssl``

Decrypt
``$ openssl rsautl -decrypt -inkey example.pem -in file.ssl -out decrypted.txt``







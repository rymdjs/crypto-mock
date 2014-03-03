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





Keys in Openssl
---

The following tests can be performed to ensure the key has been correctly generated;

Check that the key has a valid asn1 structure
``$ openssl asn1parse -in example.pem``

Checkout key components
``$ openssl rsa -in example.pem  -noout -text``

Encrypt 
``$ openssl rsautl -encrypt -inkey example.pub -pubin -in file.txt -out file.ssl``

Decrypt
``$ openssl rsautl -decrypt -inkey example.pem -in file.ssl -out decrypted.txt``







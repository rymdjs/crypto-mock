
(function (){
  var root = this;
  var Q = require('q');
  var utils = require("./cryptoback");

  var generationAlgorithm1 =  {
    name: "RSASSA-PKCS1-v1_5", 
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: {
      name: "SHA-1"
    }
  };

  var generationAlgorithm2 =  {
    name: "RSAES-PKCS1-v1_5", 
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01])

  };
  var encrytpionAlgorithm = {
    name: "RSAES-PKCS1-v1_5",
    iv: window.crypto.getRandomValues(new Uint8Array(16))
  };

  var decrytpionAlgorithm = {
    name: "RSAES-PKCS1-v1_5",
    iv: window.crypto.getRandomValues(new Uint8Array(16))
  };

  var signAlgorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: {
      name: "SHA-1"
    }
  };

  var verifyAlgorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: {
      name: "SHA-1",
    }
  };

  specFormats ={
    spki:'spki',
    pkcs8:'pkcs8'
  };

  var Crypto = {  

    settings: {
      numArticles: null,
      articleList: null,
      moreButton: null
    },
// Returns a publicKey and  a privateKey inside a Keypair.
// i if you want to access the public key write :
// .then(function(keypair){keypair.publicKey}) and the same for the private key

generateKeyPair: function(){ 
  return utils._generateRSAKeypair(1024);
},

// will return the key as a Uint8Array
// this can easily be parsed to string using base.stringify()
// (SubjectPublicKeyinfo) -> Promise

exportKey: function(generatedKey){
// add detect if asymmetric or symmetric algoritm
return window.crypto.subtle.exportKey(specFormats.spki,generatedKey).then(function(key){
  return new Uint8Array(key);
}
);
},
// Takes a Uint8Array! and makes a key (type,SubjectPublicKeyinfo) -> Promise
importKey: function(type,key){ 
  if (type === "private"){type = specFormats.pkcs8}
    else if(type === "public"){type = specFormats.spki};  
  return window.crypto.subtle.importKey(type,key,{name: "RSAES-PKCS1-v1_5"}, true, 
    ["encrypt", "decrypt"]);
},

signKey: function(generatedKey,resource){
  return window.crypto.subtle.sign(signAlgorithm, generatedKey,utils._string2ArrayBuffer(resource));
},

verifyKey: function(generatedKey,resource){
  return window.crypto.subtle.verify(verifyAlgorithm, generatedKey, utils._string2ArrayBuffer(resource), utils._string2ArrayBuffer(resource));
},

generateAsymmetricKey: function(){ 
// Generate random integer between 1 and 10
return Math.floor((Math.random()*10)+1);

},


// Encrypt a text with public or private key (Key,String) -> Promise
encryptText: function(shiftAmount,text,seed){

// Make an output variable
var output = '';

// Go through each character
for (var i = 0; i < text.length; i ++) {

// Get the character we'll be appending
var c = text[i];

var code = text.charCodeAt(i);
c = String.fromCharCode(code + shiftAmount);

// Append
output += c;

}

// All done!
return output;
},

// Decrypt a text with public or private key  (Key,String) -> Promise
decryptText: function(shiftAmount,text,seed){

// Make an output variable
var output = '';

// Go through each character
for (var i = 0; i < text.length; i ++) {

// Get the character we'll be appending
var c = text[i];

var code = text.charCodeAt(i);
c = String.fromCharCode(code - shiftAmount);

// Append
output += c;

}

// All done!
return output;
},
// Encrypt a blob with public or private key (Key,String) -> Promise
encryptBlob: function(shiftAmount,blob,seed){

  var reader = new FileReader();
//we read the content as array buffer so we can handle binary data 
//too

reader.readAsArrayBuffer(blob);
reader.onloadend = function() {
//we interpret the arraybuffer's content as Uint8Array
//so we can encode each byte as utf8 char
//Note: with small files you could pass the 'content' array 
//directly to String.fromCharCode but with bigger files you'll
//get "Maximum call stack size exceeded" so need to handle each 
var content = new Uint8Array(this.result);
var utf8 = "";
for (var i = 0, len = content.length; i < len; i++) {
  utf8 += String.fromCharCode(content[i]);
}
//at this point we encode the utf8 string to base64. you might 
//wonder why: I found problems after binary file decryption 
//if encryption was performed on utf8 string directly
var b64 = btoa(utf8);

//we finally encrypt it 
var encrypted = window.Crypto.encryptText(shiftAmount, b64);
var blob = new Blob([encrypted], {
  type: 'application/octet-stream'
});

console

//and return a new encrypted blob
return blob;
};
},


// Decrypt a blob with public or private key  (Key,String) -> Promise
decryptBlob: function(key,blob,seed){

  var reader = new FileReader();

//we read the content as array buffer so we can handle binary data 
//too
reader.readAsArrayBuffer(blob);

reader.onloadend = function() {
//we interpret the arraybuffer's content as Uint8Array
//so we can encode each byte as utf8 char
//Note: with small files you could pass the 'content' array 
//directly to String.fromCharCode but with bigger files you'll
//get "Maximum call stack size exceeded" so need to handle each 
var content = new Uint8Array(this.result);
var utf8 = "";
for (var i = 0, len = content.length; i < len; i++) {
  utf8 += String.fromCharCode(content[i]);
}
//at this point we encode the utf8 string to base64. you might 
//wonder why: I found problems after binary file decryption 
//if encryption was performed on utf8 string directly
var b64 = btoa(utf8);

//we finally encrypt it 
var decrypted = window.Crypto.encryptText(shiftAmount, b64);
var blob = new Blob([decrypted], {
  type: 'application/octet-stream'
});

//and return a new decrypted blob
return blob;
}
}
};
module.exports = this.Crypto = Crypto;
})();
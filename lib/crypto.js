(function (){

  var root = this;
  if(typeof module !== "undefined") {
    var Q = require('q');
  }

//Converts Uint8Array to and from base64 

var Crypto = {  
 Base64: {
  toString: function (a) {
    return btoa(String.fromCharCode.apply(0, a));
  },
  parse: function (s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, '');
    return new Uint8Array(Array.prototype.map.call(atob(s), function (c) { return c.charCodeAt(0) }));
  }
},
 //Add some browser kind of browser thing to make it work with firefox

// Returns a publicKey and  a privateKey inside a Keypair.
// i if you want to access the public key write :
// .then(function(keypair){keypair.publicKey}) and the same for the private key
generateKeypair: function(){ 
  var app = this;
  var FORMAT = 'spki';
  var ALGORITHM  = {
    name: "RSAES-PKCS1-v1_5", 
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01])
  };
  return window.crypto.subtle.generateKey(ALGORITHM, true, 
    ["encrypt", "decrypt", "unwrapKey"]);
},
// will return the key as a Uint8Array
// this can easily be parsed to string using base.stringify()
// (SubjectPublicKeyinfo) -> Promise
exportKey: function(generatedKey){

  var FORMAT = 'spki';
  if(generatedKey.type === 'private') {
    console.log("extracting a 'private' key is not a supported operation");
  }else{ 
    return window.crypto.subtle.exportKey(FORMAT,generatedKey).then(function(key){
      return new Uint8Array(key);
    });
  } 
},
// Takes a Uint8Array! and makes a key (SubjectPublicKeyinfo) -> Promise
importKey:function(key){ 
  var FORMAT = 'spki';
  var ALGORITHM  = {
    name: "RSAES-PKCS1-v1_5", 
  };
  return window.crypto.subtle.importKey(FORMAT,key,ALGORITHM, true, 
    ["encrypt", "decrypt", "unwrapKey"]);
},
//Convert subjectPublicKeyinfo to and from RsaPublic 
_subjectPublicKeyinfoToRsa: function (bytes){
//to be implemented like https://github.com/digitalbazaar/forge
//thease will need allot of work@!
},
_rsaToSubjectPublicKeyinfo: function (bytes){
//to be implemented like https://github.com/digitalbazaar/forge
//thease will need allot of work@!
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
  }

  // var uint8ArrayNew  = null;
  // var arrayBufferNew = null;
  // var fileReader     = new FileReader();

  // fileReader.onload  = function(progressEvent) {

  //   arrayBufferNew = this.result;
  //   uint8ArrayNew  = new Uint8Array(arrayBufferNew);

  //   // warn if read values are not the same as the original values
  //   // arrayEqual from: http://stackoverflow.com/questions/3115982/how-to-check-javascript-array-equals
  //   function arrayEqual(a, b) { return !(a<b || b<a); };

  //   console.log('test');

  //   if (arrayBufferNew.byteLength !== arrayBuffer.byteLength) // should be 3
  //       console.warn("ArrayBuffer byteLength does not match");

  //   if (arrayEqual(uint8ArrayNew, uint8Array) !== true) // should be [1,2,3]
  //       console.warn("Uint8Array does not match");
  // };

  // return window.Crypto.decryptText(
  //   shiftAmount,
  //   fileReader.readAsArrayBuffer(blob]
  // );
},


// Decrypt a blob with public or private key  (Key,String) -> Promise
decryptBlob: function(key,blob,seed){
  
  var AlGORITHM = {
    name: "AES-CBC",
    // Use the supplied seed if present, otherwise randomize
    iv: seed ? seed : window.crypto.getRandomValues(new Uint8Array(16))
  };

  var uint8ArrayNew  = null;
  var arrayBufferNew = null;
  var fileReader     = new FileReader();

  fileReader.onload  = function(progressEvent) {

    arrayBufferNew = this.result;
    uint8ArrayNew  = new Uint8Array(arrayBufferNew);

    // warn if read values are not the same as the original values
    // arrayEqual from: http://stackoverflow.com/questions/3115982/how-to-check-javascript-array-equals
    function arrayEqual(a, b) { return !(a<b || b<a); };

    console.log('test');

    if (arrayBufferNew.byteLength !== arrayBuffer.byteLength) // should be 3
        console.warn("ArrayBuffer byteLength does not match");

    if (arrayEqual(uint8ArrayNew, uint8Array) !== true) // should be [1,2,3]
        console.warn("Uint8Array does not match");
  };

  return window.crypto.subtle.decrypt(
    AlGORITHM,
    key,
    [fileReader.readAsArrayBuffer(blob)]
  );
},


storeKey: function(key){

}
}


if(typeof module !== "undefined" && typeof exports !== "undefined") {
  module.exports = root.Crypto = Crypto;


}
else {
  root.Crypto = Crypto;

}
})();
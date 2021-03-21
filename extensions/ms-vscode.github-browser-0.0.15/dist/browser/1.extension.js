self["webpackChunk"]([1],{

/***/ "./node_modules/blake3/browser-async.js":
/*!**********************************************!*\
  !*** ./node_modules/blake3/browser-async.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return load; });
/* harmony import */ var _esm_browser_wasm_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esm/browser/wasm.js */ "./node_modules/blake3/esm/browser/wasm.js");
/* harmony import */ var _dist_wasm_web_blake3_js_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dist/wasm/web/blake3_js.js */ "./node_modules/blake3/dist/wasm/web/blake3_js.js");
/* harmony import */ var _dist_wasm_web_blake3_js_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_dist_wasm_web_blake3_js_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _esm_browser_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./esm/browser/index.js */ "./node_modules/blake3/esm/browser/index.js");




let cached;

/**
 * Manually loads the WebAssembly module, returning a promise that resolves
 * to the BLAKE3 implementation once available.
 */
function load(module) {
  if (!cached) {
    cached = _dist_wasm_web_blake3_js_js__WEBPACK_IMPORTED_MODULE_1___default.a(module).then(() => {
      Object(_esm_browser_wasm_js__WEBPACK_IMPORTED_MODULE_0__["provideWasm"])(_dist_wasm_web_blake3_js_js__WEBPACK_IMPORTED_MODULE_1__);
      return _esm_browser_index_js__WEBPACK_IMPORTED_MODULE_2__;
    });
  }

  return cached;
}


/***/ }),

/***/ "./node_modules/blake3/dist/wasm/web/blake3_js.js":
/*!********************************************************!*\
  !*** ./node_modules/blake3/dist/wasm/web/blake3_js.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (219:23)\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\n| function init(module) {\n|     if (typeof module === 'undefined') {\n>         module = import.meta.url.replace(/\\.js$/, '_bg.wasm');\n|     }\n|     let result;");

/***/ }),

/***/ "./node_modules/blake3/esm/base/disposable.js":
/*!****************************************************!*\
  !*** ./node_modules/blake3/esm/base/disposable.js ***!
  \****************************************************/
/*! exports provided: using */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "using", function() { return using; });
const isPromiseLike = (value) => typeof value === 'object' && !!value && 'then' in value;
/**
 * A helper function that calls `.dispose()` on the {@link IDisposable} when
 * the given function (or promise returned by the function) returns.
 */
const using = (disposable, fn) => {
    let ret;
    try {
        ret = fn(disposable);
    }
    catch (e) {
        disposable.dispose();
        throw e;
    }
    if (!isPromiseLike(ret)) {
        disposable.dispose();
        return ret;
    }
    return ret.then(value => {
        disposable.dispose();
        return value;
    }, err => {
        disposable.dispose();
        throw err;
    });
};
//# sourceMappingURL=disposable.js.map

/***/ }),

/***/ "./node_modules/blake3/esm/base/hash-fn.js":
/*!*************************************************!*\
  !*** ./node_modules/blake3/esm/base/hash-fn.js ***!
  \*************************************************/
/*! exports provided: defaultHashLength, inputToArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultHashLength", function() { return defaultHashLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inputToArray", function() { return inputToArray; });
/**
 * Default hash length, in bytes, unless otherwise specified.
 */
const defaultHashLength = 32;
/**
 * Converts the input to an Uint8Array.
 * @hidden
 */
const inputToArray = (input) => input instanceof Uint8Array ? input : new Uint8Array(input);
//# sourceMappingURL=hash-fn.js.map

/***/ }),

/***/ "./node_modules/blake3/esm/base/hash-instance.js":
/*!*******************************************************!*\
  !*** ./node_modules/blake3/esm/base/hash-instance.js ***!
  \*******************************************************/
/*! exports provided: BaseHash */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseHash", function() { return BaseHash; });
/* harmony import */ var _hash_fn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hash-fn.js */ "./node_modules/blake3/esm/base/hash-fn.js");

/**
 * Base implementation of hashing.
 */
class BaseHash {
    constructor(implementation, alloc, getReader) {
        this.alloc = alloc;
        this.getReader = getReader;
        this.hash = implementation;
    }
    /**
     * @inheritdoc
     */
    update(data) {
        if (!this.hash) {
            throw new Error('Cannot continue updating hashing after dispose() has been called');
        }
        this.hash.update(Object(_hash_fn_js__WEBPACK_IMPORTED_MODULE_0__["inputToArray"])(data));
        return this;
    }
    /**
     * @inheritdoc
     */
    digest({ length = _hash_fn_js__WEBPACK_IMPORTED_MODULE_0__["defaultHashLength"], dispose = true } = {}) {
        if (!this.hash) {
            throw new Error('Cannot call digest() after dipose() has been called');
        }
        const digested = this.alloc(length);
        this.hash.digest(digested);
        if (dispose) {
            this.dispose();
        }
        return digested;
    }
    /**
     * @inheritdoc
     */
    reader({ dispose = true } = {}) {
        if (!this.hash) {
            throw new Error('Cannot call reader() after dipose() has been called');
        }
        const reader = this.getReader(this.hash.reader());
        if (dispose) {
            this.dispose();
        }
        return reader;
    }
    /**
     * @inheritdoc
     */
    dispose() {
        var _a;
        (_a = this.hash) === null || _a === void 0 ? void 0 : _a.free();
        this.hash = undefined;
    }
}
//# sourceMappingURL=hash-instance.js.map

/***/ }),

/***/ "./node_modules/blake3/esm/base/hash-reader.js":
/*!*****************************************************!*\
  !*** ./node_modules/blake3/esm/base/hash-reader.js ***!
  \*****************************************************/
/*! exports provided: maxHashBytes, BaseHashReader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "maxHashBytes", function() { return maxHashBytes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseHashReader", function() { return BaseHashReader; });
/**
 * The maximum number of bytes that can be read from the hash.
 *
 * Calculated out 2^64-1, since `Xn` syntax (for `Xn ** Yn`) requires TS
 * targeting esnext/es2020 which includes features that Node 10 doesn't
 * yet supported.
 */
const maxHashBytes = BigInt('18446744073709551615');
/**
 * Base hash reader implementation.
 */
class BaseHashReader {
    constructor(reader) {
        this.pos = BigInt(0);
        this.reader = reader;
    }
    get position() {
        return this.pos;
    }
    set position(value) {
        var _a;
        // to avoid footguns of people using numbers:
        if (typeof value !== 'bigint') {
            throw new Error(`Got a ${typeof value} set in to reader.position, expected a bigint`);
        }
        this.boundsCheck(value);
        this.pos = value;
        (_a = this.reader) === null || _a === void 0 ? void 0 : _a.set_position(value);
    }
    /**
     * @inheritdoc
     */
    readInto(target) {
        if (!this.reader) {
            throw new Error(`Cannot read from a hash after it was disposed`);
        }
        const next = this.pos + BigInt(target.length);
        this.boundsCheck(next);
        this.reader.fill(target);
        this.position = next;
    }
    /**
     * @inheritdoc
     */
    read(bytes) {
        const data = this.alloc(bytes);
        this.readInto(data);
        return data;
    }
    /**
     * @inheritdoc
     */
    dispose() {
        var _a, _b;
        (_b = (_a = this.reader) === null || _a === void 0 ? void 0 : _a.free) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.reader = undefined;
    }
    boundsCheck(position) {
        if (position > maxHashBytes) {
            throw new RangeError(`Cannot read past ${maxHashBytes} bytes in BLAKE3 hashes`);
        }
        if (position < BigInt(0)) {
            throw new RangeError(`Cannot read to a negative position`);
        }
    }
}
//# sourceMappingURL=hash-reader.js.map

/***/ }),

/***/ "./node_modules/blake3/esm/base/index.js":
/*!***********************************************!*\
  !*** ./node_modules/blake3/esm/base/index.js ***!
  \***********************************************/
/*! exports provided: defaultHashLength, inputToArray, maxHashBytes, BaseHashReader, BaseHash, using */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hash_fn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hash-fn.js */ "./node_modules/blake3/esm/base/hash-fn.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defaultHashLength", function() { return _hash_fn_js__WEBPACK_IMPORTED_MODULE_0__["defaultHashLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "inputToArray", function() { return _hash_fn_js__WEBPACK_IMPORTED_MODULE_0__["inputToArray"]; });

/* harmony import */ var _hash_reader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hash-reader.js */ "./node_modules/blake3/esm/base/hash-reader.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "maxHashBytes", function() { return _hash_reader_js__WEBPACK_IMPORTED_MODULE_1__["maxHashBytes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BaseHashReader", function() { return _hash_reader_js__WEBPACK_IMPORTED_MODULE_1__["BaseHashReader"]; });

/* harmony import */ var _hash_instance_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./hash-instance.js */ "./node_modules/blake3/esm/base/hash-instance.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BaseHash", function() { return _hash_instance_js__WEBPACK_IMPORTED_MODULE_2__["BaseHash"]; });

/* harmony import */ var _disposable_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./disposable.js */ "./node_modules/blake3/esm/base/disposable.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "using", function() { return _disposable_js__WEBPACK_IMPORTED_MODULE_3__["using"]; });





//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/blake3/esm/browser/encoding.js":
/*!*****************************************************!*\
  !*** ./node_modules/blake3/esm/browser/encoding.js ***!
  \*****************************************************/
/*! exports provided: mustGetEncoder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mustGetEncoder", function() { return mustGetEncoder; });
// A small collection of encodings for convenience of use in the browser.
const decoder = new TextDecoder();
const encoders = {
    // certainly not the fastest, but hashes are pretty small
    base64: data => btoa(String.fromCharCode(...data)),
    hex: data => {
        let out = '';
        for (const byte of data) {
            if (byte < 0x10) {
                out += '0';
            }
            out += byte.toString(16);
        }
        return out;
    },
    utf8: data => decoder.decode(data),
};
/**
 * @hidden
 */
const mustGetEncoder = (encoding) => {
    const encoder = encoders[encoding];
    if (!encoder) {
        throw new Error(`Unknown encoding ${encoding}`);
    }
    return encoder;
};
//# sourceMappingURL=encoding.js.map

/***/ }),

/***/ "./node_modules/blake3/esm/browser/hash-fn.js":
/*!****************************************************!*\
  !*** ./node_modules/blake3/esm/browser/hash-fn.js ***!
  \****************************************************/
/*! exports provided: normalizeInput, hash, deriveKey, keyedHash */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeInput", function() { return normalizeInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hash", function() { return hash; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deriveKey", function() { return deriveKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keyedHash", function() { return keyedHash; });
/* harmony import */ var _base_hash_fn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/hash-fn.js */ "./node_modules/blake3/esm/base/hash-fn.js");
/* harmony import */ var _hash_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hash.js */ "./node_modules/blake3/esm/browser/hash.js");
/* harmony import */ var _wasm_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./wasm.js */ "./node_modules/blake3/esm/browser/wasm.js");



const textEncoder = new TextEncoder();
/**
 * @hidden
 */
const normalizeInput = (input) => Object(_base_hash_fn_js__WEBPACK_IMPORTED_MODULE_0__["inputToArray"])(typeof input === 'string' ? textEncoder.encode(input) : input);
/**
 * Returns a blake3 hash of the input.
 */
function hash(input, { length = _base_hash_fn_js__WEBPACK_IMPORTED_MODULE_0__["defaultHashLength"] } = {}) {
    const result = new _hash_js__WEBPACK_IMPORTED_MODULE_1__["Hash"](length);
    Object(_wasm_js__WEBPACK_IMPORTED_MODULE_2__["getWasm"])().hash(normalizeInput(input), result);
    return result;
}
/**
 * Given cryptographic key material  and a context string, services a subkey of
 * any length. See {@link https://docs.rs/blake3/0.1.3/blake3/fn.derive_key.html}
 * for more information.
 */
function deriveKey(context, material, { length = _base_hash_fn_js__WEBPACK_IMPORTED_MODULE_0__["defaultHashLength"] } = {}) {
    const derive = Object(_wasm_js__WEBPACK_IMPORTED_MODULE_2__["getWasm"])().create_derive(context);
    derive.update(normalizeInput(material));
    const result = new _hash_js__WEBPACK_IMPORTED_MODULE_1__["Hash"](length);
    derive.digest(result);
    return result;
}
/**
 * The keyed hash function. See {@link https://docs.rs/blake3/0.1.3/blake3/fn.keyed_hash.html}.
 */
function keyedHash(key, input, { length = _base_hash_fn_js__WEBPACK_IMPORTED_MODULE_0__["defaultHashLength"] } = {}) {
    if (key.length !== 32) {
        throw new Error(`key provided to keyedHash must be 32 bytes, got ${key.length}`);
    }
    const derive = Object(_wasm_js__WEBPACK_IMPORTED_MODULE_2__["getWasm"])().create_keyed(key);
    derive.update(normalizeInput(input));
    const result = new _hash_js__WEBPACK_IMPORTED_MODULE_1__["Hash"](length);
    derive.digest(result);
    return result;
}
//# sourceMappingURL=hash-fn.js.map

/***/ }),

/***/ "./node_modules/blake3/esm/browser/hash-instance.js":
/*!**********************************************************!*\
  !*** ./node_modules/blake3/esm/browser/hash-instance.js ***!
  \**********************************************************/
/*! exports provided: BrowserHasher, createHash, createKeyed */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrowserHasher", function() { return BrowserHasher; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createHash", function() { return createHash; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createKeyed", function() { return createKeyed; });
/* harmony import */ var _base_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/index.js */ "./node_modules/blake3/esm/base/index.js");
/* harmony import */ var _hash_fn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hash-fn.js */ "./node_modules/blake3/esm/browser/hash-fn.js");
/* harmony import */ var _encoding_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./encoding.js */ "./node_modules/blake3/esm/browser/encoding.js");
/* harmony import */ var _hash_reader_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hash-reader.js */ "./node_modules/blake3/esm/browser/hash-reader.js");
/* harmony import */ var _hash_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./hash.js */ "./node_modules/blake3/esm/browser/hash.js");
/* harmony import */ var _wasm_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./wasm.js */ "./node_modules/blake3/esm/browser/wasm.js");






/**
 * @inheritdoc
 */
class BrowserHasher extends _base_index_js__WEBPACK_IMPORTED_MODULE_0__["BaseHash"] {
    /**
     * @inheritdoc
     * @override
     */
    update(data) {
        return super.update(Object(_hash_fn_js__WEBPACK_IMPORTED_MODULE_1__["normalizeInput"])(data));
    }
    digest(encoding, options) {
        let resolvedOpts;
        let resolvedEnc;
        if (encoding && typeof encoding === 'object') {
            resolvedOpts = encoding;
            resolvedEnc = undefined;
        }
        else {
            resolvedOpts = options;
            resolvedEnc = encoding;
        }
        const result = super.digest(resolvedOpts);
        return resolvedEnc ? Object(_encoding_js__WEBPACK_IMPORTED_MODULE_2__["mustGetEncoder"])(resolvedEnc)(result) : result;
    }
}
/**
 * A Node.js crypto-like createHash method.
 */
const createHash = () => new BrowserHasher(Object(_wasm_js__WEBPACK_IMPORTED_MODULE_5__["getWasm"])().create_hasher(), l => new _hash_js__WEBPACK_IMPORTED_MODULE_4__["Hash"](l), r => new _hash_reader_js__WEBPACK_IMPORTED_MODULE_3__["BrowserHashReader"](r));
/**
 * A Node.js crypto-like createHash method.
 */
const createKeyed = (key) => new BrowserHasher(Object(_wasm_js__WEBPACK_IMPORTED_MODULE_5__["getWasm"])().create_keyed(key), l => new _hash_js__WEBPACK_IMPORTED_MODULE_4__["Hash"](l), r => new _hash_reader_js__WEBPACK_IMPORTED_MODULE_3__["BrowserHashReader"](r));
//# sourceMappingURL=hash-instance.js.map

/***/ }),

/***/ "./node_modules/blake3/esm/browser/hash-reader.js":
/*!********************************************************!*\
  !*** ./node_modules/blake3/esm/browser/hash-reader.js ***!
  \********************************************************/
/*! exports provided: BrowserHashReader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrowserHashReader", function() { return BrowserHashReader; });
/* harmony import */ var _base_hash_reader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/hash-reader.js */ "./node_modules/blake3/esm/base/hash-reader.js");
/* harmony import */ var _hash_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hash.js */ "./node_modules/blake3/esm/browser/hash.js");
/* harmony import */ var _base_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../base/index.js */ "./node_modules/blake3/esm/base/index.js");



/**
 * A hash reader for WebAssembly targets.
 */
class BrowserHashReader extends _base_hash_reader_js__WEBPACK_IMPORTED_MODULE_0__["BaseHashReader"] {
    /**
     * Converts first 32 bytes of the hash to a string with the given encoding.
     */
    toString(encoding = 'hex') {
        return this.toArray().toString(encoding);
    }
    /**
     * Converts first 32 bytes of the hash to an array.
     */
    toArray() {
        this.position = BigInt(0);
        return this.read(_base_index_js__WEBPACK_IMPORTED_MODULE_2__["defaultHashLength"]);
    }
    alloc(bytes) {
        return new _hash_js__WEBPACK_IMPORTED_MODULE_1__["Hash"](bytes);
    }
}
//# sourceMappingURL=hash-reader.js.map

/***/ }),

/***/ "./node_modules/blake3/esm/browser/hash.js":
/*!*************************************************!*\
  !*** ./node_modules/blake3/esm/browser/hash.js ***!
  \*************************************************/
/*! exports provided: Hash */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Hash", function() { return Hash; });
/* harmony import */ var _encoding_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./encoding.js */ "./node_modules/blake3/esm/browser/encoding.js");

/**
 * Hash returned from functions in the browser.
 */
class Hash extends Uint8Array {
    /**
     * A constant-time comparison against the other hash/array.
     */
    equals(other) {
        if (!(other instanceof Uint8Array)) {
            return false;
        }
        if (other.length !== this.length) {
            return false;
        }
        let cmp = 0;
        for (let i = 0; i < this.length; i++) {
            cmp |= this[i] ^ other[i];
        }
        return cmp === 0;
    }
    toString(encoding = 'hex') {
        return Object(_encoding_js__WEBPACK_IMPORTED_MODULE_0__["mustGetEncoder"])(encoding)(this);
    }
}
//# sourceMappingURL=hash.js.map

/***/ }),

/***/ "./node_modules/blake3/esm/browser/index.js":
/*!**************************************************!*\
  !*** ./node_modules/blake3/esm/browser/index.js ***!
  \**************************************************/
/*! exports provided: hash, deriveKey, keyedHash, BrowserHasher, createHash, createKeyed, defaultHashLength, inputToArray, maxHashBytes, BaseHashReader, BaseHash, using */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hash_fn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hash-fn.js */ "./node_modules/blake3/esm/browser/hash-fn.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hash", function() { return _hash_fn_js__WEBPACK_IMPORTED_MODULE_0__["hash"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "deriveKey", function() { return _hash_fn_js__WEBPACK_IMPORTED_MODULE_0__["deriveKey"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "keyedHash", function() { return _hash_fn_js__WEBPACK_IMPORTED_MODULE_0__["keyedHash"]; });

/* harmony import */ var _hash_instance_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hash-instance.js */ "./node_modules/blake3/esm/browser/hash-instance.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserHasher", function() { return _hash_instance_js__WEBPACK_IMPORTED_MODULE_1__["BrowserHasher"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createHash", function() { return _hash_instance_js__WEBPACK_IMPORTED_MODULE_1__["createHash"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createKeyed", function() { return _hash_instance_js__WEBPACK_IMPORTED_MODULE_1__["createKeyed"]; });

/* harmony import */ var _base_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../base/index.js */ "./node_modules/blake3/esm/base/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defaultHashLength", function() { return _base_index_js__WEBPACK_IMPORTED_MODULE_2__["defaultHashLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "inputToArray", function() { return _base_index_js__WEBPACK_IMPORTED_MODULE_2__["inputToArray"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "maxHashBytes", function() { return _base_index_js__WEBPACK_IMPORTED_MODULE_2__["maxHashBytes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BaseHashReader", function() { return _base_index_js__WEBPACK_IMPORTED_MODULE_2__["BaseHashReader"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BaseHash", function() { return _base_index_js__WEBPACK_IMPORTED_MODULE_2__["BaseHash"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "using", function() { return _base_index_js__WEBPACK_IMPORTED_MODULE_2__["using"]; });




//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/blake3/esm/browser/wasm.js":
/*!*************************************************!*\
  !*** ./node_modules/blake3/esm/browser/wasm.js ***!
  \*************************************************/
/*! exports provided: getWasm, provideWasm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWasm", function() { return getWasm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "provideWasm", function() { return provideWasm; });
let wasm;
/**
 * Gets the webassembly module provided in provideWasm.
 */
const getWasm = () => {
    if (!wasm) {
        throw new Error('BLAKE3 webassembly not loaded. Please import the module via `blake3/browser` or `blake3/browser-async`');
    }
    return wasm;
};
/**
 * Sets the webassembly module used for the browser build. This indirection is
 * needed to provide compatibility between the "browser" and "browser-async" modes.
 */
const provideWasm = (w) => {
    wasm = w;
};
//# sourceMappingURL=wasm.js.map

/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmxha2UzL2Jyb3dzZXItYXN5bmMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JsYWtlMy9lc20vYmFzZS9kaXNwb3NhYmxlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ibGFrZTMvZXNtL2Jhc2UvaGFzaC1mbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmxha2UzL2VzbS9iYXNlL2hhc2gtaW5zdGFuY2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JsYWtlMy9lc20vYmFzZS9oYXNoLXJlYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmxha2UzL2VzbS9iYXNlL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ibGFrZTMvZXNtL2Jyb3dzZXIvZW5jb2RpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JsYWtlMy9lc20vYnJvd3Nlci9oYXNoLWZuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ibGFrZTMvZXNtL2Jyb3dzZXIvaGFzaC1pbnN0YW5jZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmxha2UzL2VzbS9icm93c2VyL2hhc2gtcmVhZGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ibGFrZTMvZXNtL2Jyb3dzZXIvaGFzaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmxha2UzL2VzbS9icm93c2VyL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ibGFrZTMvZXNtL2Jyb3dzZXIvd2FzbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQW9EO0FBQ0M7QUFDSjs7QUFFakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDZTtBQUNmO0FBQ0EsYUFBYSxr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QjtBQUNBO0FBQ0EsZ0M7Ozs7Ozs7Ozs7OztBQ3pCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUEwRDtBQUN2QjtBQUNGO0FBQ2pDLGlDOzs7Ozs7Ozs7Ozs7QUNIQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0EsZ0MiLCJmaWxlIjoiMS5leHRlbnNpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcm92aWRlV2FzbSB9IGZyb20gJy4vZXNtL2Jyb3dzZXIvd2FzbS5qcyc7XG5pbXBvcnQgKiBhcyB3YXNtIGZyb20gJy4vZGlzdC93YXNtL3dlYi9ibGFrZTNfanMuanMnO1xuaW1wb3J0ICogYXMgYmxha2UzIGZyb20gJy4vZXNtL2Jyb3dzZXIvaW5kZXguanMnO1xuXG5sZXQgY2FjaGVkO1xuXG4vKipcbiAqIE1hbnVhbGx5IGxvYWRzIHRoZSBXZWJBc3NlbWJseSBtb2R1bGUsIHJldHVybmluZyBhIHByb21pc2UgdGhhdCByZXNvbHZlc1xuICogdG8gdGhlIEJMQUtFMyBpbXBsZW1lbnRhdGlvbiBvbmNlIGF2YWlsYWJsZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZChtb2R1bGUpIHtcbiAgaWYgKCFjYWNoZWQpIHtcbiAgICBjYWNoZWQgPSB3YXNtLmRlZmF1bHQobW9kdWxlKS50aGVuKCgpID0+IHtcbiAgICAgIHByb3ZpZGVXYXNtKHdhc20pO1xuICAgICAgcmV0dXJuIGJsYWtlMztcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBjYWNoZWQ7XG59XG4iLCJjb25zdCBpc1Byb21pc2VMaWtlID0gKHZhbHVlKSA9PiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICEhdmFsdWUgJiYgJ3RoZW4nIGluIHZhbHVlO1xuLyoqXG4gKiBBIGhlbHBlciBmdW5jdGlvbiB0aGF0IGNhbGxzIGAuZGlzcG9zZSgpYCBvbiB0aGUge0BsaW5rIElEaXNwb3NhYmxlfSB3aGVuXG4gKiB0aGUgZ2l2ZW4gZnVuY3Rpb24gKG9yIHByb21pc2UgcmV0dXJuZWQgYnkgdGhlIGZ1bmN0aW9uKSByZXR1cm5zLlxuICovXG5leHBvcnQgY29uc3QgdXNpbmcgPSAoZGlzcG9zYWJsZSwgZm4pID0+IHtcbiAgICBsZXQgcmV0O1xuICAgIHRyeSB7XG4gICAgICAgIHJldCA9IGZuKGRpc3Bvc2FibGUpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICB9XG4gICAgaWYgKCFpc1Byb21pc2VMaWtlKHJldCkpIHtcbiAgICAgICAgZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIHJldHVybiByZXQudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgIGRpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSwgZXJyID0+IHtcbiAgICAgICAgZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gICAgICAgIHRocm93IGVycjtcbiAgICB9KTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kaXNwb3NhYmxlLmpzLm1hcCIsIi8qKlxuICogRGVmYXVsdCBoYXNoIGxlbmd0aCwgaW4gYnl0ZXMsIHVubGVzcyBvdGhlcndpc2Ugc3BlY2lmaWVkLlxuICovXG5leHBvcnQgY29uc3QgZGVmYXVsdEhhc2hMZW5ndGggPSAzMjtcbi8qKlxuICogQ29udmVydHMgdGhlIGlucHV0IHRvIGFuIFVpbnQ4QXJyYXkuXG4gKiBAaGlkZGVuXG4gKi9cbmV4cG9ydCBjb25zdCBpbnB1dFRvQXJyYXkgPSAoaW5wdXQpID0+IGlucHV0IGluc3RhbmNlb2YgVWludDhBcnJheSA/IGlucHV0IDogbmV3IFVpbnQ4QXJyYXkoaW5wdXQpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFzaC1mbi5qcy5tYXAiLCJpbXBvcnQgeyBpbnB1dFRvQXJyYXksIGRlZmF1bHRIYXNoTGVuZ3RoIH0gZnJvbSAnLi9oYXNoLWZuLmpzJztcbi8qKlxuICogQmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBoYXNoaW5nLlxuICovXG5leHBvcnQgY2xhc3MgQmFzZUhhc2gge1xuICAgIGNvbnN0cnVjdG9yKGltcGxlbWVudGF0aW9uLCBhbGxvYywgZ2V0UmVhZGVyKSB7XG4gICAgICAgIHRoaXMuYWxsb2MgPSBhbGxvYztcbiAgICAgICAgdGhpcy5nZXRSZWFkZXIgPSBnZXRSZWFkZXI7XG4gICAgICAgIHRoaXMuaGFzaCA9IGltcGxlbWVudGF0aW9uO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqL1xuICAgIHVwZGF0ZShkYXRhKSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjb250aW51ZSB1cGRhdGluZyBoYXNoaW5nIGFmdGVyIGRpc3Bvc2UoKSBoYXMgYmVlbiBjYWxsZWQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhhc2gudXBkYXRlKGlucHV0VG9BcnJheShkYXRhKSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqL1xuICAgIGRpZ2VzdCh7IGxlbmd0aCA9IGRlZmF1bHRIYXNoTGVuZ3RoLCBkaXNwb3NlID0gdHJ1ZSB9ID0ge30pIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc2gpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNhbGwgZGlnZXN0KCkgYWZ0ZXIgZGlwb3NlKCkgaGFzIGJlZW4gY2FsbGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGlnZXN0ZWQgPSB0aGlzLmFsbG9jKGxlbmd0aCk7XG4gICAgICAgIHRoaXMuaGFzaC5kaWdlc3QoZGlnZXN0ZWQpO1xuICAgICAgICBpZiAoZGlzcG9zZSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpZ2VzdGVkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqL1xuICAgIHJlYWRlcih7IGRpc3Bvc2UgPSB0cnVlIH0gPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzaCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsbCByZWFkZXIoKSBhZnRlciBkaXBvc2UoKSBoYXMgYmVlbiBjYWxsZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWFkZXIgPSB0aGlzLmdldFJlYWRlcih0aGlzLmhhc2gucmVhZGVyKCkpO1xuICAgICAgICBpZiAoZGlzcG9zZSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlYWRlcjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGluaGVyaXRkb2NcbiAgICAgKi9cbiAgICBkaXNwb3NlKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIChfYSA9IHRoaXMuaGFzaCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmZyZWUoKTtcbiAgICAgICAgdGhpcy5oYXNoID0gdW5kZWZpbmVkO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhhc2gtaW5zdGFuY2UuanMubWFwIiwiLyoqXG4gKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgYnl0ZXMgdGhhdCBjYW4gYmUgcmVhZCBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIENhbGN1bGF0ZWQgb3V0IDJeNjQtMSwgc2luY2UgYFhuYCBzeW50YXggKGZvciBgWG4gKiogWW5gKSByZXF1aXJlcyBUU1xuICogdGFyZ2V0aW5nIGVzbmV4dC9lczIwMjAgd2hpY2ggaW5jbHVkZXMgZmVhdHVyZXMgdGhhdCBOb2RlIDEwIGRvZXNuJ3RcbiAqIHlldCBzdXBwb3J0ZWQuXG4gKi9cbmV4cG9ydCBjb25zdCBtYXhIYXNoQnl0ZXMgPSBCaWdJbnQoJzE4NDQ2NzQ0MDczNzA5NTUxNjE1Jyk7XG4vKipcbiAqIEJhc2UgaGFzaCByZWFkZXIgaW1wbGVtZW50YXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlSGFzaFJlYWRlciB7XG4gICAgY29uc3RydWN0b3IocmVhZGVyKSB7XG4gICAgICAgIHRoaXMucG9zID0gQmlnSW50KDApO1xuICAgICAgICB0aGlzLnJlYWRlciA9IHJlYWRlcjtcbiAgICB9XG4gICAgZ2V0IHBvc2l0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3M7XG4gICAgfVxuICAgIHNldCBwb3NpdGlvbih2YWx1ZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIC8vIHRvIGF2b2lkIGZvb3RndW5zIG9mIHBlb3BsZSB1c2luZyBudW1iZXJzOlxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYmlnaW50Jykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBHb3QgYSAke3R5cGVvZiB2YWx1ZX0gc2V0IGluIHRvIHJlYWRlci5wb3NpdGlvbiwgZXhwZWN0ZWQgYSBiaWdpbnRgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvdW5kc0NoZWNrKHZhbHVlKTtcbiAgICAgICAgdGhpcy5wb3MgPSB2YWx1ZTtcbiAgICAgICAgKF9hID0gdGhpcy5yZWFkZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zZXRfcG9zaXRpb24odmFsdWUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqL1xuICAgIHJlYWRJbnRvKHRhcmdldCkge1xuICAgICAgICBpZiAoIXRoaXMucmVhZGVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZWFkIGZyb20gYSBoYXNoIGFmdGVyIGl0IHdhcyBkaXNwb3NlZGApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5leHQgPSB0aGlzLnBvcyArIEJpZ0ludCh0YXJnZXQubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5ib3VuZHNDaGVjayhuZXh0KTtcbiAgICAgICAgdGhpcy5yZWFkZXIuZmlsbCh0YXJnZXQpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV4dDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGluaGVyaXRkb2NcbiAgICAgKi9cbiAgICByZWFkKGJ5dGVzKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmFsbG9jKGJ5dGVzKTtcbiAgICAgICAgdGhpcy5yZWFkSW50byhkYXRhKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgICovXG4gICAgZGlzcG9zZSgpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgKF9iID0gKF9hID0gdGhpcy5yZWFkZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5mcmVlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSk7XG4gICAgICAgIHRoaXMucmVhZGVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBib3VuZHNDaGVjayhwb3NpdGlvbikge1xuICAgICAgICBpZiAocG9zaXRpb24gPiBtYXhIYXNoQnl0ZXMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKGBDYW5ub3QgcmVhZCBwYXN0ICR7bWF4SGFzaEJ5dGVzfSBieXRlcyBpbiBCTEFLRTMgaGFzaGVzYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvc2l0aW9uIDwgQmlnSW50KDApKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihgQ2Fubm90IHJlYWQgdG8gYSBuZWdhdGl2ZSBwb3NpdGlvbmApO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFzaC1yZWFkZXIuanMubWFwIiwiZXhwb3J0ICogZnJvbSAnLi9oYXNoLWZuLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vaGFzaC1yZWFkZXIuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9oYXNoLWluc3RhbmNlLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vZGlzcG9zYWJsZS5qcyc7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCIvLyBBIHNtYWxsIGNvbGxlY3Rpb24gb2YgZW5jb2RpbmdzIGZvciBjb252ZW5pZW5jZSBvZiB1c2UgaW4gdGhlIGJyb3dzZXIuXG5jb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCk7XG5jb25zdCBlbmNvZGVycyA9IHtcbiAgICAvLyBjZXJ0YWlubHkgbm90IHRoZSBmYXN0ZXN0LCBidXQgaGFzaGVzIGFyZSBwcmV0dHkgc21hbGxcbiAgICBiYXNlNjQ6IGRhdGEgPT4gYnRvYShTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLmRhdGEpKSxcbiAgICBoZXg6IGRhdGEgPT4ge1xuICAgICAgICBsZXQgb3V0ID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgYnl0ZSBvZiBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoYnl0ZSA8IDB4MTApIHtcbiAgICAgICAgICAgICAgICBvdXQgKz0gJzAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0ICs9IGJ5dGUudG9TdHJpbmcoMTYpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSxcbiAgICB1dGY4OiBkYXRhID0+IGRlY29kZXIuZGVjb2RlKGRhdGEpLFxufTtcbi8qKlxuICogQGhpZGRlblxuICovXG5leHBvcnQgY29uc3QgbXVzdEdldEVuY29kZXIgPSAoZW5jb2RpbmcpID0+IHtcbiAgICBjb25zdCBlbmNvZGVyID0gZW5jb2RlcnNbZW5jb2RpbmddO1xuICAgIGlmICghZW5jb2Rlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZW5jb2RpbmcgJHtlbmNvZGluZ31gKTtcbiAgICB9XG4gICAgcmV0dXJuIGVuY29kZXI7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZW5jb2RpbmcuanMubWFwIiwiaW1wb3J0IHsgaW5wdXRUb0FycmF5LCBkZWZhdWx0SGFzaExlbmd0aCB9IGZyb20gJy4uL2Jhc2UvaGFzaC1mbi5qcyc7XG5pbXBvcnQgeyBIYXNoIH0gZnJvbSAnLi9oYXNoLmpzJztcbmltcG9ydCB7IGdldFdhc20gfSBmcm9tICcuL3dhc20uanMnO1xuY29uc3QgdGV4dEVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcbi8qKlxuICogQGhpZGRlblxuICovXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplSW5wdXQgPSAoaW5wdXQpID0+IGlucHV0VG9BcnJheSh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnID8gdGV4dEVuY29kZXIuZW5jb2RlKGlucHV0KSA6IGlucHV0KTtcbi8qKlxuICogUmV0dXJucyBhIGJsYWtlMyBoYXNoIG9mIHRoZSBpbnB1dC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc2goaW5wdXQsIHsgbGVuZ3RoID0gZGVmYXVsdEhhc2hMZW5ndGggfSA9IHt9KSB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IEhhc2gobGVuZ3RoKTtcbiAgICBnZXRXYXNtKCkuaGFzaChub3JtYWxpemVJbnB1dChpbnB1dCksIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogR2l2ZW4gY3J5cHRvZ3JhcGhpYyBrZXkgbWF0ZXJpYWwgIGFuZCBhIGNvbnRleHQgc3RyaW5nLCBzZXJ2aWNlcyBhIHN1YmtleSBvZlxuICogYW55IGxlbmd0aC4gU2VlIHtAbGluayBodHRwczovL2RvY3MucnMvYmxha2UzLzAuMS4zL2JsYWtlMy9mbi5kZXJpdmVfa2V5Lmh0bWx9XG4gKiBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZUtleShjb250ZXh0LCBtYXRlcmlhbCwgeyBsZW5ndGggPSBkZWZhdWx0SGFzaExlbmd0aCB9ID0ge30pIHtcbiAgICBjb25zdCBkZXJpdmUgPSBnZXRXYXNtKCkuY3JlYXRlX2Rlcml2ZShjb250ZXh0KTtcbiAgICBkZXJpdmUudXBkYXRlKG5vcm1hbGl6ZUlucHV0KG1hdGVyaWFsKSk7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IEhhc2gobGVuZ3RoKTtcbiAgICBkZXJpdmUuZGlnZXN0KHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogVGhlIGtleWVkIGhhc2ggZnVuY3Rpb24uIFNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLnJzL2JsYWtlMy8wLjEuMy9ibGFrZTMvZm4ua2V5ZWRfaGFzaC5odG1sfS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGtleWVkSGFzaChrZXksIGlucHV0LCB7IGxlbmd0aCA9IGRlZmF1bHRIYXNoTGVuZ3RoIH0gPSB7fSkge1xuICAgIGlmIChrZXkubGVuZ3RoICE9PSAzMikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGtleSBwcm92aWRlZCB0byBrZXllZEhhc2ggbXVzdCBiZSAzMiBieXRlcywgZ290ICR7a2V5Lmxlbmd0aH1gKTtcbiAgICB9XG4gICAgY29uc3QgZGVyaXZlID0gZ2V0V2FzbSgpLmNyZWF0ZV9rZXllZChrZXkpO1xuICAgIGRlcml2ZS51cGRhdGUobm9ybWFsaXplSW5wdXQoaW5wdXQpKTtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgSGFzaChsZW5ndGgpO1xuICAgIGRlcml2ZS5kaWdlc3QocmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFzaC1mbi5qcy5tYXAiLCJpbXBvcnQgeyBCYXNlSGFzaCBhcyBCYXNlSGFzaGVyIH0gZnJvbSAnLi4vYmFzZS9pbmRleC5qcyc7XG5pbXBvcnQgeyBub3JtYWxpemVJbnB1dCB9IGZyb20gJy4vaGFzaC1mbi5qcyc7XG5pbXBvcnQgeyBtdXN0R2V0RW5jb2RlciB9IGZyb20gJy4vZW5jb2RpbmcuanMnO1xuaW1wb3J0IHsgQnJvd3Nlckhhc2hSZWFkZXIgfSBmcm9tICcuL2hhc2gtcmVhZGVyLmpzJztcbmltcG9ydCB7IEhhc2ggfSBmcm9tICcuL2hhc2guanMnO1xuaW1wb3J0IHsgZ2V0V2FzbSB9IGZyb20gJy4vd2FzbS5qcyc7XG4vKipcbiAqIEBpbmhlcml0ZG9jXG4gKi9cbmV4cG9ydCBjbGFzcyBCcm93c2VySGFzaGVyIGV4dGVuZHMgQmFzZUhhc2hlciB7XG4gICAgLyoqXG4gICAgICogQGluaGVyaXRkb2NcbiAgICAgKiBAb3ZlcnJpZGVcbiAgICAgKi9cbiAgICB1cGRhdGUoZGF0YSkge1xuICAgICAgICByZXR1cm4gc3VwZXIudXBkYXRlKG5vcm1hbGl6ZUlucHV0KGRhdGEpKTtcbiAgICB9XG4gICAgZGlnZXN0KGVuY29kaW5nLCBvcHRpb25zKSB7XG4gICAgICAgIGxldCByZXNvbHZlZE9wdHM7XG4gICAgICAgIGxldCByZXNvbHZlZEVuYztcbiAgICAgICAgaWYgKGVuY29kaW5nICYmIHR5cGVvZiBlbmNvZGluZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJlc29sdmVkT3B0cyA9IGVuY29kaW5nO1xuICAgICAgICAgICAgcmVzb2x2ZWRFbmMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlZE9wdHMgPSBvcHRpb25zO1xuICAgICAgICAgICAgcmVzb2x2ZWRFbmMgPSBlbmNvZGluZztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBzdXBlci5kaWdlc3QocmVzb2x2ZWRPcHRzKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVkRW5jID8gbXVzdEdldEVuY29kZXIocmVzb2x2ZWRFbmMpKHJlc3VsdCkgOiByZXN1bHQ7XG4gICAgfVxufVxuLyoqXG4gKiBBIE5vZGUuanMgY3J5cHRvLWxpa2UgY3JlYXRlSGFzaCBtZXRob2QuXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVIYXNoID0gKCkgPT4gbmV3IEJyb3dzZXJIYXNoZXIoZ2V0V2FzbSgpLmNyZWF0ZV9oYXNoZXIoKSwgbCA9PiBuZXcgSGFzaChsKSwgciA9PiBuZXcgQnJvd3Nlckhhc2hSZWFkZXIocikpO1xuLyoqXG4gKiBBIE5vZGUuanMgY3J5cHRvLWxpa2UgY3JlYXRlSGFzaCBtZXRob2QuXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVLZXllZCA9IChrZXkpID0+IG5ldyBCcm93c2VySGFzaGVyKGdldFdhc20oKS5jcmVhdGVfa2V5ZWQoa2V5KSwgbCA9PiBuZXcgSGFzaChsKSwgciA9PiBuZXcgQnJvd3Nlckhhc2hSZWFkZXIocikpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFzaC1pbnN0YW5jZS5qcy5tYXAiLCJpbXBvcnQgeyBCYXNlSGFzaFJlYWRlciB9IGZyb20gJy4uL2Jhc2UvaGFzaC1yZWFkZXIuanMnO1xuaW1wb3J0IHsgSGFzaCB9IGZyb20gJy4vaGFzaC5qcyc7XG5pbXBvcnQgeyBkZWZhdWx0SGFzaExlbmd0aCB9IGZyb20gJy4uL2Jhc2UvaW5kZXguanMnO1xuLyoqXG4gKiBBIGhhc2ggcmVhZGVyIGZvciBXZWJBc3NlbWJseSB0YXJnZXRzLlxuICovXG5leHBvcnQgY2xhc3MgQnJvd3Nlckhhc2hSZWFkZXIgZXh0ZW5kcyBCYXNlSGFzaFJlYWRlciB7XG4gICAgLyoqXG4gICAgICogQ29udmVydHMgZmlyc3QgMzIgYnl0ZXMgb2YgdGhlIGhhc2ggdG8gYSBzdHJpbmcgd2l0aCB0aGUgZ2l2ZW4gZW5jb2RpbmcuXG4gICAgICovXG4gICAgdG9TdHJpbmcoZW5jb2RpbmcgPSAnaGV4Jykge1xuICAgICAgICByZXR1cm4gdGhpcy50b0FycmF5KCkudG9TdHJpbmcoZW5jb2RpbmcpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBmaXJzdCAzMiBieXRlcyBvZiB0aGUgaGFzaCB0byBhbiBhcnJheS5cbiAgICAgKi9cbiAgICB0b0FycmF5KCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gQmlnSW50KDApO1xuICAgICAgICByZXR1cm4gdGhpcy5yZWFkKGRlZmF1bHRIYXNoTGVuZ3RoKTtcbiAgICB9XG4gICAgYWxsb2MoYnl0ZXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBIYXNoKGJ5dGVzKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oYXNoLXJlYWRlci5qcy5tYXAiLCJpbXBvcnQgeyBtdXN0R2V0RW5jb2RlciB9IGZyb20gJy4vZW5jb2RpbmcuanMnO1xuLyoqXG4gKiBIYXNoIHJldHVybmVkIGZyb20gZnVuY3Rpb25zIGluIHRoZSBicm93c2VyLlxuICovXG5leHBvcnQgY2xhc3MgSGFzaCBleHRlbmRzIFVpbnQ4QXJyYXkge1xuICAgIC8qKlxuICAgICAqIEEgY29uc3RhbnQtdGltZSBjb21wYXJpc29uIGFnYWluc3QgdGhlIG90aGVyIGhhc2gvYXJyYXkuXG4gICAgICovXG4gICAgZXF1YWxzKG90aGVyKSB7XG4gICAgICAgIGlmICghKG90aGVyIGluc3RhbmNlb2YgVWludDhBcnJheSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3RoZXIubGVuZ3RoICE9PSB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjbXAgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNtcCB8PSB0aGlzW2ldIF4gb3RoZXJbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNtcCA9PT0gMDtcbiAgICB9XG4gICAgdG9TdHJpbmcoZW5jb2RpbmcgPSAnaGV4Jykge1xuICAgICAgICByZXR1cm4gbXVzdEdldEVuY29kZXIoZW5jb2RpbmcpKHRoaXMpO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhhc2guanMubWFwIiwiZXhwb3J0IHsgaGFzaCwgZGVyaXZlS2V5LCBrZXllZEhhc2ggfSBmcm9tICcuL2hhc2gtZm4uanMnO1xuZXhwb3J0ICogZnJvbSAnLi9oYXNoLWluc3RhbmNlLmpzJztcbmV4cG9ydCAqIGZyb20gJy4uL2Jhc2UvaW5kZXguanMnO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwibGV0IHdhc207XG4vKipcbiAqIEdldHMgdGhlIHdlYmFzc2VtYmx5IG1vZHVsZSBwcm92aWRlZCBpbiBwcm92aWRlV2FzbS5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldFdhc20gPSAoKSA9PiB7XG4gICAgaWYgKCF3YXNtKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQkxBS0UzIHdlYmFzc2VtYmx5IG5vdCBsb2FkZWQuIFBsZWFzZSBpbXBvcnQgdGhlIG1vZHVsZSB2aWEgYGJsYWtlMy9icm93c2VyYCBvciBgYmxha2UzL2Jyb3dzZXItYXN5bmNgJyk7XG4gICAgfVxuICAgIHJldHVybiB3YXNtO1xufTtcbi8qKlxuICogU2V0cyB0aGUgd2ViYXNzZW1ibHkgbW9kdWxlIHVzZWQgZm9yIHRoZSBicm93c2VyIGJ1aWxkLiBUaGlzIGluZGlyZWN0aW9uIGlzXG4gKiBuZWVkZWQgdG8gcHJvdmlkZSBjb21wYXRpYmlsaXR5IGJldHdlZW4gdGhlIFwiYnJvd3NlclwiIGFuZCBcImJyb3dzZXItYXN5bmNcIiBtb2Rlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IHByb3ZpZGVXYXNtID0gKHcpID0+IHtcbiAgICB3YXNtID0gdztcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD13YXNtLmpzLm1hcCJdLCJzb3VyY2VSb290IjoiIn0=
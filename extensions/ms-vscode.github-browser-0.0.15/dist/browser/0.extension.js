self["webpackChunk"]([0],{

/***/ "./node_modules/blake3/browser.js":
/*!****************************************!*\
  !*** ./node_modules/blake3/browser.js ***!
  \****************************************/
/*! exports provided: hash, deriveKey, keyedHash, BrowserHasher, createHash, createKeyed, defaultHashLength, inputToArray, maxHashBytes, BaseHashReader, BaseHash, using */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _esm_browser_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esm/browser/wasm */ "./node_modules/blake3/esm/browser/wasm.js");
/* harmony import */ var _dist_wasm_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dist/wasm/browser */ "./node_modules/blake3/dist/wasm/browser/blake3_js.js");
/* harmony import */ var _esm_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./esm/browser */ "./node_modules/blake3/esm/browser/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hash", function() { return _esm_browser__WEBPACK_IMPORTED_MODULE_2__["hash"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "deriveKey", function() { return _esm_browser__WEBPACK_IMPORTED_MODULE_2__["deriveKey"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "keyedHash", function() { return _esm_browser__WEBPACK_IMPORTED_MODULE_2__["keyedHash"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserHasher", function() { return _esm_browser__WEBPACK_IMPORTED_MODULE_2__["BrowserHasher"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createHash", function() { return _esm_browser__WEBPACK_IMPORTED_MODULE_2__["createHash"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createKeyed", function() { return _esm_browser__WEBPACK_IMPORTED_MODULE_2__["createKeyed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defaultHashLength", function() { return _esm_browser__WEBPACK_IMPORTED_MODULE_2__["defaultHashLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "inputToArray", function() { return _esm_browser__WEBPACK_IMPORTED_MODULE_2__["inputToArray"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "maxHashBytes", function() { return _esm_browser__WEBPACK_IMPORTED_MODULE_2__["maxHashBytes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BaseHashReader", function() { return _esm_browser__WEBPACK_IMPORTED_MODULE_2__["BaseHashReader"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BaseHash", function() { return _esm_browser__WEBPACK_IMPORTED_MODULE_2__["BaseHash"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "using", function() { return _esm_browser__WEBPACK_IMPORTED_MODULE_2__["using"]; });




Object(_esm_browser_wasm__WEBPACK_IMPORTED_MODULE_0__["provideWasm"])(_dist_wasm_browser__WEBPACK_IMPORTED_MODULE_1__);




/***/ }),

/***/ "./node_modules/blake3/dist/wasm/browser/blake3_js.js":
/*!************************************************************!*\
  !*** ./node_modules/blake3/dist/wasm/browser/blake3_js.js ***!
  \************************************************************/
/*! exports provided: hash, create_hasher, create_keyed, create_derive, Blake3Hash, HashReader, __wbindgen_throw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hash", function() { return hash; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_hasher", function() { return create_hasher; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_keyed", function() { return create_keyed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_derive", function() { return create_derive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Blake3Hash", function() { return Blake3Hash; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HashReader", function() { return HashReader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__wbindgen_throw", function() { return __wbindgen_throw; });
/* harmony import */ var _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./blake3_js_bg.wasm */ "./node_modules/blake3/dist/wasm/browser/blake3_js_bg.wasm");


let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer) {
        cachegetUint8Memory0 = new Uint8Array(_blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {Uint8Array} data
* @param {Uint8Array} out
*/
function hash(data, out) {
    try {
        var ptr0 = passArray8ToWasm0(data, _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_malloc"]);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passArray8ToWasm0(out, _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_malloc"]);
        var len1 = WASM_VECTOR_LEN;
        _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["hash"](ptr0, len0, ptr1, len1);
    } finally {
        out.set(getUint8Memory0().subarray(ptr1 / 1, ptr1 / 1 + len1));
        _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_free"](ptr1, len1 * 1);
    }
}

/**
* @returns {Blake3Hash}
*/
function create_hasher() {
    var ret = _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["create_hasher"]();
    return Blake3Hash.__wrap(ret);
}

/**
* @param {Uint8Array} key_slice
* @returns {Blake3Hash}
*/
function create_keyed(key_slice) {
    var ptr0 = passArray8ToWasm0(key_slice, _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_malloc"]);
    var len0 = WASM_VECTOR_LEN;
    var ret = _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["create_keyed"](ptr0, len0);
    return Blake3Hash.__wrap(ret);
}

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
* @param {string} context
* @returns {Blake3Hash}
*/
function create_derive(context) {
    var ptr0 = passStringToWasm0(context, _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_malloc"], _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_realloc"]);
    var len0 = WASM_VECTOR_LEN;
    var ret = _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["create_derive"](ptr0, len0);
    return Blake3Hash.__wrap(ret);
}

const u32CvtShim = new Uint32Array(2);

const uint64CvtShim = new BigUint64Array(u32CvtShim.buffer);
/**
*/
class Blake3Hash {

    static __wrap(ptr) {
        const obj = Object.create(Blake3Hash.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_blake3hash_free"](ptr);
    }
    /**
    * @returns {HashReader}
    */
    reader() {
        var ret = _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["blake3hash_reader"](this.ptr);
        return HashReader.__wrap(ret);
    }
    /**
    * @param {Uint8Array} input_bytes
    */
    update(input_bytes) {
        var ptr0 = passArray8ToWasm0(input_bytes, _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_malloc"]);
        var len0 = WASM_VECTOR_LEN;
        _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["blake3hash_update"](this.ptr, ptr0, len0);
    }
    /**
    * @param {Uint8Array} out
    */
    digest(out) {
        try {
            var ptr0 = passArray8ToWasm0(out, _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_malloc"]);
            var len0 = WASM_VECTOR_LEN;
            _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["blake3hash_digest"](this.ptr, ptr0, len0);
        } finally {
            out.set(getUint8Memory0().subarray(ptr0 / 1, ptr0 / 1 + len0));
            _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_free"](ptr0, len0 * 1);
        }
    }
}
/**
*/
class HashReader {

    static __wrap(ptr) {
        const obj = Object.create(HashReader.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_hashreader_free"](ptr);
    }
    /**
    * @param {Uint8Array} bytes
    */
    fill(bytes) {
        try {
            var ptr0 = passArray8ToWasm0(bytes, _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_malloc"]);
            var len0 = WASM_VECTOR_LEN;
            _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["hashreader_fill"](this.ptr, ptr0, len0);
        } finally {
            bytes.set(getUint8Memory0().subarray(ptr0 / 1, ptr0 / 1 + len0));
            _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_free"](ptr0, len0 * 1);
        }
    }
    /**
    * @param {BigInt} position
    */
    set_position(position) {
        uint64CvtShim[0] = position;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        _blake3_js_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["hashreader_set_position"](this.ptr, low0, high0);
    }
}

const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};



/***/ }),

/***/ "./node_modules/blake3/dist/wasm/browser/blake3_js_bg.wasm":
/*!*****************************************************************!*\
  !*** ./node_modules/blake3/dist/wasm/browser/blake3_js_bg.wasm ***!
  \*****************************************************************/
/*! exports provided: memory, hash, create_hasher, create_keyed, create_derive, __wbg_blake3hash_free, blake3hash_reader, blake3hash_update, blake3hash_digest, __wbg_hashreader_free, hashreader_fill, hashreader_set_position, __wbindgen_malloc, __wbindgen_free, __wbindgen_realloc */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Instantiate WebAssembly module
var wasmExports = __webpack_require__.w[module.i];
__webpack_require__.r(exports);
// export exports from WebAssembly module
for(var name in wasmExports) if(name != "__webpack_init__") exports[name] = wasmExports[name];
// exec imports from WebAssembly module (for esm order)
/* harmony import */ var m0 = __webpack_require__(/*! ./blake3_js.js */ "./node_modules/blake3/dist/wasm/browser/blake3_js.js");


// exec wasm module
wasmExports["__webpack_init__"]()

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmxha2UzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JsYWtlMy9kaXN0L3dhc20vYnJvd3Nlci9ibGFrZTNfanMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JsYWtlMy9lc20vYmFzZS9kaXNwb3NhYmxlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ibGFrZTMvZXNtL2Jhc2UvaGFzaC1mbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmxha2UzL2VzbS9iYXNlL2hhc2gtaW5zdGFuY2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JsYWtlMy9lc20vYmFzZS9oYXNoLXJlYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmxha2UzL2VzbS9iYXNlL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ibGFrZTMvZXNtL2Jyb3dzZXIvZW5jb2RpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JsYWtlMy9lc20vYnJvd3Nlci9oYXNoLWZuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ibGFrZTMvZXNtL2Jyb3dzZXIvaGFzaC1pbnN0YW5jZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmxha2UzL2VzbS9icm93c2VyL2hhc2gtcmVhZGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ibGFrZTMvZXNtL2Jyb3dzZXIvaGFzaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmxha2UzL2VzbS9icm93c2VyL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ibGFrZTMvZXNtL2Jyb3dzZXIvd2FzbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7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QUNIQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0EsZ0MiLCJmaWxlIjoiMC5leHRlbnNpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcm92aWRlV2FzbSB9IGZyb20gJy4vZXNtL2Jyb3dzZXIvd2FzbSc7XG5pbXBvcnQgKiBhcyB3YXNtIGZyb20gJy4vZGlzdC93YXNtL2Jyb3dzZXInO1xuXG5wcm92aWRlV2FzbSh3YXNtKTtcblxuZXhwb3J0ICogZnJvbSAnLi9lc20vYnJvd3Nlcic7XG4iLCJpbXBvcnQgKiBhcyB3YXNtIGZyb20gJy4vYmxha2UzX2pzX2JnLndhc20nO1xuXG5sZXQgY2FjaGVkVGV4dERlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoJ3V0Zi04JywgeyBpZ25vcmVCT006IHRydWUsIGZhdGFsOiB0cnVlIH0pO1xuXG5jYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoKTtcblxubGV0IGNhY2hlZ2V0VWludDhNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldFVpbnQ4TWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVnZXRVaW50OE1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRVaW50OE1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICAgICAgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBuZXcgVWludDhBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVnZXRVaW50OE1lbW9yeTA7XG59XG5cbmZ1bmN0aW9uIGdldFN0cmluZ0Zyb21XYXNtMChwdHIsIGxlbikge1xuICAgIHJldHVybiBjYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBsZW4pKTtcbn1cblxubGV0IFdBU01fVkVDVE9SX0xFTiA9IDA7XG5cbmZ1bmN0aW9uIHBhc3NBcnJheThUb1dhc20wKGFyZywgbWFsbG9jKSB7XG4gICAgY29uc3QgcHRyID0gbWFsbG9jKGFyZy5sZW5ndGggKiAxKTtcbiAgICBnZXRVaW50OE1lbW9yeTAoKS5zZXQoYXJnLCBwdHIgLyAxKTtcbiAgICBXQVNNX1ZFQ1RPUl9MRU4gPSBhcmcubGVuZ3RoO1xuICAgIHJldHVybiBwdHI7XG59XG4vKipcbiogQHBhcmFtIHtVaW50OEFycmF5fSBkYXRhXG4qIEBwYXJhbSB7VWludDhBcnJheX0gb3V0XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc2goZGF0YSwgb3V0KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgdmFyIHB0cjAgPSBwYXNzQXJyYXk4VG9XYXNtMChkYXRhLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHZhciBwdHIxID0gcGFzc0FycmF5OFRvV2FzbTAob3V0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jKTtcbiAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIHdhc20uaGFzaChwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICBvdXQuc2V0KGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0cjEgLyAxLCBwdHIxIC8gMSArIGxlbjEpKTtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocHRyMSwgbGVuMSAqIDEpO1xuICAgIH1cbn1cblxuLyoqXG4qIEByZXR1cm5zIHtCbGFrZTNIYXNofVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVfaGFzaGVyKCkge1xuICAgIHZhciByZXQgPSB3YXNtLmNyZWF0ZV9oYXNoZXIoKTtcbiAgICByZXR1cm4gQmxha2UzSGFzaC5fX3dyYXAocmV0KTtcbn1cblxuLyoqXG4qIEBwYXJhbSB7VWludDhBcnJheX0ga2V5X3NsaWNlXG4qIEByZXR1cm5zIHtCbGFrZTNIYXNofVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVfa2V5ZWQoa2V5X3NsaWNlKSB7XG4gICAgdmFyIHB0cjAgPSBwYXNzQXJyYXk4VG9XYXNtMChrZXlfc2xpY2UsIHdhc20uX193YmluZGdlbl9tYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmNyZWF0ZV9rZXllZChwdHIwLCBsZW4wKTtcbiAgICByZXR1cm4gQmxha2UzSGFzaC5fX3dyYXAocmV0KTtcbn1cblxubGV0IGNhY2hlZFRleHRFbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCd1dGYtOCcpO1xuXG5jb25zdCBlbmNvZGVTdHJpbmcgPSAodHlwZW9mIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8gPT09ICdmdW5jdGlvbidcbiAgICA/IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlSW50byhhcmcsIHZpZXcpO1xufVxuICAgIDogZnVuY3Rpb24gKGFyZywgdmlldykge1xuICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgIHZpZXcuc2V0KGJ1Zik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZDogYXJnLmxlbmd0aCxcbiAgICAgICAgd3JpdHRlbjogYnVmLmxlbmd0aFxuICAgIH07XG59KTtcblxuZnVuY3Rpb24gcGFzc1N0cmluZ1RvV2FzbTAoYXJnLCBtYWxsb2MsIHJlYWxsb2MpIHtcblxuICAgIGlmIChyZWFsbG9jID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgYnVmID0gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlKGFyZyk7XG4gICAgICAgIGNvbnN0IHB0ciA9IG1hbGxvYyhidWYubGVuZ3RoKTtcbiAgICAgICAgZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBidWYubGVuZ3RoKS5zZXQoYnVmKTtcbiAgICAgICAgV0FTTV9WRUNUT1JfTEVOID0gYnVmLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHB0cjtcbiAgICB9XG5cbiAgICBsZXQgbGVuID0gYXJnLmxlbmd0aDtcbiAgICBsZXQgcHRyID0gbWFsbG9jKGxlbik7XG5cbiAgICBjb25zdCBtZW0gPSBnZXRVaW50OE1lbW9yeTAoKTtcblxuICAgIGxldCBvZmZzZXQgPSAwO1xuXG4gICAgZm9yICg7IG9mZnNldCA8IGxlbjsgb2Zmc2V0KyspIHtcbiAgICAgICAgY29uc3QgY29kZSA9IGFyZy5jaGFyQ29kZUF0KG9mZnNldCk7XG4gICAgICAgIGlmIChjb2RlID4gMHg3RikgYnJlYWs7XG4gICAgICAgIG1lbVtwdHIgKyBvZmZzZXRdID0gY29kZTtcbiAgICB9XG5cbiAgICBpZiAob2Zmc2V0ICE9PSBsZW4pIHtcbiAgICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICAgICAgYXJnID0gYXJnLnNsaWNlKG9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgICAgcHRyID0gcmVhbGxvYyhwdHIsIGxlbiwgbGVuID0gb2Zmc2V0ICsgYXJnLmxlbmd0aCAqIDMpO1xuICAgICAgICBjb25zdCB2aWV3ID0gZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyICsgb2Zmc2V0LCBwdHIgKyBsZW4pO1xuICAgICAgICBjb25zdCByZXQgPSBlbmNvZGVTdHJpbmcoYXJnLCB2aWV3KTtcblxuICAgICAgICBvZmZzZXQgKz0gcmV0LndyaXR0ZW47XG4gICAgfVxuXG4gICAgV0FTTV9WRUNUT1JfTEVOID0gb2Zmc2V0O1xuICAgIHJldHVybiBwdHI7XG59XG4vKipcbiogQHBhcmFtIHtzdHJpbmd9IGNvbnRleHRcbiogQHJldHVybnMge0JsYWtlM0hhc2h9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZV9kZXJpdmUoY29udGV4dCkge1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoY29udGV4dCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciByZXQgPSB3YXNtLmNyZWF0ZV9kZXJpdmUocHRyMCwgbGVuMCk7XG4gICAgcmV0dXJuIEJsYWtlM0hhc2guX193cmFwKHJldCk7XG59XG5cbmNvbnN0IHUzMkN2dFNoaW0gPSBuZXcgVWludDMyQXJyYXkoMik7XG5cbmNvbnN0IHVpbnQ2NEN2dFNoaW0gPSBuZXcgQmlnVWludDY0QXJyYXkodTMyQ3Z0U2hpbS5idWZmZXIpO1xuLyoqXG4qL1xuZXhwb3J0IGNsYXNzIEJsYWtlM0hhc2gge1xuXG4gICAgc3RhdGljIF9fd3JhcChwdHIpIHtcbiAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShCbGFrZTNIYXNoLnByb3RvdHlwZSk7XG4gICAgICAgIG9iai5wdHIgPSBwdHI7XG5cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBmcmVlKCkge1xuICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjtcbiAgICAgICAgdGhpcy5wdHIgPSAwO1xuXG4gICAgICAgIHdhc20uX193YmdfYmxha2UzaGFzaF9mcmVlKHB0cik7XG4gICAgfVxuICAgIC8qKlxuICAgICogQHJldHVybnMge0hhc2hSZWFkZXJ9XG4gICAgKi9cbiAgICByZWFkZXIoKSB7XG4gICAgICAgIHZhciByZXQgPSB3YXNtLmJsYWtlM2hhc2hfcmVhZGVyKHRoaXMucHRyKTtcbiAgICAgICAgcmV0dXJuIEhhc2hSZWFkZXIuX193cmFwKHJldCk7XG4gICAgfVxuICAgIC8qKlxuICAgICogQHBhcmFtIHtVaW50OEFycmF5fSBpbnB1dF9ieXRlc1xuICAgICovXG4gICAgdXBkYXRlKGlucHV0X2J5dGVzKSB7XG4gICAgICAgIHZhciBwdHIwID0gcGFzc0FycmF5OFRvV2FzbTAoaW5wdXRfYnl0ZXMsIHdhc20uX193YmluZGdlbl9tYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgd2FzbS5ibGFrZTNoYXNoX3VwZGF0ZSh0aGlzLnB0ciwgcHRyMCwgbGVuMCk7XG4gICAgfVxuICAgIC8qKlxuICAgICogQHBhcmFtIHtVaW50OEFycmF5fSBvdXRcbiAgICAqL1xuICAgIGRpZ2VzdChvdXQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBwdHIwID0gcGFzc0FycmF5OFRvV2FzbTAob3V0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jKTtcbiAgICAgICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICAgICAgd2FzbS5ibGFrZTNoYXNoX2RpZ2VzdCh0aGlzLnB0ciwgcHRyMCwgbGVuMCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBvdXQuc2V0KGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0cjAgLyAxLCBwdHIwIC8gMSArIGxlbjApKTtcbiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHB0cjAsIGxlbjAgKiAxKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuKi9cbmV4cG9ydCBjbGFzcyBIYXNoUmVhZGVyIHtcblxuICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoSGFzaFJlYWRlci5wcm90b3R5cGUpO1xuICAgICAgICBvYmoucHRyID0gcHRyO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgZnJlZSgpIHtcbiAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7XG4gICAgICAgIHRoaXMucHRyID0gMDtcblxuICAgICAgICB3YXNtLl9fd2JnX2hhc2hyZWFkZXJfZnJlZShwdHIpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEBwYXJhbSB7VWludDhBcnJheX0gYnl0ZXNcbiAgICAqL1xuICAgIGZpbGwoYnl0ZXMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBwdHIwID0gcGFzc0FycmF5OFRvV2FzbTAoYnl0ZXMsIHdhc20uX193YmluZGdlbl9tYWxsb2MpO1xuICAgICAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgICAgICB3YXNtLmhhc2hyZWFkZXJfZmlsbCh0aGlzLnB0ciwgcHRyMCwgbGVuMCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBieXRlcy5zZXQoZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyMCAvIDEsIHB0cjAgLyAxICsgbGVuMCkpO1xuICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocHRyMCwgbGVuMCAqIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICogQHBhcmFtIHtCaWdJbnR9IHBvc2l0aW9uXG4gICAgKi9cbiAgICBzZXRfcG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICAgICAgdWludDY0Q3Z0U2hpbVswXSA9IHBvc2l0aW9uO1xuICAgICAgICBjb25zdCBsb3cwID0gdTMyQ3Z0U2hpbVswXTtcbiAgICAgICAgY29uc3QgaGlnaDAgPSB1MzJDdnRTaGltWzFdO1xuICAgICAgICB3YXNtLmhhc2hyZWFkZXJfc2V0X3Bvc2l0aW9uKHRoaXMucHRyLCBsb3cwLCBoaWdoMCk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgX193YmluZGdlbl90aHJvdyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpKTtcbn07XG5cbiIsImNvbnN0IGlzUHJvbWlzZUxpa2UgPSAodmFsdWUpID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgISF2YWx1ZSAmJiAndGhlbicgaW4gdmFsdWU7XG4vKipcbiAqIEEgaGVscGVyIGZ1bmN0aW9uIHRoYXQgY2FsbHMgYC5kaXNwb3NlKClgIG9uIHRoZSB7QGxpbmsgSURpc3Bvc2FibGV9IHdoZW5cbiAqIHRoZSBnaXZlbiBmdW5jdGlvbiAob3IgcHJvbWlzZSByZXR1cm5lZCBieSB0aGUgZnVuY3Rpb24pIHJldHVybnMuXG4gKi9cbmV4cG9ydCBjb25zdCB1c2luZyA9IChkaXNwb3NhYmxlLCBmbikgPT4ge1xuICAgIGxldCByZXQ7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0ID0gZm4oZGlzcG9zYWJsZSk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGRpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgICAgICB0aHJvdyBlO1xuICAgIH1cbiAgICBpZiAoIWlzUHJvbWlzZUxpa2UocmV0KSkge1xuICAgICAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgcmV0dXJuIHJldC50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LCBlcnIgPT4ge1xuICAgICAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgIH0pO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRpc3Bvc2FibGUuanMubWFwIiwiLyoqXG4gKiBEZWZhdWx0IGhhc2ggbGVuZ3RoLCBpbiBieXRlcywgdW5sZXNzIG90aGVyd2lzZSBzcGVjaWZpZWQuXG4gKi9cbmV4cG9ydCBjb25zdCBkZWZhdWx0SGFzaExlbmd0aCA9IDMyO1xuLyoqXG4gKiBDb252ZXJ0cyB0aGUgaW5wdXQgdG8gYW4gVWludDhBcnJheS5cbiAqIEBoaWRkZW5cbiAqL1xuZXhwb3J0IGNvbnN0IGlucHV0VG9BcnJheSA9IChpbnB1dCkgPT4gaW5wdXQgaW5zdGFuY2VvZiBVaW50OEFycmF5ID8gaW5wdXQgOiBuZXcgVWludDhBcnJheShpbnB1dCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oYXNoLWZuLmpzLm1hcCIsImltcG9ydCB7IGlucHV0VG9BcnJheSwgZGVmYXVsdEhhc2hMZW5ndGggfSBmcm9tICcuL2hhc2gtZm4uanMnO1xuLyoqXG4gKiBCYXNlIGltcGxlbWVudGF0aW9uIG9mIGhhc2hpbmcuXG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlSGFzaCB7XG4gICAgY29uc3RydWN0b3IoaW1wbGVtZW50YXRpb24sIGFsbG9jLCBnZXRSZWFkZXIpIHtcbiAgICAgICAgdGhpcy5hbGxvYyA9IGFsbG9jO1xuICAgICAgICB0aGlzLmdldFJlYWRlciA9IGdldFJlYWRlcjtcbiAgICAgICAgdGhpcy5oYXNoID0gaW1wbGVtZW50YXRpb247XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgICovXG4gICAgdXBkYXRlKGRhdGEpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc2gpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNvbnRpbnVlIHVwZGF0aW5nIGhhc2hpbmcgYWZ0ZXIgZGlzcG9zZSgpIGhhcyBiZWVuIGNhbGxlZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGFzaC51cGRhdGUoaW5wdXRUb0FycmF5KGRhdGEpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgICovXG4gICAgZGlnZXN0KHsgbGVuZ3RoID0gZGVmYXVsdEhhc2hMZW5ndGgsIGRpc3Bvc2UgPSB0cnVlIH0gPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzaCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsbCBkaWdlc3QoKSBhZnRlciBkaXBvc2UoKSBoYXMgYmVlbiBjYWxsZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkaWdlc3RlZCA9IHRoaXMuYWxsb2MobGVuZ3RoKTtcbiAgICAgICAgdGhpcy5oYXNoLmRpZ2VzdChkaWdlc3RlZCk7XG4gICAgICAgIGlmIChkaXNwb3NlKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3Bvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlnZXN0ZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgICovXG4gICAgcmVhZGVyKHsgZGlzcG9zZSA9IHRydWUgfSA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjYWxsIHJlYWRlcigpIGFmdGVyIGRpcG9zZSgpIGhhcyBiZWVuIGNhbGxlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IHRoaXMuZ2V0UmVhZGVyKHRoaXMuaGFzaC5yZWFkZXIoKSk7XG4gICAgICAgIGlmIChkaXNwb3NlKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3Bvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVhZGVyO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqL1xuICAgIGRpc3Bvc2UoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgKF9hID0gdGhpcy5oYXNoKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZnJlZSgpO1xuICAgICAgICB0aGlzLmhhc2ggPSB1bmRlZmluZWQ7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFzaC1pbnN0YW5jZS5qcy5tYXAiLCIvKipcbiAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiBieXRlcyB0aGF0IGNhbiBiZSByZWFkIGZyb20gdGhlIGhhc2guXG4gKlxuICogQ2FsY3VsYXRlZCBvdXQgMl42NC0xLCBzaW5jZSBgWG5gIHN5bnRheCAoZm9yIGBYbiAqKiBZbmApIHJlcXVpcmVzIFRTXG4gKiB0YXJnZXRpbmcgZXNuZXh0L2VzMjAyMCB3aGljaCBpbmNsdWRlcyBmZWF0dXJlcyB0aGF0IE5vZGUgMTAgZG9lc24ndFxuICogeWV0IHN1cHBvcnRlZC5cbiAqL1xuZXhwb3J0IGNvbnN0IG1heEhhc2hCeXRlcyA9IEJpZ0ludCgnMTg0NDY3NDQwNzM3MDk1NTE2MTUnKTtcbi8qKlxuICogQmFzZSBoYXNoIHJlYWRlciBpbXBsZW1lbnRhdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIEJhc2VIYXNoUmVhZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihyZWFkZXIpIHtcbiAgICAgICAgdGhpcy5wb3MgPSBCaWdJbnQoMCk7XG4gICAgICAgIHRoaXMucmVhZGVyID0gcmVhZGVyO1xuICAgIH1cbiAgICBnZXQgcG9zaXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcztcbiAgICB9XG4gICAgc2V0IHBvc2l0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgLy8gdG8gYXZvaWQgZm9vdGd1bnMgb2YgcGVvcGxlIHVzaW5nIG51bWJlcnM6XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdiaWdpbnQnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEdvdCBhICR7dHlwZW9mIHZhbHVlfSBzZXQgaW4gdG8gcmVhZGVyLnBvc2l0aW9uLCBleHBlY3RlZCBhIGJpZ2ludGApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm91bmRzQ2hlY2sodmFsdWUpO1xuICAgICAgICB0aGlzLnBvcyA9IHZhbHVlO1xuICAgICAgICAoX2EgPSB0aGlzLnJlYWRlcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNldF9wb3NpdGlvbih2YWx1ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgICovXG4gICAgcmVhZEludG8odGFyZ2V0KSB7XG4gICAgICAgIGlmICghdGhpcy5yZWFkZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHJlYWQgZnJvbSBhIGhhc2ggYWZ0ZXIgaXQgd2FzIGRpc3Bvc2VkYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV4dCA9IHRoaXMucG9zICsgQmlnSW50KHRhcmdldC5sZW5ndGgpO1xuICAgICAgICB0aGlzLmJvdW5kc0NoZWNrKG5leHQpO1xuICAgICAgICB0aGlzLnJlYWRlci5maWxsKHRhcmdldCk7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXh0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqL1xuICAgIHJlYWQoYnl0ZXMpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYWxsb2MoYnl0ZXMpO1xuICAgICAgICB0aGlzLnJlYWRJbnRvKGRhdGEpO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGluaGVyaXRkb2NcbiAgICAgKi9cbiAgICBkaXNwb3NlKCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAoX2IgPSAoX2EgPSB0aGlzLnJlYWRlcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmZyZWUpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKF9hKTtcbiAgICAgICAgdGhpcy5yZWFkZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGJvdW5kc0NoZWNrKHBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChwb3NpdGlvbiA+IG1heEhhc2hCeXRlcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYENhbm5vdCByZWFkIHBhc3QgJHttYXhIYXNoQnl0ZXN9IGJ5dGVzIGluIEJMQUtFMyBoYXNoZXNgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zaXRpb24gPCBCaWdJbnQoMCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKGBDYW5ub3QgcmVhZCB0byBhIG5lZ2F0aXZlIHBvc2l0aW9uYCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oYXNoLXJlYWRlci5qcy5tYXAiLCJleHBvcnQgKiBmcm9tICcuL2hhc2gtZm4uanMnO1xuZXhwb3J0ICogZnJvbSAnLi9oYXNoLXJlYWRlci5qcyc7XG5leHBvcnQgKiBmcm9tICcuL2hhc2gtaW5zdGFuY2UuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9kaXNwb3NhYmxlLmpzJztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIi8vIEEgc21hbGwgY29sbGVjdGlvbiBvZiBlbmNvZGluZ3MgZm9yIGNvbnZlbmllbmNlIG9mIHVzZSBpbiB0aGUgYnJvd3Nlci5cbmNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKTtcbmNvbnN0IGVuY29kZXJzID0ge1xuICAgIC8vIGNlcnRhaW5seSBub3QgdGhlIGZhc3Rlc3QsIGJ1dCBoYXNoZXMgYXJlIHByZXR0eSBzbWFsbFxuICAgIGJhc2U2NDogZGF0YSA9PiBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uZGF0YSkpLFxuICAgIGhleDogZGF0YSA9PiB7XG4gICAgICAgIGxldCBvdXQgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBieXRlIG9mIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChieXRlIDwgMHgxMCkge1xuICAgICAgICAgICAgICAgIG91dCArPSAnMCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQgKz0gYnl0ZS50b1N0cmluZygxNik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9LFxuICAgIHV0Zjg6IGRhdGEgPT4gZGVjb2Rlci5kZWNvZGUoZGF0YSksXG59O1xuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbmV4cG9ydCBjb25zdCBtdXN0R2V0RW5jb2RlciA9IChlbmNvZGluZykgPT4ge1xuICAgIGNvbnN0IGVuY29kZXIgPSBlbmNvZGVyc1tlbmNvZGluZ107XG4gICAgaWYgKCFlbmNvZGVyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBlbmNvZGluZyAke2VuY29kaW5nfWApO1xuICAgIH1cbiAgICByZXR1cm4gZW5jb2Rlcjtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lbmNvZGluZy5qcy5tYXAiLCJpbXBvcnQgeyBpbnB1dFRvQXJyYXksIGRlZmF1bHRIYXNoTGVuZ3RoIH0gZnJvbSAnLi4vYmFzZS9oYXNoLWZuLmpzJztcbmltcG9ydCB7IEhhc2ggfSBmcm9tICcuL2hhc2guanMnO1xuaW1wb3J0IHsgZ2V0V2FzbSB9IGZyb20gJy4vd2FzbS5qcyc7XG5jb25zdCB0ZXh0RW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigpO1xuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbmV4cG9ydCBjb25zdCBub3JtYWxpemVJbnB1dCA9IChpbnB1dCkgPT4gaW5wdXRUb0FycmF5KHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgPyB0ZXh0RW5jb2Rlci5lbmNvZGUoaW5wdXQpIDogaW5wdXQpO1xuLyoqXG4gKiBSZXR1cm5zIGEgYmxha2UzIGhhc2ggb2YgdGhlIGlucHV0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzaChpbnB1dCwgeyBsZW5ndGggPSBkZWZhdWx0SGFzaExlbmd0aCB9ID0ge30pIHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgSGFzaChsZW5ndGgpO1xuICAgIGdldFdhc20oKS5oYXNoKG5vcm1hbGl6ZUlucHV0KGlucHV0KSwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBHaXZlbiBjcnlwdG9ncmFwaGljIGtleSBtYXRlcmlhbCAgYW5kIGEgY29udGV4dCBzdHJpbmcsIHNlcnZpY2VzIGEgc3Via2V5IG9mXG4gKiBhbnkgbGVuZ3RoLiBTZWUge0BsaW5rIGh0dHBzOi8vZG9jcy5ycy9ibGFrZTMvMC4xLjMvYmxha2UzL2ZuLmRlcml2ZV9rZXkuaHRtbH1cbiAqIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlS2V5KGNvbnRleHQsIG1hdGVyaWFsLCB7IGxlbmd0aCA9IGRlZmF1bHRIYXNoTGVuZ3RoIH0gPSB7fSkge1xuICAgIGNvbnN0IGRlcml2ZSA9IGdldFdhc20oKS5jcmVhdGVfZGVyaXZlKGNvbnRleHQpO1xuICAgIGRlcml2ZS51cGRhdGUobm9ybWFsaXplSW5wdXQobWF0ZXJpYWwpKTtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgSGFzaChsZW5ndGgpO1xuICAgIGRlcml2ZS5kaWdlc3QocmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBUaGUga2V5ZWQgaGFzaCBmdW5jdGlvbi4gU2VlIHtAbGluayBodHRwczovL2RvY3MucnMvYmxha2UzLzAuMS4zL2JsYWtlMy9mbi5rZXllZF9oYXNoLmh0bWx9LlxuICovXG5leHBvcnQgZnVuY3Rpb24ga2V5ZWRIYXNoKGtleSwgaW5wdXQsIHsgbGVuZ3RoID0gZGVmYXVsdEhhc2hMZW5ndGggfSA9IHt9KSB7XG4gICAgaWYgKGtleS5sZW5ndGggIT09IDMyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihga2V5IHByb3ZpZGVkIHRvIGtleWVkSGFzaCBtdXN0IGJlIDMyIGJ5dGVzLCBnb3QgJHtrZXkubGVuZ3RofWApO1xuICAgIH1cbiAgICBjb25zdCBkZXJpdmUgPSBnZXRXYXNtKCkuY3JlYXRlX2tleWVkKGtleSk7XG4gICAgZGVyaXZlLnVwZGF0ZShub3JtYWxpemVJbnB1dChpbnB1dCkpO1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBIYXNoKGxlbmd0aCk7XG4gICAgZGVyaXZlLmRpZ2VzdChyZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oYXNoLWZuLmpzLm1hcCIsImltcG9ydCB7IEJhc2VIYXNoIGFzIEJhc2VIYXNoZXIgfSBmcm9tICcuLi9iYXNlL2luZGV4LmpzJztcbmltcG9ydCB7IG5vcm1hbGl6ZUlucHV0IH0gZnJvbSAnLi9oYXNoLWZuLmpzJztcbmltcG9ydCB7IG11c3RHZXRFbmNvZGVyIH0gZnJvbSAnLi9lbmNvZGluZy5qcyc7XG5pbXBvcnQgeyBCcm93c2VySGFzaFJlYWRlciB9IGZyb20gJy4vaGFzaC1yZWFkZXIuanMnO1xuaW1wb3J0IHsgSGFzaCB9IGZyb20gJy4vaGFzaC5qcyc7XG5pbXBvcnQgeyBnZXRXYXNtIH0gZnJvbSAnLi93YXNtLmpzJztcbi8qKlxuICogQGluaGVyaXRkb2NcbiAqL1xuZXhwb3J0IGNsYXNzIEJyb3dzZXJIYXNoZXIgZXh0ZW5kcyBCYXNlSGFzaGVyIHtcbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqIEBvdmVycmlkZVxuICAgICAqL1xuICAgIHVwZGF0ZShkYXRhKSB7XG4gICAgICAgIHJldHVybiBzdXBlci51cGRhdGUobm9ybWFsaXplSW5wdXQoZGF0YSkpO1xuICAgIH1cbiAgICBkaWdlc3QoZW5jb2RpbmcsIG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IHJlc29sdmVkT3B0cztcbiAgICAgICAgbGV0IHJlc29sdmVkRW5jO1xuICAgICAgICBpZiAoZW5jb2RpbmcgJiYgdHlwZW9mIGVuY29kaW5nID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmVzb2x2ZWRPcHRzID0gZW5jb2Rpbmc7XG4gICAgICAgICAgICByZXNvbHZlZEVuYyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmVkT3B0cyA9IG9wdGlvbnM7XG4gICAgICAgICAgICByZXNvbHZlZEVuYyA9IGVuY29kaW5nO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLmRpZ2VzdChyZXNvbHZlZE9wdHMpO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZWRFbmMgPyBtdXN0R2V0RW5jb2RlcihyZXNvbHZlZEVuYykocmVzdWx0KSA6IHJlc3VsdDtcbiAgICB9XG59XG4vKipcbiAqIEEgTm9kZS5qcyBjcnlwdG8tbGlrZSBjcmVhdGVIYXNoIG1ldGhvZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUhhc2ggPSAoKSA9PiBuZXcgQnJvd3Nlckhhc2hlcihnZXRXYXNtKCkuY3JlYXRlX2hhc2hlcigpLCBsID0+IG5ldyBIYXNoKGwpLCByID0+IG5ldyBCcm93c2VySGFzaFJlYWRlcihyKSk7XG4vKipcbiAqIEEgTm9kZS5qcyBjcnlwdG8tbGlrZSBjcmVhdGVIYXNoIG1ldGhvZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUtleWVkID0gKGtleSkgPT4gbmV3IEJyb3dzZXJIYXNoZXIoZ2V0V2FzbSgpLmNyZWF0ZV9rZXllZChrZXkpLCBsID0+IG5ldyBIYXNoKGwpLCByID0+IG5ldyBCcm93c2VySGFzaFJlYWRlcihyKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oYXNoLWluc3RhbmNlLmpzLm1hcCIsImltcG9ydCB7IEJhc2VIYXNoUmVhZGVyIH0gZnJvbSAnLi4vYmFzZS9oYXNoLXJlYWRlci5qcyc7XG5pbXBvcnQgeyBIYXNoIH0gZnJvbSAnLi9oYXNoLmpzJztcbmltcG9ydCB7IGRlZmF1bHRIYXNoTGVuZ3RoIH0gZnJvbSAnLi4vYmFzZS9pbmRleC5qcyc7XG4vKipcbiAqIEEgaGFzaCByZWFkZXIgZm9yIFdlYkFzc2VtYmx5IHRhcmdldHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBCcm93c2VySGFzaFJlYWRlciBleHRlbmRzIEJhc2VIYXNoUmVhZGVyIHtcbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBmaXJzdCAzMiBieXRlcyBvZiB0aGUgaGFzaCB0byBhIHN0cmluZyB3aXRoIHRoZSBnaXZlbiBlbmNvZGluZy5cbiAgICAgKi9cbiAgICB0b1N0cmluZyhlbmNvZGluZyA9ICdoZXgnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvQXJyYXkoKS50b1N0cmluZyhlbmNvZGluZyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGZpcnN0IDMyIGJ5dGVzIG9mIHRoZSBoYXNoIHRvIGFuIGFycmF5LlxuICAgICAqL1xuICAgIHRvQXJyYXkoKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBCaWdJbnQoMCk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlYWQoZGVmYXVsdEhhc2hMZW5ndGgpO1xuICAgIH1cbiAgICBhbGxvYyhieXRlcykge1xuICAgICAgICByZXR1cm4gbmV3IEhhc2goYnl0ZXMpO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhhc2gtcmVhZGVyLmpzLm1hcCIsImltcG9ydCB7IG11c3RHZXRFbmNvZGVyIH0gZnJvbSAnLi9lbmNvZGluZy5qcyc7XG4vKipcbiAqIEhhc2ggcmV0dXJuZWQgZnJvbSBmdW5jdGlvbnMgaW4gdGhlIGJyb3dzZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBIYXNoIGV4dGVuZHMgVWludDhBcnJheSB7XG4gICAgLyoqXG4gICAgICogQSBjb25zdGFudC10aW1lIGNvbXBhcmlzb24gYWdhaW5zdCB0aGUgb3RoZXIgaGFzaC9hcnJheS5cbiAgICAgKi9cbiAgICBlcXVhbHMob3RoZXIpIHtcbiAgICAgICAgaWYgKCEob3RoZXIgaW5zdGFuY2VvZiBVaW50OEFycmF5KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvdGhlci5sZW5ndGggIT09IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNtcCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY21wIHw9IHRoaXNbaV0gXiBvdGhlcltpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY21wID09PSAwO1xuICAgIH1cbiAgICB0b1N0cmluZyhlbmNvZGluZyA9ICdoZXgnKSB7XG4gICAgICAgIHJldHVybiBtdXN0R2V0RW5jb2RlcihlbmNvZGluZykodGhpcyk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFzaC5qcy5tYXAiLCJleHBvcnQgeyBoYXNoLCBkZXJpdmVLZXksIGtleWVkSGFzaCB9IGZyb20gJy4vaGFzaC1mbi5qcyc7XG5leHBvcnQgKiBmcm9tICcuL2hhc2gtaW5zdGFuY2UuanMnO1xuZXhwb3J0ICogZnJvbSAnLi4vYmFzZS9pbmRleC5qcyc7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJsZXQgd2FzbTtcbi8qKlxuICogR2V0cyB0aGUgd2ViYXNzZW1ibHkgbW9kdWxlIHByb3ZpZGVkIGluIHByb3ZpZGVXYXNtLlxuICovXG5leHBvcnQgY29uc3QgZ2V0V2FzbSA9ICgpID0+IHtcbiAgICBpZiAoIXdhc20pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCTEFLRTMgd2ViYXNzZW1ibHkgbm90IGxvYWRlZC4gUGxlYXNlIGltcG9ydCB0aGUgbW9kdWxlIHZpYSBgYmxha2UzL2Jyb3dzZXJgIG9yIGBibGFrZTMvYnJvd3Nlci1hc3luY2AnKTtcbiAgICB9XG4gICAgcmV0dXJuIHdhc207XG59O1xuLyoqXG4gKiBTZXRzIHRoZSB3ZWJhc3NlbWJseSBtb2R1bGUgdXNlZCBmb3IgdGhlIGJyb3dzZXIgYnVpbGQuIFRoaXMgaW5kaXJlY3Rpb24gaXNcbiAqIG5lZWRlZCB0byBwcm92aWRlIGNvbXBhdGliaWxpdHkgYmV0d2VlbiB0aGUgXCJicm93c2VyXCIgYW5kIFwiYnJvd3Nlci1hc3luY1wiIG1vZGVzLlxuICovXG5leHBvcnQgY29uc3QgcHJvdmlkZVdhc20gPSAodykgPT4ge1xuICAgIHdhc20gPSB3O1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdhc20uanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==
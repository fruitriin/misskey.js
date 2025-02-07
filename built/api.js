"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIClient = exports.isAPIError = void 0;
const MK_API_ERROR = Symbol();
function isAPIError(reason) {
    return reason[MK_API_ERROR] === true;
}
exports.isAPIError = isAPIError;
class APIClient {
    constructor(opts) {
        this.origin = opts.origin;
        this.credential = opts.credential;
        this.fetch = opts.fetch || ((...args) => fetch(...args));
    }
    request(endpoint, params = {}, credential) {
        const promise = new Promise((resolve, reject) => {
            this.fetch(`${this.origin}/api/${endpoint}`, {
                method: 'POST',
                body: JSON.stringify({
                    ...params,
                    i: credential !== undefined ? credential : this.credential,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'omit',
                cache: 'no-cache',
            }).then(async (res) => {
                try {
                    const body = res.status === 204 ? null : await res.json();
                    if (res.status === 200) {
                        resolve(body);
                    }
                    else if (res.status === 204) {
                        resolve(null);
                    }
                    else {
                        reject({
                            [MK_API_ERROR]: true,
                            ...body.error,
                        });
                    }
                }
                catch (e) {
                    reject({
                        message: e,
                    });
                }
            }).catch(reject);
        });
        return promise;
    }
}
exports.APIClient = APIClient;
//# sourceMappingURL=api.js.map
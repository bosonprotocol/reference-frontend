import { AbstractConnector } from "@web3-react/abstract-connector";
import invariant from "tiny-invariant";

class RequestError extends Error {
  constructor(message, code, data) {
    super(message);
    this.code = code;
    this.data = data;
  }
}
class MiniRpcProvider {
  constructor(chainId, url, batchWaitTimeMs) {
    this.isMetaMask = false;
    this.nextId = 1;
    this.batchTimeoutId = null;
    this.batch = [];
    this.clearBatch = async () => {
      var _a, _b, _c;
      console.debug("Clearing batch", this.batch);
      const batch = this.batch;
      this.batch = [];
      this.batchTimeoutId = null;
      let response;
      try {
        response = await fetch(this.url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(batch.map((item) => item.request)),
        });
      } catch (error) {
        batch.forEach(({ reject }) =>
          reject(new Error("Failed to send batch call"))
        );
        return;
      }
      if (!response.ok) {
        batch.forEach(({ reject }) =>
          reject(
            new RequestError(
              `${response.status}: ${response.statusText}`,
              -32000
            )
          )
        );
        return;
      }
      let json;
      try {
        json = await response.json();
      } catch (error) {
        batch.forEach(({ reject }) =>
          reject(new Error("Failed to parse JSON response"))
        );
        return;
      }
      const byKey = batch.reduce((memo, current) => {
        memo[current.request.id] = current;
        return memo;
      }, {});
      for (const result of json) {
        const {
          resolve,
          reject,
          request: { method },
        } = byKey[result.id];
        if (resolve && reject) {
          if ("error" in result) {
            reject(
              new RequestError(
                (_a =
                  result === null || result === void 0
                    ? void 0
                    : result.error) === null || _a === void 0
                  ? void 0
                  : _a.message,
                (_b =
                  result === null || result === void 0
                    ? void 0
                    : result.error) === null || _b === void 0
                  ? void 0
                  : _b.code,
                (_c =
                  result === null || result === void 0
                    ? void 0
                    : result.error) === null || _c === void 0
                  ? void 0
                  : _c.data
              )
            );
          } else if ("result" in result) {
            resolve(result.result);
          } else {
            reject(
              new RequestError(
                `Received unexpected JSON-RPC response to ${method} request.`,
                -32000,
                result
              )
            );
          }
        }
      }
    };
    this.sendAsync = (request, callback) => {
      this.request(request.method, request.params)
        .then((result) =>
          callback(null, { jsonrpc: "2.0", id: request.id, result })
        )
        .catch((error) => callback(error, null));
    };
    this.request = async (method, params) => {
      var _a;
      if (typeof method !== "string") {
        return this.request(method.method, method.params);
      }
      if (method === "eth_chainId") {
        return `0x${this.chainId.toString(16)}`;
      }
      const promise = new Promise((resolve, reject) => {
        this.batch.push({
          request: {
            jsonrpc: "2.0",
            id: this.nextId++,
            method,
            params,
          },
          resolve,
          reject,
        });
      });
      this.batchTimeoutId =
        (_a = this.batchTimeoutId) !== null && _a !== void 0
          ? _a
          : setTimeout(this.clearBatch, this.batchWaitTimeMs);
      return promise;
    };
    this.chainId = chainId;
    this.url = url;
    const parsed = new URL(url);
    this.host = parsed.host;
    this.path = parsed.pathname;
    // how long to wait to batch calls
    this.batchWaitTimeMs =
      batchWaitTimeMs !== null && batchWaitTimeMs !== void 0
        ? batchWaitTimeMs
        : 50;
  }
}
export class NetworkConnector extends AbstractConnector {
  constructor({ urls, defaultChainId }) {
    invariant(
      defaultChainId || Object.keys(urls).length === 1,
      "defaultChainId is a required argument with >1 url"
    );
    super({ supportedChainIds: Object.keys(urls).map((k) => Number(k)) });
    this.currentChainId = defaultChainId || Number(Object.keys(urls)[0]);
    this.providers = Object.keys(urls).reduce((accumulator, chainId) => {
      accumulator[Number(chainId)] = new MiniRpcProvider(
        Number(chainId),
        urls[Number(chainId)]
      );
      return accumulator;
    }, {});
  }
  async activate() {
    return {
      provider: this.providers[this.currentChainId],
      chainId: this.currentChainId,
      account: null,
    };
  }
  async getProvider() {
    return this.providers[this.currentChainId];
  }
  async getChainId() {
    return this.currentChainId;
  }
  async getAccount() {
    return null;
  }
  deactivate() {
    return;
  }
}

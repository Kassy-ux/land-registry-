"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = __importDefault(require("@pinata/sdk"));
let _pinata = null;
function getPinata() {
    if (_pinata)
        return _pinata;
    const key = process.env.PINATA_API_KEY;
    const secret = process.env.PINATA_SECRET_KEY;
    if (!key || !secret) {
        throw new Error('Pinata credentials are not configured. Set PINATA_API_KEY and PINATA_SECRET_KEY.');
    }
    _pinata = new sdk_1.default(key, secret);
    return _pinata;
}
const pinata = new Proxy({}, {
    get(_target, prop) {
        const client = getPinata();
        const value = client[prop];
        return typeof value === 'function' ? value.bind(client) : value;
    },
});
exports.default = pinata;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = __importDefault(require("@pinata/sdk"));
const pinata = new sdk_1.default(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);
exports.default = pinata;

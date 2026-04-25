"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationContract = exports.ownershipContract = exports.landRegistryContract = void 0;
const ethers_1 = require("ethers");
const LandRegistry_json_1 = __importDefault(require("../abis/LandRegistry.json"));
const Ownership_json_1 = __importDefault(require("../abis/Ownership.json"));
const Verification_json_1 = __importDefault(require("../abis/Verification.json"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const provider = new ethers_1.ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY || '', provider);
exports.landRegistryContract = new ethers_1.ethers.Contract(process.env.LAND_REGISTRY_ADDRESS || '', LandRegistry_json_1.default.abi, wallet);
exports.ownershipContract = new ethers_1.ethers.Contract(process.env.OWNERSHIP_ADDRESS || '', Ownership_json_1.default.abi, wallet);
exports.verificationContract = new ethers_1.ethers.Contract(process.env.VERIFICATION_ADDRESS || '', Verification_json_1.default.abi, provider);

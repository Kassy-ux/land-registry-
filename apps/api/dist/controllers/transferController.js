"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateTransfer = initiateTransfer;
exports.confirmTransfer = confirmTransfer;
const prismaService_1 = __importDefault(require("../services/prismaService"));
const blockchainService_1 = require("../services/blockchainService");
async function initiateTransfer(req, res) {
    try {
        const { landId, buyerId, buyerAddress } = req.body;
        const transaction = await prismaService_1.default.transaction.create({
            data: {
                landId: Number(landId),
                sellerId: req.userId,
                buyerId: Number(buyerId),
                status: 'pending'
            }
        });
        const tx = await blockchainService_1.ownershipContract.initiateTransfer(landId, buyerAddress);
        await tx.wait();
        res.status(201).json(transaction);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function confirmTransfer(req, res) {
    try {
        const { landId, transactionId } = req.body;
        const tx = await blockchainService_1.ownershipContract.confirmTransfer(landId);
        const receipt = await tx.wait();
        await prismaService_1.default.transaction.update({
            where: { id: Number(transactionId) },
            data: { status: 'completed' }
        });
        await prismaService_1.default.ownership.create({
            data: { userId: req.userId, landId: Number(landId) }
        });
        await prismaService_1.default.blockchainRecord.create({
            data: {
                landId: Number(landId),
                transactionId: Number(transactionId),
                blockHash: receipt.blockHash
            }
        });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParcels = getParcels;
exports.getParcel = getParcel;
exports.submitParcel = submitParcel;
exports.approveParcel = approveParcel;
exports.rejectParcel = rejectParcel;
const prismaService_1 = __importDefault(require("../services/prismaService"));
const blockchainService_1 = require("../services/blockchainService");
async function getParcels(req, res) {
    try {
        const parcels = await prismaService_1.default.landParcel.findMany({
            include: { ownerships: { include: { user: true } } }
        });
        res.json(parcels);
    }
    catch {
        res.status(500).json({ error: 'Server error' });
    }
}
async function getParcel(req, res) {
    try {
        const parcel = await prismaService_1.default.landParcel.findUnique({
            where: { id: Number(req.params.id) },
            include: { ownerships: { include: { user: true } }, documents: true, blockchainRecords: true }
        });
        if (!parcel) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        res.json(parcel);
    }
    catch {
        res.status(500).json({ error: 'Server error' });
    }
}
async function submitParcel(req, res) {
    try {
        const { titleNumber, location, size, ipfsHash, ownerAddress } = req.body;
        const parcel = await prismaService_1.default.landParcel.create({
            data: { titleNumber, location, size: Number(size), status: 'pending' }
        });
        await prismaService_1.default.ownership.create({
            data: { userId: req.userId, landId: parcel.id }
        });
        try {
            const tx = await blockchainService_1.landRegistryContract.submitParcel(titleNumber, location, ipfsHash || '');
            const receipt = await tx.wait();
            await prismaService_1.default.blockchainRecord.create({
                data: { landId: parcel.id, blockHash: receipt.blockHash }
            });
        }
        catch (blockchainErr) {
            console.error('Blockchain submit failed:', blockchainErr);
        }
        res.status(201).json(parcel);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function approveParcel(req, res) {
    try {
        const parcelId = Number(req.params.id);
        const parcel = await prismaService_1.default.landParcel.findUnique({ where: { id: parcelId } });
        if (!parcel) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        if (parcel.status !== 'pending') {
            res.status(400).json({ error: 'Parcel is not pending' });
            return;
        }
        await prismaService_1.default.landParcel.update({
            where: { id: parcelId },
            data: { status: 'approved' }
        });
        try {
            const tx = await blockchainService_1.landRegistryContract.approveParcel(parcelId);
            await tx.wait();
        }
        catch (blockchainErr) {
            console.error('Blockchain approve failed:', blockchainErr);
        }
        res.json({ success: true, message: 'Parcel approved' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function rejectParcel(req, res) {
    try {
        const parcelId = Number(req.params.id);
        const parcel = await prismaService_1.default.landParcel.findUnique({ where: { id: parcelId } });
        if (!parcel) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        if (parcel.status !== 'pending') {
            res.status(400).json({ error: 'Parcel is not pending' });
            return;
        }
        await prismaService_1.default.landParcel.update({
            where: { id: parcelId },
            data: { status: 'rejected' }
        });
        try {
            const tx = await blockchainService_1.landRegistryContract.rejectParcel(parcelId);
            await tx.wait();
        }
        catch (blockchainErr) {
            console.error('Blockchain reject failed:', blockchainErr);
        }
        res.json({ success: true, message: 'Parcel rejected' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

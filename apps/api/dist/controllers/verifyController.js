"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyParcel = verifyParcel;
const blockchainService_1 = require("../services/blockchainService");
const prismaService_1 = __importDefault(require("../services/prismaService"));
async function verifyParcel(req, res) {
    try {
        const query = String(req.params.parcelId);
        const isNumeric = !isNaN(Number(query)) && query.trim() !== '';
        const dbParcel = await prismaService_1.default.landParcel.findFirst({
            where: isNumeric ? { id: Number(query) } : { titleNumber: query },
        });
        if (!dbParcel) {
            res.status(404).json({ error: 'Parcel not found' });
            return;
        }
        const documents = await prismaService_1.default.document.findMany({ where: { landId: dbParcel.id } });
        let onChain = null;
        try {
            const [parcelDetails, history] = await Promise.all([
                blockchainService_1.verificationContract.getParcelDetails(dbParcel.id),
                blockchainService_1.verificationContract.getTransferHistory(dbParcel.id)
            ]);
            onChain = {
                titleNumber: parcelDetails.parcel.titleNumber,
                location: parcelDetails.parcel.location,
                ipfsHash: parcelDetails.parcel.ipfsHash,
                status: Number(parcelDetails.parcel.status),
                currentOwner: parcelDetails.owner,
                transferHistory: history
            };
        }
        catch {
            // Not on chain yet
        }
        res.json({
            parcelId: dbParcel.id,
            titleNumber: dbParcel.titleNumber,
            location: dbParcel.location,
            size: dbParcel.size,
            status: dbParcel.status,
            onChain,
            documents
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

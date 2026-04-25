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
        const parcelId = Number(req.params.parcelId);
        const [parcelDetails, history] = await Promise.all([
            blockchainService_1.verificationContract.getParcelDetails(parcelId),
            blockchainService_1.verificationContract.getTransferHistory(parcelId)
        ]);
        const dbParcel = await prismaService_1.default.landParcel.findUnique({
            where: { id: parcelId },
            include: { documents: true }
        });
        res.json({
            parcelId,
            onChain: {
                titleNumber: parcelDetails.parcel.titleNumber,
                location: parcelDetails.parcel.location,
                ipfsHash: parcelDetails.parcel.ipfsHash,
                status: Number(parcelDetails.parcel.status),
                currentOwner: parcelDetails.owner,
            },
            transferHistory: history,
            documents: dbParcel?.documents || []
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

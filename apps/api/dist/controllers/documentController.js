"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = uploadDocument;
const prismaService_1 = __importDefault(require("../services/prismaService"));
const pinataService_1 = __importDefault(require("../services/pinataService"));
async function uploadDocument(req, res) {
    try {
        const { landId, documentType } = req.body;
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        const result = await pinataService_1.default.pinFileToIPFS(require('stream').Readable.from(req.file.buffer), { pinataMetadata: { name: req.file.originalname } });
        const doc = await prismaService_1.default.document.create({
            data: {
                landId: Number(landId),
                fileHash: result.IpfsHash,
                documentType
            }
        });
        res.status(201).json({ ...doc, ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}` });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transferController_1 = require("../controllers/transferController");
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
router.post('/initiate', requireAuth_1.requireAuth, transferController_1.initiateTransfer);
router.post('/confirm', requireAuth_1.requireAuth, transferController_1.confirmTransfer);
exports.default = router;

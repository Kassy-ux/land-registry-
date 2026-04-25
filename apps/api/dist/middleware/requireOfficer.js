"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOfficer = requireOfficer;
const requireAuth_1 = require("./requireAuth");
function requireOfficer(req, res, next) {
    (0, requireAuth_1.requireAuth)(req, res, () => {
        if (req.userRole !== 'officer') {
            res.status(403).json({ error: 'Officer access required' });
            return;
        }
        next();
    });
}

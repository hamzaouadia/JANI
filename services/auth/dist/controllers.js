"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.me = me;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("./userModel");
const config_1 = require("./config");
function generateToken(user) {
    return jsonwebtoken_1.default.sign({ id: user._id.toString(), email: user.email, role: user.role, identifier: user.identifier }, config_1.JWT_SECRET, { expiresIn: "15m" });
}
async function signup(req, res) {
    const { email, password, role, identifier, profile } = req.body;
    if (!(0, userModel_1.isUserRole)(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }
    const normalizedEmail = (0, userModel_1.normalizeString)(email)?.toLowerCase();
    const normalizedPassword = (0, userModel_1.normalizeString)(password);
    if (!normalizedEmail || !normalizedPassword) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    let identifierValue;
    let normalizedProfile;
    try {
        identifierValue = (0, userModel_1.resolveIdentifier)(role, identifier, profile);
        normalizedProfile = (0, userModel_1.normalizeProfile)(role, profile);
        normalizedProfile[userModel_1.ROLE_REQUIREMENTS[role].identifier.name] = identifierValue;
    }
    catch (validationError) {
        return res.status(400).json({
            error: validationError instanceof Error ? validationError.message : "Invalid profile information"
        });
    }
    try {
        const existingEmail = await userModel_1.User.findOne({ email: normalizedEmail });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const existingIdentifier = await userModel_1.User.findOne({ role, identifier: identifierValue });
        if (existingIdentifier) {
            return res
                .status(400)
                .json({ error: `${userModel_1.ROLE_REQUIREMENTS[role].identifier.label} already registered` });
        }
        const passwordHash = await bcrypt_1.default.hash(normalizedPassword, 10);
        const user = await userModel_1.User.create({
            email: normalizedEmail,
            passwordHash,
            role,
            identifier: identifierValue,
            profile: normalizedProfile
        });
        const token = generateToken(user);
        res.json({
            accessToken: token,
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                identifier: user.identifier,
                profile: (0, userModel_1.serializeProfile)(user.profile)
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}
async function login(req, res) {
    const { role, identifier, password } = req.body;
    if (!(0, userModel_1.isUserRole)(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }
    const normalizedPassword = (0, userModel_1.normalizeString)(password);
    if (!normalizedPassword) {
        return res.status(400).json({ error: "Password is required" });
    }
    let identifierValue;
    try {
        identifierValue = (0, userModel_1.resolveIdentifier)(role, identifier, null);
    }
    catch (validationError) {
        return res.status(400).json({
            error: validationError instanceof Error ? validationError.message : "Identifier is required"
        });
    }
    try {
        const user = await userModel_1.User.findOne({ role, identifier: identifierValue });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const valid = await bcrypt_1.default.compare(normalizedPassword, user.passwordHash);
        if (!valid)
            return res.status(401).json({ error: "Invalid credentials" });
        const token = generateToken(user);
        res.json({
            accessToken: token,
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                identifier: user.identifier,
                profile: (0, userModel_1.serializeProfile)(user.profile)
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}
async function me(req, res) {
    const user = req.user; // set by authMiddleware
    if (!user)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const dbUser = await userModel_1.User.findById(user.id).select("-passwordHash");
        if (!dbUser)
            return res.status(404).json({ error: "User not found" });
        res.json({
            email: dbUser.email,
            id: dbUser._id,
            role: dbUser.role,
            identifier: dbUser.identifier,
            profile: (0, userModel_1.serializeProfile)(dbUser.profile)
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

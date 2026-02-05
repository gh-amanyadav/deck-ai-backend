const clashRoyaleService = require('../services/clashRoyaleService');
const { preparePlayerTag } = require('../utils/playerTagValidator');
const { BadRequestError } = require('../utils/errorHandler');

/**
 * Player Controller
 * Handles player-related endpoints
 */

/**
 * Get player information
 * @route GET /api/players/:playerTag
 */
async function getPlayerInfo(req, res, next) {
    try {
        const { playerTag } = req.params;

        // Validate and encode player tag
        const tagResult = preparePlayerTag(playerTag);

        if (!tagResult.success) {
            throw new BadRequestError(tagResult.error);
        }

        // Fetch player data from Clash Royale API
        const playerData = await clashRoyaleService.getPlayerInfo(tagResult.encodedTag);

        // Return successful response
        res.status(200).json({
            success: true,
            data: playerData,
            meta: {
                requestedTag: tagResult.originalTag,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
}

/**
 * Get player battle log
 * @route GET /api/players/:playerTag/battlelog
 */
async function getPlayerBattlelog(req, res, next) {
    try {
        const { playerTag } = req.params;

        // Validate and encode player tag
        const tagResult = preparePlayerTag(playerTag);

        if (!tagResult.success) {
            throw new BadRequestError(tagResult.error);
        }

        // Fetch battle log from Clash Royale API
        const battlelogData = await clashRoyaleService.getPlayerBattlelog(tagResult.encodedTag);

        // Return successful response
        res.status(200).json({
            success: true,
            data: battlelogData,
            meta: {
                requestedTag: tagResult.originalTag,
                battleCount: Array.isArray(battlelogData) ? battlelogData.length : 0,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
}

module.exports = {
    getPlayerInfo,
    getPlayerBattlelog
};

const express = require('express');
const playerController = require('../controllers/playerController');

const router = express.Router();

/**
 * Player Routes
 * Base path: /api/players
 */

/**
 * @route   GET /api/players/:playerTag
 * @desc    Get player information
 * @access  Public
 * @example /api/players/%232ABC or /api/players/2ABC
 */
router.get('/:playerTag', playerController.getPlayerInfo);

/**
 * @route   GET /api/players/:playerTag/battlelog
 * @desc    Get player battle log
 * @access  Public
 * @example /api/players/%232ABC/battlelog or /api/players/2ABC/battlelog
 */
router.get('/:playerTag/battlelog', playerController.getPlayerBattlelog);

module.exports = router;

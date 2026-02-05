/**
 * Validates and processes player tags for Clash Royale API
 */

/**
 * Validate player tag format
 * Player tags should start with # and contain only alphanumeric characters
 * @param {string} playerTag - The player tag to validate
 * @returns {object} Validation result with isValid and error message
 */
function validatePlayerTag(playerTag) {
    if (!playerTag) {
        return {
            isValid: false,
            error: 'Player tag is required'
        };
    }

    if (typeof playerTag !== 'string') {
        return {
            isValid: false,
            error: 'Player tag must be a string'
        };
    }

    // Player tags should start with #
    if (!playerTag.startsWith('#')) {
        return {
            isValid: false,
            error: 'Player tag must start with # character'
        };
    }

    // Remove the # and check if remaining characters are alphanumeric
    const tagWithoutHash = playerTag.slice(1);

    if (tagWithoutHash.length === 0) {
        return {
            isValid: false,
            error: 'Player tag cannot be just #'
        };
    }

    // Check for valid characters (alphanumeric only)
    const validPattern = /^[A-Z0-9]+$/i;
    if (!validPattern.test(tagWithoutHash)) {
        return {
            isValid: false,
            error: 'Player tag can only contain alphanumeric characters after #'
        };
    }

    return {
        isValid: true,
        error: null
    };
}

/**
 * Encode player tag for URL
 * Converts # to %23 for proper URL encoding
 * @param {string} playerTag - The player tag to encode
 * @returns {string} URL-encoded player tag
 */
function encodePlayerTag(playerTag) {
    // URL encode the entire tag (# becomes %23)
    return encodeURIComponent(playerTag);
}

/**
 * Sanitize and prepare player tag for API request
 * @param {string} playerTag - Raw player tag from request
 * @returns {object} Result with sanitized tag or error
 */
function preparePlayerTag(playerTag) {
    // Trim whitespace
    const trimmedTag = playerTag.trim();

    // Add # if missing (user convenience)
    const tagWithHash = trimmedTag.startsWith('#') ? trimmedTag : `#${trimmedTag}`;

    // Validate the tag
    const validation = validatePlayerTag(tagWithHash);

    if (!validation.isValid) {
        return {
            success: false,
            error: validation.error
        };
    }

    // Encode for URL
    const encodedTag = encodePlayerTag(tagWithHash);

    return {
        success: true,
        originalTag: tagWithHash,
        encodedTag: encodedTag
    };
}

module.exports = {
    validatePlayerTag,
    encodePlayerTag,
    preparePlayerTag
};

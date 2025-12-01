const { param, query, validationResult } = require('express-validator');

const validateRegion = [
    param('region')
        .isIn(['na', 'eu', 'ap', 'kr', 'latam', 'br'])
        .withMessage('Invalid region. Available regions: na, eu, ap, kr, latam, br'),
];

const validateName = [
    param('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3, max: 16 })
        .withMessage('Name must be between 3 and 16 characters'),
];

const validateTag = [
    param('tag')
        .trim()
        .notEmpty()
        .withMessage('Tag is required')
        .isLength({ min: 3, max: 5 })
        .withMessage('Tag must be between 3 and 5 characters'),
];

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.query.format === 'text') {
            return res.send(`Error: ${errors.array()[0].msg}`);
        }
        return res.status(400).json({ status: 400, errors: errors.array() });
    }
    next();
};

const commonValidations = [
    ...validateRegion,
    ...validateName,
    ...validateTag,
    validateRequest
];

module.exports = {
    validateRegion,
    validateName,
    validateTag,
    validateRequest,
    commonValidations
};

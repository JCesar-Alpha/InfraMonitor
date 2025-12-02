import Joi from 'joi';

export const validateOccurrence = (req, res, next) => {
    const schema = Joi.object({
        type: Joi.string().valid('buraco', 'iluminacao', 'lixo', 'sinalizacao', 'outros').required(),
        title: Joi.string().trim().min(5).max(100).required(),
        description: Joi.string().trim().min(10).max(500).required(),
        address: Joi.string().trim().min(5).max(200).required(),
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required(),
        severity: Joi.string().valid('low', 'medium', 'high').optional(),
        priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional()
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Dados de ocorrência inválidos',
            errors: error.details.map(detail => detail.message)
        });
    }
    
    next();
};

export const validateUser = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().trim().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        profile: Joi.object({
            bio: Joi.string().max(200).optional(),
            location: Joi.object({
                city: Joi.string().optional(),
                state: Joi.string().optional()
            }).optional()
        }).optional()
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Dados de usuário inválidos',
            errors: error.details.map(detail => detail.message)
        });
    }
    
    next();
};

export const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Dados de login inválidos',
            errors: error.details.map(detail => detail.message)
        });
    }
    
    next();
};

export const validateConfirmation = (req, res, next) => {
    const schema = Joi.object({
        comment: Joi.string().max(200).optional(),
        severityAssessment: Joi.string().valid('low', 'medium', 'high').optional(),
        location: Joi.object({
            lat: Joi.number().min(-90).max(90).optional(),
            lng: Joi.number().min(-180).max(180).optional()
        }).optional()
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Dados de confirmação inválidos',
            errors: error.details.map(detail => detail.message)
        });
    }
    
    next();
};
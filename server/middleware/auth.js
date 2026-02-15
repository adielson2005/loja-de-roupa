const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware de autenticação
const auth = async (req, res, next) => {
  try {
    // Pega o token do header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acesso negado. Token não fornecido.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca o usuário
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido ou usuário inativo.'
      });
    }

    // Adiciona o usuário à requisição
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado.'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Erro na autenticação.'
    });
  }
};

// Middleware para verificar role de admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso restrito a administradores.'
    });
  }
  next();
};

// Middleware para verificar roles específicas
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para esta ação.'
      });
    }
    next();
  };
};

module.exports = { auth, adminOnly, authorize };

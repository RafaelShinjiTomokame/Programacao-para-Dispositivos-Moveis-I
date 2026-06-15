module.exports = (...roles) => {
    return (req, res, next) => {
      if (!req.usuario) {
        return res.status(401).json({ erro: 'Não autenticado' });
      }
      if (!roles.includes(req.usuario.role)) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }
      next();
    };
  };
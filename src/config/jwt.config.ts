const JWT_CONFIG = {
  accessSecret: 'secures-developer-access',
  refreshSecret: 'secures-developer-refresh',
  jwtExpiration: 900, // 15 minutes
  // jwtExpiration: 86400, // 24 hours
  jwtRefreshExpiration: 86400, // 24 hours

  /* for test */
  // jwtExpiration: 10, // 1 minute
  // jwtRefreshExpiration: 5, // 2 minutes

  cookie: {
    httpOnly: true,
    // maxAge: 60000 // for test  1 minute
    maxAge: 86400000, // 24 hours (mill sec)
  },
};

export { JWT_CONFIG };

"use strict";
process.env.NODE_ENV = "test";
process.env.JWT_SECRET =
    "unit_test_jwt_secret";
process.env.JWT_EXPIRES_IN = "1d";
process.env.CLIENT_URL =
    "http://localhost:5173";

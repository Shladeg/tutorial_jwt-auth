import jwt from "jsonwebtoken";

import TokenModel from "../models/token-model.js";

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JVT_ACCESS_SECRET_KEY, {
      expiresIn: "30m",
    });

    const refreshToken = jwt.sign(payload, process.env.JVT_REFRESH_SECRET_KEY, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JVT_ACCESS_SECRET_KEY);

      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JVT_REFRESH_SECRET_KEY);

      return userData;
    } catch (e) {
      return null;
    }
  }

  // this way will rewrite user's token if he will login from other device
  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;

      return tokenData.save();
    }

    const token = await TokenModel.create({ user: userId, refreshToken });

    return token;
  }

  async removeToken(refreshToken) {
    const token = await TokenModel.deleteOne({ refreshToken });

    return token;
  }

  async findToken(refreshToken) {
    const token = await TokenModel.findOne({ refreshToken });

    return token;
  }
}

export default new TokenService();

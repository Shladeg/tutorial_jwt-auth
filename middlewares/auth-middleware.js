import ApiError from "../exceptions/api-error.js";
import tokenService from "../services/token-service.js";

export default (req, res, next) => {
  try {
    const athorizationHeader = req.headers.authorization;

    if (!athorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = athorizationHeader.split(" ")[1];

    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);

    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;

    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
};

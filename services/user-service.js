import bcrypt from "bcrypt";
import { v4 } from "uuid";
import UserDto from "../dtos/user-dto.js";

import UserModel from "../models/user-model.js";

import mailService from "../services/mail-service.js";
import tokenService from "../services/token-service.js";

const SALT = 3;

class UserService {
  async registration(email, password) {
    const condidate = await UserModel.findOne({ email });

    if (condidate) {
      throw new Error(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }

    const hashPassword = await bcrypt.hash(password, SALT);
    const activationLink = v4();

    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
}

export default new UserService();

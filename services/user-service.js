import UserModel from "../models/user-model";

class UserService {
  async registration(email, password) {
    const condidate = await UserModel.findOne({ email });

    if (condidate) {
      throw new Error(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }

    const user = await UserModel.create({ email, password });

    return user;
  }
}

export default new UserService();

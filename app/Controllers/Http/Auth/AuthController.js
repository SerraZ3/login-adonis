"use strict";
const Database = use("Database");
const User = use("App/Models/User");
const Role = use("Role");

class AuthController {
  async register({ request, response }) {
    // Criando uma transaction (Serve para cadastrar diversos elementos no DB e garantir que ou todos serão cadastrados ou nenhum)
    const trx = await Database.beginTransaction();
    try {
      const { username, email, password } = request.all();
      const user = await User.create({ username, email, password }, trx);

      const userRole = await Role.findBy("slug", "client");

      await user.roles().attach([userRole.id], null, trx);
      // Roda todos os valores da trx e garante a persistencia
      await trx.commit();

      return response.status(201).send({ data: user });
    } catch (error) {
      await trx.rollback();
      console.log(error);
      return response
        .status(400)
        .send({ message: "Erro ao realizar cadastro" });
    }
  }
  async login({ request, response, auth }) {
    const { email, password } = request.all();
    let data = await auth.withRefreshToken().attempt(email, password);

    return response.send({ data });
  }
  async refresh({ request, response, auth }) {
    let refresh_token = request.input("refresh_token");

    if (!refresh_token) {
      refresh_token = request.header("refresh_token");
    }

    const user = await auth
      .newRefreshToken()
      .generateForRefreshToken(refresh_token);

    return response.send({ data: user });
  }
  async logout({ request, response, auth }) {
    let refresh_token = request.input("refresh_token");
    if (!refresh_token) {
      refresh_token = request.header("refresh_token");
    }
    await auth
      .authenticator("jwt")
      .revokeTokens([refresh_token], true /*Apagado o token */);

    return response.status(204).send({ message: "Logout confirmed" });
  }
  async forgot({ request, response }) {}
  async remember({ request, response }) {}
  async reset({ request, response }) {}
}

module.exports = AuthController;

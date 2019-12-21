"use strict";

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
// const Factory = use('Factory')
const Role = use("Role");

// Cria as regras de acesso do sistema
class RoleSeeder {
  async run() {
    // Cria o cargo de administrador
    await Role.create({
      name: "Admin",
      slug: "admin",
      description: "Administrador do sistema"
    });
    // Cria o cargo de gerente
    await Role.create({
      name: "Manager",
      slug: "manager",
      description: "Gerente do sistema"
    });
    // Cira o cargo de cliente
    await Role.create({
      name: "Client",
      slug: "client",
      description: "Cliente do sistema"
    });
  }
}

module.exports = RoleSeeder;

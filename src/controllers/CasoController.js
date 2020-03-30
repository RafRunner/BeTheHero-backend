"use strict";

const connection = require("../database/connection");

module.exports = {
  async index(request, response) {
    const { page = 1, page_size = 5 } = request.query;

    const [count] = await connection("casos").count();

    const casos = await connection("casos")
      .join("ongs", "ongs.id", "=", "casos.ong_id")
      .limit(page_size)
      .offset(page_size * (page - 1))
      .select([
        "casos.*",
        "ongs.nome",
        "ongs.email",
        "ongs.whatsapp",
        "ongs.cidade",
        "ongs.uf"
      ]);

    response.header("X-Total-Count", count["count(*)"]);

    return response.json(casos);
  },

  async create(request, response) {
    const { titulo, descricao, valor } = request.body;
    const ong_id = request.headers.authorization;

    const [id] = await connection("casos").insert({
      titulo,
      descricao,
      valor,
      ong_id
    });

    return response.json({ id: id });
  },

  async delete(request, response) {
    const { id } = request.params;
    const ong_id = request.headers.authorization;

    const caso = await connection("casos")
      .where("id", id)
      .select("ong_id")
      .first();

    if (!caso) {
      return response.status(400).send();
    }

    if (caso.ong_id !== ong_id) {
      return response.status(401).json({ error: "Operation not permitted" });
    }

    await connection("casos")
      .where("id", id)
      .delete();

    return response.status(204).send();
  }
};

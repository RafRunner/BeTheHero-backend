"use strict";

const express = require("express");
const { celebrate, Segments, Joi } = require("celebrate");

const OngController = require("./controllers/OngController");
const CasoController = require("./controllers/CasoController");
const ProfileController = require("./controllers/ProfileController");
const SessionController = require("./controllers/SessionController");

const routes = express.Router();

routes.get("/ongs", OngController.index);
routes.post(
  "/ongs",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      nome: Joi.string().required(),
      email: Joi.string()
        .required()
        .email(),
      whatsapp: Joi.number()
        .required()
        .min(10)
        .max(11),
      cidade: Joi.string().required(),
      uf: Joi.string()
        .required()
        .length(2)
    })
  }),
  OngController.create
);

routes.get(
  "/casos",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().min(1),
      page_size: Joi.number().min(1)
    })
  }),
  CasoController.index
);

routes.post(
  "/casos",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      titulo: Joi.string().required(),
      descricao: Joi.string().required(),
      valor: Joi.number()
        .required()
        .min(1)
    })
  }),
  CasoController.create
);

routes.delete(
  "/casos/:id",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required()
    }).unknown()
  }),
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required()
    })
  }),
  CasoController.delete
);

routes.get(
  "/profile",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required()
    }).unknown()
  }),
  ProfileController.index
);

routes.post(
  "/sessions",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.string().required()
    })
  }),
  SessionController.create
);

module.exports = routes;

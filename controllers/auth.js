const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = express.response) => {
	const { name, email, password } = req.body;
	try {
		let usuario = await Usuario.findOne({ email });

		if (usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'Correo ya existe',
			});
		}

		usuario = new Usuario(req.body);

		// Encriptar contraseña
		const salt = bcrypt.genSaltSync();
		usuario.password = bcrypt.hashSync(password, salt);

		await usuario.save();

		// Generar JWT
		const token = await generarJWT(usuario.id, usuario.name);

		res.status(201).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error interno',
		});
	}
};
const loginUsuario = async (req, res = express.response) => {
	const { email, password } = req.body;
	try {
		const usuario = await Usuario.findOne({ email });

		if (!usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'Usuario no existe',
			});
		}

		// Confirmar password

		const validPassword = bcrypt.compareSync(password, usuario.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Pass incorrecto',
			});
		}

		// Generar JWT
		const token = await generarJWT(usuario.id, usuario.name);

		res.json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error interno',
		});
	}
};
const revalidarToken = async (req, res = express.response) => {
	const { uid, name } = req;

	const token = await generarJWT(uid, name);

	res.json({
		ok: true,
		uid,
		name,
		token,
	});
};

module.exports = { crearUsuario, loginUsuario, revalidarToken };

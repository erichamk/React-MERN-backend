/*
    Rutas de Eventos
    host+/api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');
const {
	getEventos,
	crearEvento,
	actualizarEvento,
	eliminarEvento,
} = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');
const router = Router();
router.use(validarJWT);

router.get(
	'/',
	[
		//middlewares
	],
	getEventos
);

router.post(
	'/',
	[
		//middlewares
		check('title', 'El titulo es obligatorio').not().isEmpty(),
		check('start', 'El start es obligatorio').custom(isDate),
		check('end', 'El end es obligatorio').custom(isDate),
		validarCampos,
	],
	crearEvento
);
router.put(
	'/:id',
	[
		//middlewares
		// check('email', 'El email es obligatorio').isEmail(),
		// check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
		// validarCampos,
	],
	actualizarEvento
);
router.delete(
	'/:id',
	[
		//middlewares
		// check('email', 'El email es obligatorio').isEmail(),
		// check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
		// validarCampos,
	],
	eliminarEvento
);

module.exports = router;

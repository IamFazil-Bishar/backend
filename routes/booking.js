import express from 'express'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.cjs'
import { createBooking, getAllBooking, getBooking } from '../controllers/bookingController.js'

const router = express.Router()

router.post('/', verifyUser, createBooking)
router.get('/:id', verifyUser, getBooking)
router.get('/', verifyAdmin, getAllBooking)

export default router
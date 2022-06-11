import express from "express";
const router = express.Router();
import  authenticateUser  from "../middleware/auth.js";
import authorizePermissions from "../middleware/fullAuth.js";


  import {
    createHotel,
    getAllHotels,
    getSingleHotel,
    updateHotel,
    deleteHotel,
    uploadImage,
    showStats,
  } from "../controllers/hotels.js";


  router.route("/").post(authenticateUser, authorizePermissions('admin'),createHotel).get(getAllHotels);
  router.route("/stats").get(authenticateUser,showStats);
  router
    .route("/uploadImage")
    .post(authenticateUser, authorizePermissions("admin"), uploadImage);
  router
    .route("/:id")
    .get(getSingleHotel)
    .patch(authenticateUser, authorizePermissions("admin"), updateHotel)
    .delete(authenticateUser, authorizePermissions("admin"), deleteHotel);


  export default router;
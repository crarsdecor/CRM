import express from "express";
import {
  createUser,
  getUsers,
  updateUser,
  updateListings,
  deleteUser,
  getUserById,
  updateFbaStatus,
  updateUserDetails,
} from "../controller/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:userId", getUserById);
router.put("/update/:id", updateUserDetails);
router.put("/:userId", updateUser);
router.put("/update-listing/:userId", updateListings);
router.put("/updatefba/:userId", updateFbaStatus);
router.delete("/:userId", deleteUser);

export default router;

import { User, ROLES } from "../model/userModel.js";

// export const createUser = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       role,
//       managerIds,
//       ...otherFields // Collect remaining fields dynamically
//     } = req.body;

//     // Validate role
//     if (![ROLES.MANAGER, ROLES.USER].includes(role)) {
//       return res.status(400).json({ message: 'Invalid role' });
//     }

//     // If role is USER, validate manager IDs
//     if (role === ROLES.USER) {
//       if (!managerIds || !managerIds.length) {
//         return res.status(400).json({ message: 'At least one manager must be assigned to a user' });
//       }

//       // Validate provided manager IDs
//       const managers = await User.find({ _id: { $in: managerIds }, role: ROLES.MANAGER });
//       if (managers.length !== managerIds.length) {
//         return res.status(400).json({ message: 'One or more managers not found or invalid' });
//       }
//     }

//     // Create a new user dynamically with provided fields
//     const newUser = new User({
//       name,
//       email,
//       password,
//       role,
//       managers: managerIds || [],
//       ...otherFields, // Spread remaining fields (e.g., dateAmazon, uid, etc.)
//     });

//     await newUser.save();

//     res.status(201).json({ message: `${role} created successfully`, user: newUser });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      managerIds,
      ...otherFields // Collect remaining fields dynamically
    } = req.body;

    // Validate role: Extend to include Accountant
    if (![ROLES.MANAGER, ROLES.USER, ROLES.ACCOUNTANT].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // If role is USER, validate manager IDs
    if (role === ROLES.USER) {
      if (!managerIds || !managerIds.length) {
        return res
          .status(400)
          .json({ message: "At least one manager must be assigned to a user" });
      }

      // Validate provided manager IDs
      const managers = await User.find({
        _id: { $in: managerIds },
        role: ROLES.MANAGER,
      });
      if (managers.length !== managerIds.length) {
        return res
          .status(400)
          .json({ message: "One or more managers not found or invalid" });
      }
    }

    // Handle specific logic for Accountants if needed (optional)
    if (role === ROLES.ACCOUNTANT) {
      // Example: Validate specific fields or relationships for accountants
      // Add validation or assignments if accountants require specific logic
    }

    // Create a new user dynamically with provided fields
    const newUser = new User({
      name,
      email,
      password,
      role,
      managers: managerIds || [],
      ...otherFields, // Spread remaining fields (e.g., dateAmazon, uid, etc.)
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: `${role} created successfully`, user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users or filter by role
// export const getUsers = async (req, res) => {
//   try {
//     const { role } = req.query;
//     const filter = role ? { role } : {};

//     const users = await User.find(filter).populate('managers', 'name email');
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getUsers = async (req, res) => {
  try {
    const { role, managerId } = req.query;

    // Construct the filter object
    const filter = {};
    if (role) {
      filter.role = role;
    }
    if (managerId) {
      filter.managers = managerId; // Match users assigned to the given manager
    }

    // Fetch users with optional filters and populate managers
    const users = await User.find(filter).populate("managers", "name email");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from request params
    const {
      name,
      email,
      enrollmentIdAmazon,
      enrollmentIdWebsite,
      primaryContact,
    } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email are required." });
    }

    // Find the user and update details
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          email,
          enrollmentIdAmazon,
          enrollmentIdWebsite,
          primaryContact,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User details updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update user (assign/unassign managers)

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body; // Get all fields to update from the request body

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (updates.managerIds) {
      // Validate all provided manager IDs
      const managers = await User.find({
        _id: { $in: updates.managerIds },
        role: ROLES.MANAGER,
      });
      if (managers.length !== updates.managerIds.length) {
        return res
          .status(400)
          .json({ message: "One or more managers not found or invalid" });
      }
      updates.managers = updates.managerIds; // Ensure the correct field is updated
      delete updates.managerIds; // Remove from updates to avoid overriding unintentionally
    }

    // Handle accountOpenIn and accountOpenCom with the specific reason fields
    if (updates.hasOwnProperty("accountOpenIn")) {
      if (updates.accountOpenIn === false && !updates.accountOpenInReason) {
        return res.status(400).json({
          message:
            "Reason is required when marking Account Open In as Not Done.",
        });
      }
      user.accountOpenIn = updates.accountOpenIn;
      user.reasonIn = updates.accountOpenInReason || ""; // Assign the reason from 'accountOpenInReason'
      // If a reason is provided, set accountOpenIn to false automatically
      if (updates.accountOpenInReason) {
        user.accountOpenIn = false;
      }
    }

    if (updates.hasOwnProperty("accountOpenCom")) {
      if (updates.accountOpenCom === false && !updates.accountOpenComReason) {
        return res.status(400).json({
          message:
            "Reason is required when marking Account Open Com as Not Done.",
        });
      }
      user.accountOpenCom = updates.accountOpenCom;
      user.reasonCom = updates.accountOpenComReason || ""; // Assign the reason from 'accountOpenComReason'
      // If a reason is provided, set accountOpenCom to false automatically
      if (updates.accountOpenComReason) {
        user.accountOpenCom = false;
      }
    }

    // Update user with the provided fields
    Object.assign(user, updates);

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateListings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { listingsCountIn, listingsCountCom } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (listingsCountIn !== undefined) user.listingsCountIn = listingsCountIn;
    if (listingsCountCom !== undefined)
      user.listingsCountCom = listingsCountCom;

    await user.save();

    res.status(200).json({ message: "Listings updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update FBA IN or FBA COM status
export const updateFbaStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const body = req.body;

    const field = Object.keys(body)[0];
    const status = body[field];

    if (!["fbaIn", "fbaCom"].includes(field)) {
      return res.status(400).json({ message: "Invalid field update request" });
    }

    const booleanStatus = status === "Yes";

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user[field] = booleanStatus;
    await user.save();

    res.status(200).json({ message: `${field} updated successfully`, user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID to check service type (Amazon or Website)
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters

    // Find user by ObjectId
    const user = await User.findById(userId).populate("managers", "name email"); // Populate managers if needed

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Spread user object to include all fields, then add/modify based on role
    let responseData = {
      ...user.toObject(), // Convert Mongoose document to plain JavaScript object
    };

    // Additional data for specific roles
    if (user.role === ROLES.MANAGER) {
      responseData.service = user.service;
    }

    if (user.role === ROLES.USER) {
      responseData = {
        ...responseData,
        uid: user.uid,
        dateAmazon: user.dateAmazon,
        dateWebsite: user.dateWebsite,
        enrollmentIdAmazon: user.enrollmentIdAmazon,
        enrollmentIdWebsite: user.enrollmentIdWebsite,
        batch: user.batch,
      };
    }

    if (user.role === ROLES.ADMIN) {
      responseData.managers = user.managers;
    }

    // Send the full user data with modifications
    return res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

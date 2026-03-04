// const roles = {
//   admin: ["create", "read", "update", "delete"],
//   editor: ["read", "update"],
//   user: ["read"],
// };

// export function authorize(requiredPermissions /* ["read"] */) {
//   return (req, res, next) => {
//     const userRole = req.user.role; // Anta att rollen är lagrad i req.user
//     const userPermissions = roles[userRole];
//     if (!userPermissions) {
//       return res.status(403).send("Roll saknar behörigheter.");
//     }
//     const hasPermission = requiredPermissions.every((permission) =>
//       userPermissions.includes(permission),
//     );
//     if (!hasPermission) {
//       return res.status(403).send("Åtkomst nekad.");
//     }
//     next(); // Fortsätt till routen om behörigheter matchar
//   };
// }

const permissions = {
  admin: ["all"],
  editor: ["read", "update", "delete"],
  sales: ["read", "update", "selling"],
  marketing: ["read", "delete", "marketing"],
  support: ["read", "user_support"],
  user: ["read"],
};

const roles = {
  admin: ["admin"],
  editor: ["editor", "sales", "marketing", "support", "user"],
  sales: ["sales", "user"],
  marketing: ["marketing", "user"],
  support: ["support", "user"],
  user: ["user"],
};

export function authorizeWithHierarchy(requiredPermissions) {
  return (req, res, next) => {
    const userRole = req.user.role; // Anta att rollen finns i req.user

    const allowedRoles = roles[userRole] || [];
    let hasPermission = false;
    for (const role of allowedRoles) {
      const rolePermissions = permissions[role];
      if (requiredPermissions.every((p) => rolePermissions.includes(p))) {
        hasPermission = true;
        break;
      }
    }
    if (!hasPermission) {
      return res.status(403).send("Åtkomst nekad.");
    }
    next(); // Fortsätt till routen
  };
}

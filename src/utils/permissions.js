const permissions = {
  faculty: [
    "componentActions",
    "reportActions",
  ],
  admin: [
    // "userActions",
    "addUser",
    "subjectActionsAdd",
    "outcomeActions",
    "reportActions",
  ],
  super_admin: [
    "userActions",
    "addUser",
    "subjectActionsAdd",
    "reportActions",
  ],
};

export default permissions;

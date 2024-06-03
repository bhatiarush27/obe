const permissions = {
  faculty: [
    // "userActions",
    // "subjectActions",
    "componentActions",
    "outcomeActions",
    "reportActions",
  ],
  admin: [
    "userActions",
    "addUser",
    "subjectActions",
    "componentActions",
    "outcomeActions",
    "reportActions",
  ],
  super_admin: [
    "userActions",
    "addUser",
    "subjectActions",
    "componentActions",
    "outcomeActions",
    "reportActions",
  ],
};

export default permissions;

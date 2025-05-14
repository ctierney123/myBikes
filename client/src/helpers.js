export function isUsername(username) {
  username = isString(username, "username");

  if (!isNaN(Number(username)))
    throw new Error("username cannot only contain numbers");

  const regex = "[^A-Za-z0-9]";
  if (regex.test(username))
    throw new Error("username cannot contain special characters and spaces");

  if (username.length < 5 || username.length > 25)
    throw new Error("username must be between 5-25 characters in length");

  return username;
}

export function isPassword(password) {
  password = isString(password, "password");
  if (password.includes(" "))
    throw new Error("password cannot contain a space");
  if (password.length < 8)
    throw new Error("password must be at least 8 characters long");
  if (!/[A-Z]/.test(password))
    throw new Error("password must contain atleast one uppercase character");
  if (!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password))
    throw new Error("password must contain atleast one special character");
  if (!/\d/.test(password))
    throw new Error("password must contain atleast one number");

  return password;
}

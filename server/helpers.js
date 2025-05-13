//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.

export const isString = (element, varName) => {
  if (!element)
    throw new Error(`${varName || "provided variable"} is undefined!`);
  if (typeof element !== "string")
    throw new Error(`${varName || "provided variable"} is not a string!`);
  if (element.trim().length === 0)
    throw new Error(
      `${
        varName || "provided variable"
      } cannot be an empty string or string with just spaces!`
    );

  return element.trim();
};

export function isNumber(number, varName) {
  if (!number)
    throw new Error(`${varName || "provided variable"} is undefined!`);
  if (typeof number !== "number" || isNaN(number))
    throw new Error(`${varName || "provided variable"} is not a number!`);

  return number;
}

export function isFLoat(float, varName) {
  if (Number(float) !== float && float % 1 == 0) {
    throw new Error(`${varName || "provided variable"} is not a float!`);
  }

  return float;
}

export const isArray = (arr, varName) => {
  if (!Array.isArray(arr))
    throw new Error(`${varName || "provided variable"} is not an array!`);

  return arr;
};

export const isBoolean = (bool, varName) => {
  if (typeof bool !== "boolean")
    throw new Error(`${varName || "provided variable"} is not a boolean!`);

  return bool;
};

export const isFavorite = (fav, varName) => {
  fav = isObject(fav, "favorite");
  const favKeys = Object.keys(fav);
  if (favKeys.length != 4) {
    throw new Error(`${varName || "provided variable"} is missing keys!`);
  }
  if (
    !favKeys.includes("notification") ||
    !favKeys.includes("favoriteId") ||
    !favKeys.includes("location") ||
    !favKeys.includes("name")
  ) {
    throw new Error(`${varName || "provided variable"} is missing keys!`);
  }

  return fav;
};

export function isObject(object, varName) {
  if (!object) throw new Error(`${varName} is undefined`);
  if (Array.isArray(object) || typeof object !== "object")
    throw new Error(`${varName} is not an object`);

  return object;
}

export function isName(name) {
  name = isString(name);

  const regex = "^[a-zA-Z.'- ]+$";
  if (!regex.test(name))
    throw new Error(
      "Names can only include the alphabet, spaces, hypens, apostraphes, and period"
    );

  if (name.length < 5 || name.length > 25)
    throw new Error("Name must be between the 5-25 characters in length");

  return name;
}

export function isUsername(username) {
  username = isString(username, "username");

  if (!isNaN(Number(username)))
    throw new Error("username cannot only contain numbers");

  const regex = "[^A-Za-z0-9]";
  if (regex.test(username))
    throw new Error("username cannot contain special characters and spaces");

  if (username.length < 5)
    throw new Error("username must be atleast 5 characters long");

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

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};


export const isEmail = (email, name = 'email') => {
  // allows null/undefined to remove email
  if (email === null || email === undefined) return null;
  
  if (typeof email !== 'string') throw new Error(`${name} must be a string or null`);
  email = email.trim();
  if (email.length === 0) return null;
  
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) throw new Error(`${name} must be a valid email address`);
  
  return email.toLowerCase();
};

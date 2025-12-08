export const isValidPassword = (password) => {
  const regex = /^[a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{1,20}$/;
  return regex.test(password);
};

export function ValidateEmail(email) {
  if (email.trim() === "") {
    return "Por favor, ingresa tu correo";
  }
}

export function ValidateLoginData(email, password) {
  if (email.trim() === "" && password.trim() === "") {
    return "Por favor, ingresa tu correo y contraseña";
  }
  if (email.trim() === "") {
    return "Tiene que ingresar su correo";
  }
  if (password.trim() === "") {
    return "Ingrese una contraseña";
  }
  if (!isValidPassword(password)) {
    return "La contraseña debe ser alfanumérica y tener un máximo de 20 caracteres";
  }
  return null;
}

export function ValidateVerificationData(newPassword, token) {
  if (!token.trim() && !newPassword.trim()) {
    return "Por favor, ingrese el código de verificación y la nueva contraseña";
  }
  if (!token.trim()) {
    return "Por favor, ingrese el código de verificación";
  }

  if (!newPassword.trim()) {
    return "Por favor, ingrese la nueva contraseña";
  }
  return null;
}

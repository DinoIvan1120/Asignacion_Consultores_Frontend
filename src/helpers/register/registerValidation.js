export const isValidPassword = (password) => {
  const regex = /^[a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{1,20}$/;
  return regex.test(password);
};

export function ValidateRegisterData(userData) {
  const { alias, firstname, lastname, email, password, birthdayDate } =
    userData;

  if (
    !alias ||
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !birthdayDate
  ) {
    return "Por favor, complete todos los campos";
  }
  if (!isValidPassword(password)) {
    return "La contraseña debe ser alfanumérica y tener un máximo de 20 caracteres";
  }
  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return "Ingrese un correo válido";
  }
  return null;
}

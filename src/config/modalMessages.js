const createModalMessage =
  (defaultValues) =>
  (overrides = {}) => ({
    ...defaultValues,
    ...overrides,
  });

export const modalMessages = {
  success: createModalMessage({
    title: "Éxito",
    message: "",
    icon: "check",
  }),
  error: createModalMessage({
    title: "Error",
    message: "",
    icon: "times",
  }),
};

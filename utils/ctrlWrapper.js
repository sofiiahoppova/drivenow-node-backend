export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    Promise.resolve()
      .then(() => controller(req, res, next))
      .catch(next);
  };
};

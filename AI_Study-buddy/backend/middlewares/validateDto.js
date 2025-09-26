export const validateDto = (DtoClass) => {
  return (req, res, next) => {
    try {
      const dto = new DtoClass(req.body);
      dto.validate();
      req.dto = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
};

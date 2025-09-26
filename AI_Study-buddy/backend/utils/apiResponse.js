class ResponseHandler {
  constructor(res) {
    this.res = res;
  }

  success(data, message = "Success", status = 200) {
    return this.res.status(status).json({
      status: "success",
      message,
      data,
    });
  }

  error(data, message = "Error", status = 200) {
    return this.res.status(status).json({
      status: "error",
      message,
      data,
    });
  }
}

export default ResponseHandler;

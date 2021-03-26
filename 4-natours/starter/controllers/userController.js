
const notImplResponse = (req, res) => {
    res.status(500).json({
      status: 'fail',
      message: 'Resource not yet implemented',
    });
  };
  
  exports.getAllUsers = (req, res) => {
    notImplResponse(req, res);
  };
  exports.getUser = (req, res) => {
    notImplResponse(req, res);
  };
  exports.createUser = (req, res) => {
    notImplResponse(req, res);
  };
  exports.updateUser = (req, res) => {
    notImplResponse(req, res);
  };
  exports.deleteUser = (req, res) => {
    notImplResponse(req, res);
  };
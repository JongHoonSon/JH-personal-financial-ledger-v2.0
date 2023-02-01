const checkItemOwner = (item, user, next) => {
  if (!String(item.owner._id) === String(user._id)) {
    const error = new Error("권한이 없습니다.");
    error.statusCode = 403;
    next(error);
  }
};

export default checkItemOwner;

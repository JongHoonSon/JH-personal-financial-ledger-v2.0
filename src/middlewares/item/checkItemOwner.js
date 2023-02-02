const checkItemOwner = (item, user, next) => {
  if (String(item.owner._id) === String(user._id)) {
    return { isOwner: true };
  } else {
    const error = new Error("권한이 없습니다.");
    error.statusCode = 403;
    next(error);
    return { isOwner: false };
  }
};

export default checkItemOwner;

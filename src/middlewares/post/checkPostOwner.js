const checkPostOwner = (post, user, next) => {
  if (String(post.owner._id) === String(user._id)) {
    const error = new Error("권한이 없습니다.");
    error.statusCode = 403;
    next(error);
  }
  return;
};

export default checkPostOwner;

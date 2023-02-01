const logCurrentDate = (req, res, next) => {
  const date = new Date();

  res.locals.date = date;
  res.locals.thisYear = date.getFullYear().toString();
  res.locals.thisMonth = (date.getMonth() + 1).toString().padStart(2, 0);
  res.locals.thisDay = date.getDate().toString().padStart(2, 0);

  next();
};

export default logCurrentDate;

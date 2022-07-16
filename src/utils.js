Date.prototype.getWeek = function (dowOffset) {
  dowOffset = typeof dowOffset == "number" ? dowOffset : 0;
  var newYear = new Date(this.getFullYear(), 0, 1);
  var day = newYear.getDay() - dowOffset;
  day = day >= 0 ? day : day + 7;
  var daynum =
    Math.floor(
      (this.getTime() -
        newYear.getTime() -
        (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
        86400000
    ) + 1;
  var weeknum;

  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      let nYear = new Date(this.getFullYear() + 1, 0, 1);
      let nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};

export const sortItem = (itemList) => {
  itemList.sort((a, b) => {
    if (String(b.date) === String(a.date)) {
      return b.createdAt - a.createdAt;
    } else if (b.date !== a.date) {
      return b.date - a.date;
    }
  });
};

export const getStringDate = (date) => {
  return (
    date.getFullYear().toString() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, 0) +
    "-" +
    date.getDate().toString().padStart(2, 0)
  );
};

export const getStringAmount = (amount) => {
  const stringAmount = amount.toString();
  const arrAmount = stringAmount.split("");
  for (let i = arrAmount.length - 3; i >= 0; i = i - 3) {
    arrAmount[i] = "," + arrAmount[i];
  }

  return arrAmount.join("");
};

export const getStringDateDiff = (stringDate1, stringDate2) => {
  const date1 = new Date(stringDate1);
  const date2 = new Date(stringDate2);

  const diffTime = date1.getTime() - date2.getTime();

  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

import { boardModel } from "../../db/models";

const createDefaultData = async (req, res, next) => {
  const boardList = await boardModel.find({});

  if (boardList.length === 0) {
    const boardNameList = ["수다", "꿀팁", "질문"];

    boardNameList.forEach(async (boardName) => {
      try {
        await boardModel.create({ name: boardName });
      } catch (error) {
        next(error);
        return;
      }
    });
  }

  req.session.boardList = boardList;

  next();
};

export default createDefaultData;

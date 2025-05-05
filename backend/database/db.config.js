import mongoose from "mongoose";

export const ConnectToDataBase = async (DB_Url, DB_Name) => {
  const dbOptions = {
    dbName: DB_Name,
  };

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(DB_Url, dbOptions);
    console.log("connect with database successfully ✔");
  } catch (error) {
    console.log("Error in connecting with database", error);
  }
};

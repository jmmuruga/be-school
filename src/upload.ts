// import multer from "multer";
// import fs from "fs";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const classId = req.body.ClassName_Id;
//     const subjectId = req.body.subjectName_Id;
//     if (!classId || !subjectId) {
//       return cb(new Error("Class or Subject missing"), "");
//     }

//     const uploadPath = path.join(
//       "D:/be-school/uploads/objective-questions",
//       `Class_${classId}`,
//       `Subject_${subjectId}`,
//     );

//     //  create folder if not exists
//     fs.mkdirSync(uploadPath, { recursive: true });

//     cb(null, uploadPath);
//   },

//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   },
// });

// export const uploadObjectiveImage = multer({ storage });

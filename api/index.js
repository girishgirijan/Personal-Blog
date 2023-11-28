import express from "express"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import cookieParser from "cookie-parser"
import multer from "multer" // Upload files

const app = express()

//Middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}));

// Upload post files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../blog/public/uploads')
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      //cb(null, file.fieldname + '-' + uniqueSuffix)
      cb(null, Date.now()+file.originalname)
    }
  })

const uploadPost = multer({ storage: storage });

app.post("/api/upload", uploadPost.single("file"), function (req, res) {
    const file = req.file;
    res.status(200).json(file.filename);
  });
// Upload post files

//upload user image from register.jsx page
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, '../blog/public/uploads');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + "--" + file.originalname);
  },
})

const uploadUser = multer({storage : fileStorageEngine});

app.post("/api/userImage", uploadUser.single("image") ,(req, res) => {
  const imgfile = req.file;
  res.status(200).json(imgfile.filename);
});

//upload user image from register.jsx page



app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)




app.listen(8800, () => {
    console.log("Connected to backend!")
})
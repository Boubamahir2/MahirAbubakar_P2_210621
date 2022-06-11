import Hotels from "../models/Hotels.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
} from "../errors/index.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";

// @desc    create hotel
const createHotel = async (req, res, next) => {
  req.body.user = req.user.userId;
  const hotels = await Hotels.create(req.body);
  res.status(StatusCodes.CREATED).json({ hotels });
};

// @desc    get all hotels
const getAllHotels = async (req, res, next) => {
  let result = Hotels.find({});
  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  const hotels = await result;

  const numOfHotels = await Hotels.countDocuments();
  const numOfPages = Math.ceil(numOfHotels / limit);

  res.status(StatusCodes.OK).json({ hotels, numOfPages, numOfHotels });
};

// @desc    get hotel by id
const getSingleHotel = async (req, res, next) => {
  const { id: hotelId } = req.params;
  const hotel = await Hotels.findById(hotelId);
  if (!hotel) {
    throw new NotFoundError(`No hotel with id : ${hotelId}`);
  }
  res.status(StatusCodes.OK).json({ hotel });
};

// @desc    update hotel
const updateHotel = async (req, res, next) => {
  const { id: hotelId } = req.params;
  const hotel = await Hotels.findByIdAndUpdate({ _id: hotelId }, req.body, {
    new: true,
    runValidators: true,
  });
    if (!hotel) {
      throw new NotFoundError(`No hotel with id : ${hotelId}`);
    }
  res.status(StatusCodes.OK).json({ hotel });
}


// @desc    delete hotel
const deleteHotel = async (req, res, next) => {
  const { id: hotelId } = req.params;
   const hotel = await Hotels.findOne({ _id: hotelId });
    if (!hotel) {
      throw new NotFoundError(`No hotel with id : ${hotelId}`);
    }
  await hotel.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! hotel removed." });
}

// upload image
const uploadImage = async (req, res, next) => {
   if (!req.files) {
     throw new BadRequestError("No File Uploaded");
   }
  const hotelImage = req.files.image;
  console.log(hotelImage);
  if (!hotelImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please Upload an Image");
  }
  if (hotelImage.size > process.env.MAX_FILE_UPLOAD) {
    throw new BadRequestError(
      "Please Upload an Image less than 2MB"
    );
  }
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const imagepath = path.join(__dirname, "../public/uploads" + `${hotelImage.name}`);
  
  await hotelImage.mv(imagepath);

  res.status(StatusCodes.OK).json({ image : `/uploads/${hotelImage.name}` });

}

const showStats = async (req, res) => {
  let monthlyApplications = await Hotels.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ])
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y')
      return { date, count }
    })
    .reverse()

  res.status(StatusCodes.OK).json({ monthlyApplications })
}

export {
  showStats,
  createHotel,
  getAllHotels,
  getSingleHotel,
  updateHotel,
  deleteHotel,
  uploadImage,
}
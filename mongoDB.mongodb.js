use("VideoTube");

// db.comments.aggregate([
//   { $match: { video: ObjectId("684ebfe3d89a1fd4ac4aada2") } },
//   {
//     $lookup: {
//       from: "users",
//       localField: "owner",
//       foreignField: "_id",
//       as: "owner",
//       pipeline: [
//         {
//           $project: {
//             fullName: 1,
//             username: 1,
//             avatar: 1,
//           },
//         },
//       ],
//     },
//   },
//   {
//     $addFields: {
//       owner: {
//         $first: "$owner",
//       },
//     },
//   },
//   {
//     $sort: { createdAt: -1 },
//   },
//   {
//     $skip: 0,
//   },
//   {
//     $limit: 2,
//   },
// ]);

db.comments.findOne(ObjectId("685119707435055094f78e2e"));

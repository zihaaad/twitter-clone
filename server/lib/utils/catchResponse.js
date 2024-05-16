export default function CatchResponse(res) {
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}

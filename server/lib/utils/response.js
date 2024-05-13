export default function Response(res, {httpCode, status, message, data}) {
  res.status(httpCode).json({
    success: status,
    message: message,
    data: data || null,
  });
}

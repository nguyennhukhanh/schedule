export enum Message {
  // Error
  SomethingWrong = 'Lỗi! Đã xảy ra lỗi: ',

  // All
  Sucess = 'Thành công!',
  Failed = 'Thất bại',

  // Auth
  VerifyEmail = 'Xác nhận email của bạn',
  CheckEmail = 'Chúng tôi đã gửi một thông báo đến Email của bạn. Hãy kiểm tra chúng ngay bây giờ!',
  DulicateEmail = 'Có vẻ như trước đây Email này đã được đăng ký. Vui lòng sử dụng một Email khác!',
  InvalidEmail = 'Email này không hợp lệ hoặc đã chưa đăng ký trước đây!',
  InvalidPassword = 'Bạn đã nhập sai mật khẩu. Hãy thử lại!',
  InvalidToken = 'Token này không hợp lệ!',
  UniqueRefreshToken = 'Refresh Token chỉ có thể sử dụng một lần duy nhất',
  LoginSuccess = 'Bạn đã đăng nhập thành công!',

  // Verify
  Spam = 'Quá nhiều yêu cầu, hãy thử lại sau 5 phút!',
  ForgotPassword = 'Quên mật khẩu!',
  EmailNotFound = 'Chúng tôi không tìm thấy Email nào như này. Có vẻ như bạn chưa đăng ký!',
  CodeHasExpired = 'Mã của bạn đã hết hạn!',
  CodeNotVerified = 'Mã này có vấn đề, vui lòng kiểm tra lại!',

  // Profile
  MyProfile = 'Đây là thông tin tài khoản của bạn!',
  ErrorPassword = 'Bạn đã nhập sai mật khẩu!',
  ProfileUpdated = 'Thông tin của bạn đã được cập nhật',
  DeletedAccount = 'Tài khoản đã được xóa thành công!!!',

  // Role
  NotAuthorizedAccount = 'Bạn không có quyền thực hiện hành động này!',

  // Room
  RoomNotFound = 'Không tìm thấy phòng',
  CreateRoomSuccess = 'Tạo phòng thành công',
  UpdateRoomSuccess = 'Cập nhật phòng thành công',
  NotAuthorizedToUpdateRoom = 'Bạn không có quyền chỉnh sửa phòng này!',
  NotAuthorizedToDeleteRoom = 'Bạn không có quyền xóa phòng này!',
  DeleteRoomSuccessfully = 'Bạn đã xoá phòng này thành công!',
  InviteToJoin = 'Hãy tham gia phòng này với tôi!',
  SuccessfullyInvited = 'Lời mời của bạn đã được gửi!',
  SuccessfulParticipation = 'Bạn đã tham gia nhóm này thành công!',
  JoinError = 'Bạn đã tham gia nhóm này rồi',

  // Attendance
  DaysOff = 'Hôm nay là ngày nghỉ!',
  NotParticipate = 'Bạn không thể điểm danh ở nhóm này!',
  CheckedIn = 'Bạn đã điểm danh ngày hôm nay rồi!',
  CheckInSuccessfully = 'Bạn đã điểm danh thành công!!!',
  CheckOutFailed = 'Bạn chưa điểm danh ngày hôm nay, hãy điểm danh ngay!',
  CheckOutSuccessfully = 'Bạn đã kết thúc thời gian làm việc ngày hôm nay thành công!',
  checkIpAddress = 'Cảnh báo: Bạn đang ở một nơi khác để điểm danh!',
  AttendanceNotFound = 'Không tìm thấy buổi điểm danh nào như vậy!',
  UserNotFound = 'Người dùng này chưa từng tồn tại!',

  // Statistics
  Incompetent = 'Bạn không có quyền để tra cứu, hay thực hiện bất kì hành động nào khác của nhóm này! Bởi vì bạn không phải là người trong nhóm này!',

  // Middleware Upload
  ImageUploadFailedExt = 'Chỉ cho phép tải lên các tệp hình ảnh',
  ImageUploadFailedSize = 'Kích thước tệp không được vượt quá 7MB',
}

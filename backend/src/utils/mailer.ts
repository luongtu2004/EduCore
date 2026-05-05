import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
});

export const sendStudentAccountEmail = async (toEmail: string, fullName: string, courseName: string, studentCode: string, defaultPassword: string) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #059669; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Chào mừng đến với EduCore</h1>
        </div>
        <div style="padding: 20px;">
          <p>Xin chào <strong>${fullName}</strong>,</p>
          <p>Chúc mừng bạn đã thanh toán thành công khóa học <strong>${courseName}</strong>!</p>
          <p>Hệ thống đã tự động tạo tài khoản học tập cho bạn. Dưới đây là thông tin đăng nhập:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Trang đăng nhập:</strong> <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
            <p style="margin: 5px 0;"><strong>Email đăng nhập:</strong> ${toEmail}</p>
            <p style="margin: 5px 0;"><strong>Mã học viên:</strong> ${studentCode}</p>
            <p style="margin: 5px 0;"><strong>Mật khẩu:</strong> ${defaultPassword}</p>
          </div>
          <p style="color: #ef4444; font-size: 0.9em;">* Lưu ý: Vui lòng đổi mật khẩu ngay trong lần đăng nhập đầu tiên để bảo mật tài khoản.</p>
          <br/>
          <p>Trân trọng,<br/><strong>Đội ngũ EduCore</strong></p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"EduCore Academy" <${process.env.SMTP_USER || 'your-email@gmail.com'}>`,
      to: toEmail,
      subject: 'Thông tin tài khoản học tập - EduCore Academy',
      html: htmlContent,
    });
    console.log(`--- Đã gửi email cấp tài khoản tới: ${toEmail}`);
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return false;
  }
};

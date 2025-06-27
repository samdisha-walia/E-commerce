const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

exports.sendOrderReceipt = async (req, res) => {
  try {
    const { order, user } = req.body;

    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      // Send via Email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: '🧾 Your Shop-Top Order Receipt',
        text: 'Thank you for your order. Please find your receipt attached.',
        attachments: [
          {
            filename: `ShopTop_Receipt_${Date.now()}.pdf`,
            content: pdfData,
            contentType: 'application/pdf',
          },
        ],
      });

      res.status(200).json({ msg: 'Receipt emailed successfully.' });
    });

    // === 🧾 Generate PDF content ===
    doc.fontSize(20).text('🧾 Shop-Top Receipt', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`);
    doc.text(`Receipt #: ${Math.floor(100000 + Math.random() * 900000)}`);
    doc.moveDown();

    doc.text(`Customer Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Address: ${order.address || 'No address provided'}`);
    doc.moveDown();

    doc.text('📦 Order Items:', { underline: true });
    order.items.forEach((item, idx) => {
      doc.text(`${idx + 1}. ${item.name} × ${item.quantity} — ₹${item.price * item.quantity}`);
    });

    doc.moveDown();
    doc.font('Helvetica-Bold');

    doc.font('Helvetica-Bold').text(`Total Paid: ₹${order.paymentStatus === 'Paid' ? order.total.toFixed(2) : '0.00'}`);
    doc.font('Helvetica').moveDown();
    doc.text(`Payment Status: ${order.paymentStatus}`);
    doc.text(`Payment Mode: ${order.paymentStatus === 'Paid' ? 'Razorpay' : 'Pay on Delivery'}`);
    doc.moveDown().text('Thank you for shopping with us!');


    doc.end();

  } catch (err) {
    console.error('❌ PDF Generation or Email Error:', err);
    res.status(500).json({ msg: 'Failed to send receipt.' });
  }
};

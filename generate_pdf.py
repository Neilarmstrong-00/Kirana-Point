import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def create_pdf():
    pdf_path = "D:\\Project Files\\Client Projects\\Kirana Point\\Kirana_Point_Client_Feature_Presentation.pdf"
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=45,
        leftMargin=45,
        topMargin=45,
        bottomMargin=45
    )

    PRIMARY = colors.HexColor("#2D7A3A")      # Kirana Point Green
    PRIMARY_LIGHT = colors.HexColor("#F0FDF4")
    ACCENT = colors.HexColor("#C25E00")       # Amber
    DARK = colors.HexColor("#1E293B")         # Slate
    MUTED = colors.HexColor("#64748B")
    LIGHT_BG = colors.HexColor("#F8FAFC")
    BORDER_COLOR = colors.HexColor("#E2E8F0")

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        alignment=TA_CENTER
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=DARK,
        alignment=TA_CENTER
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=PRIMARY,
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=ACCENT,
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=DARK
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=DARK,
        leftIndent=15,
        firstLineIndent=-10
    )

    meta_label_style = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=PRIMARY
    )

    meta_val_style = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=DARK
    )

    th_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white,
        alignment=TA_LEFT
    )

    td_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=DARK,
        alignment=TA_LEFT
    )

    td_bold_style = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=PRIMARY,
        alignment=TA_LEFT
    )

    story = []

    # Title & Header
    story.append(Paragraph("🛒 KIRANA POINT", title_style))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Your Grocery Store Is Now Online!<br/><b>Store Owner Guide & Feature Handbook for Mr. Pratham Tarde</b>", subtitle_style))
    story.append(Spacer(1, 8))

    # Meta Table Card
    meta_rows = [
        [Paragraph("Store Name & Owner:", meta_label_style), Paragraph("<b>Kirana Point — Mr. Pratham Tarde</b>", meta_val_style)],
        [Paragraph("Store Address:", meta_label_style), Paragraph("Main Road, Khamgaon, Dist. Buldhana, Maharashtra 444303", meta_val_style)],
        [Paragraph("Live Website Link:", meta_label_style), Paragraph("<b>https://kirana-point.vercel.app</b>", meta_val_style)],
        [Paragraph("Direct UPI & WhatsApp:", meta_label_style), Paragraph("<b>8208232735@axl</b> | +91 8208232735", meta_val_style)],
    ]
    meta_table = Table(meta_rows, colWidths=[130, 390])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), PRIMARY_LIGHT),
        ('BACKGROUND', (1, 0), (1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # 1. Store Owner Login Credentials (Prominently Placed at the Top)
    story.append(Paragraph("1. Official Store Owner Login Credentials", h1_style))
    story.append(Paragraph("Save these credentials safely. Use them to log in to your store management console, inspect new incoming customer orders, and update stock.", body_style))
    story.append(Spacer(1, 4))

    cred_data = [
        [Paragraph("Setting / Credential", th_style), Paragraph("Details & Values", th_style)],
        [Paragraph("<b>Store Website Link</b>", td_style), Paragraph("<b>https://kirana-point.vercel.app</b>", td_bold_style)],
        [Paragraph("<b>Admin Console Link</b>", td_style), Paragraph("<b>https://kirana-point.vercel.app/admin</b>", td_bold_style)],
        [Paragraph("<b>Owner Login Email / Phone</b>", td_style), Paragraph("<b>pratham@kiranapoint.com</b>  (or phone: 8208232735)", td_style)],
        [Paragraph("<b>Admin Password</b>", td_style), Paragraph("<b>admin123</b>", td_style)],
        [Paragraph("<b>Store UPI ID for Customer Payments</b>", td_style), Paragraph("<b>8208232735@axl</b> (Connected directly to your bank account)", td_style)],
    ]
    cred_table = Table(cred_data, colWidths=[180, 340])
    cred_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0, 1), (0, -1), PRIMARY_LIGHT),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(cred_table)
    story.append(Spacer(1, 10))

    # 2. What This Website Does for Your Shop
    story.append(Paragraph("2. What This Website Does for Your Business", h1_style))
    benefits = [
        ("100% Direct UPI Payments to Your Bank:", "When customers pay via Google Pay, PhonePe, or Paytm, the money goes 100% directly into your UPI ID (8208232735@axl). There are zero middleman deductions."),
        ("Zero Platform Commission (0% Cut):", "Unlike corporate apps (Blinkit / Zepto) that charge 15% to 25% cut per order, here 100% of the customer bill and delivery charges stay in your pocket."),
        ("You Own All Your Customer Data:", "You get the full list of your customers' names, phone numbers, and delivery addresses in Khamgaon."),
        ("Automatic Distance-Based Delivery:", "The website automatically calculates road distance from your shop in Khamgaon (₹5/km, Free delivery over ₹2,000)."),
        ("Works on Any Mobile Phone (Like an App):", "Customers can open the website easily on any Android phone or iPhone and tap 'Add to Home Screen' to use it like a mobile app."),
    ]
    for b_title, b_desc in benefits:
        story.append(Paragraph(f"• <b>{b_title}</b> {b_desc}", bullet_style))
    story.append(Spacer(1, 10))

    # 3. How Customers Use the Website
    story.append(Paragraph("3. How Your Customers Shop on Your Website", h1_style))
    steps = [
        ("Step 1: Open Website", "Customers open https://kirana-point.vercel.app on their phone and browse fresh items (Atta, Rice, Dal, Milk, Oils, Vegetables, Snacks)."),
        ("Step 2: Fast Search", "They can type any item name (e.g. 'Tata Salt', 'Amul Butter', 'Aashirvaad Atta') to instantly find it."),
        ("Step 3: Add to Cart", "They tap 'Add' and use '+' / '-' to select 1 kg, 5 kg, packets, or bottles."),
        ("Step 4: Choose Delivery Mode", "They choose between Doorstep Home Delivery in Khamgaon or Store Counter Pickup."),
        ("Step 5: Pay via UPI or Cash", "They tap Google Pay, PhonePe, Paytm, QR Code, or choose Cash on Delivery (COD)."),
        ("Step 6: Live Tracking & WhatsApp", "They see real-time order confirmation and can chat with you on WhatsApp with 1 tap."),
    ]
    for s_title, s_desc in steps:
        story.append(Paragraph(f"• <b>{s_title}:</b> {s_desc}", bullet_style))
    story.append(Spacer(1, 10))

    # 4. How Store Owner Manages the Store
    story.append(Paragraph("4. How You (Store Owner) Manage Orders & Prices (Step-by-Step)", h1_style))
    admin_steps = [
        ("A. How to Log in to Your Admin Panel:", "Open https://kirana-point.vercel.app/admin on your phone/computer. Enter email: <b>pratham@kiranapoint.com</b> and password: <b>admin123</b>. Your Store Dashboard opens immediately!"),
        ("B. How to Check New Customer Orders:", "Tap 'Orders' in your Admin menu. Tap any new order to see customer phone number, delivery address, items ordered, and total bill."),
        ("C. How to Verify UPI Payments:", "If customer paid by UPI, check your UPI app. Then click <b>'Verify Payment ✅'</b> in the admin panel to confirm the order."),
        ("D. How to Update Order Status:", "Click <b>'Mark as Preparing 📦'</b> when packing, <b>'Dispatch Out for Delivery 🚚'</b> when sent with delivery boy, and <b>'Mark as Delivered ✅'</b> when completed."),
        ("E. How to Update Prices & Stock:", "Tap 'Product Catalog' in the Admin menu, tap 'Edit' on any product, change the selling price or stock number, and click 'Save Changes'."),
    ]
    for a_title, a_desc in admin_steps:
        story.append(Paragraph(f"<b>{a_title}</b> {a_desc}", bullet_style))
        story.append(Spacer(1, 3))
    story.append(Spacer(1, 8))

    # 5. Tips to Grow
    story.append(Paragraph("5. Simple Tips to Grow Your Daily Orders in Khamgaon", h1_style))
    tips = [
        ("WhatsApp Status Sharing:", "Share your store link (<b>https://kirana-point.vercel.app</b>) on your WhatsApp status and local Khamgaon groups so regular customers can order anytime."),
        ("Counter QR Code:", "Place a printed board at your shop counter with your website link so walking customers can also order online from home."),
        ("Fast 30-Minute Delivery:", "Deliver local neighbourhood orders quickly to build loyal daily repeat customers."),
    ]
    for t_title, t_desc in tips:
        story.append(Paragraph(f"• <b>{t_title}</b> {t_desc}", bullet_style))

    doc.build(story)
    print(f"PDF created successfully at: {pdf_path}")
    return pdf_path

if __name__ == "__main__":
    create_pdf()

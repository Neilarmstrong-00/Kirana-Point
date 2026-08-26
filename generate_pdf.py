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

    # Custom typography styles
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
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=ACCENT,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
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
    story.append(Spacer(1, 4))
    story.append(Paragraph("Next-Generation Local Grocery E-Commerce & PWA Platform<br/><b>Client Feature Proposal & Technical Capability Presentation</b>", subtitle_style))
    story.append(Spacer(1, 10))

    # Meta Table Card
    meta_rows = [
        [Paragraph("Store Owner / Client:", meta_label_style), Paragraph("<b>Mr. Pratham Tarde</b>", meta_val_style)],
        [Paragraph("Store Location:", meta_label_style), Paragraph("Main Road, Khamgaon, Dist. Buldhana, Maharashtra 444303", meta_val_style)],
        [Paragraph("UPI & WhatsApp:", meta_label_style), Paragraph("<b>8208232735@axl</b> | +91 8208232735", meta_val_style)],
        [Paragraph("Architecture:", meta_label_style), Paragraph("Next.js 14 App Router, TypeScript, TailwindCSS, Firebase Firestore, PWA, Leaflet GPS", meta_val_style)],
    ]
    meta_table = Table(meta_rows, colWidths=[130, 390])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), PRIMARY_LIGHT),
        ('BACKGROUND', (1, 0), (1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # 1. Executive Summary & Business Advantage
    story.append(Paragraph("1. Executive Summary & Commercial Advantage", h1_style))
    story.append(Paragraph(
        "Kirana Point is an enterprise-grade digital storefront built specifically for neighbourhood grocery retail. "
        "It provides store owner <b>Mr. Pratham Tarde</b> with complete independence from quick-commerce corporate apps "
        "(Blinkit, Zepto, Swiggy Instamart) with <b>Zero Commission</b>, <b>Zero Payment Gateway Deductions</b>, and direct bank settlements.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # Comparison Table
    comp_data = [
        [Paragraph("Metric / Feature", th_style), Paragraph("Corporate Apps (Blinkit / Zepto)", th_style), Paragraph("Kirana Point (Your Platform)", th_style)],
        [Paragraph("<b>Platform Commission</b>", td_style), Paragraph("15% - 25% deducted per order", td_style), Paragraph("<b>0% Commission (100% profit retained)</b>", td_bold_style)],
        [Paragraph("<b>Payment Gateway Fees</b>", td_style), Paragraph("2% - 3% gateway deductions", td_style), Paragraph("<b>₹0 Gateway Fees (Direct UPI 8208232735@axl)</b>", td_bold_style)],
        [Paragraph("<b>Customer Relationship</b>", td_style), Paragraph("Locked inside third-party aggregator", td_style), Paragraph("<b>100% Owned by Pratham Tarde</b>", td_bold_style)],
        [Paragraph("<b>Delivery Pricing</b>", td_style), Paragraph("Surge charges & high platform fees", td_style), Paragraph("<b>Transparent ₹5/km (Free over ₹2,000)</b>", td_bold_style)],
        [Paragraph("<b>Customer Support</b>", td_style), Paragraph("Automated robot chat support", td_style), Paragraph("<b>1-Click Direct WhatsApp Chat</b>", td_bold_style)],
    ]
    comp_table = Table(comp_data, colWidths=[120, 200, 200])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (2, 1), (2, -1), PRIMARY_LIGHT),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(comp_table)
    story.append(Spacer(1, 12))

    # 2. Detailed Feature Breakdown
    story.append(Paragraph("2. Comprehensive Feature Breakdown", h1_style))

    sections = [
        ("A. Customer Storefront & Mobile PWA Experience", [
            ("Guest-First Browsing:", "Customers can freely scroll products, view deals, browse categories, and inspect nutrition tables without any forced login barriers upfront."),
            ("Action-Triggered Login Portal:", "When an unauthenticated visitor clicks 'Add to Cart' or 'Proceed to Checkout', a sleek Login / Register portal opens. Once logged in, their pending action immediately executes without repeating!"),
            ("Dedicated Mobile Search Bar:", "Full-width, thumb-friendly search bar with real-time autocomplete across product names, brands, categories, and tags."),
            ("Progressive Web App (PWA):", "Customers can install Kirana Point directly onto their mobile home screen with one tap, functioning like a native Android/iOS app."),
            ("Sticky Mobile Action Bar:", "When browsing product details on mobile phones, a persistent bottom bar allows instant 1-tap cart addition without scrolling back up."),
        ]),
        ("B. Zero-Fee Direct UPI Payment System", [
            ("Direct-to-Bank Settlements:", "All payments route directly into Pratham Tarde's UPI ID (8208232735@axl) with ₹0 middleman fees or deductions."),
            ("UPI Deep Linking (GPay / PhonePe / Paytm):", "Mobile shoppers tap Google Pay, PhonePe, or Paytm buttons which pre-fill the exact order total and payee name automatically."),
            ("Dynamic QR Code Generator:", "Desktop shoppers get an instant QR code scan option that works with any mobile banking or UPI app."),
            ("Payment Verification Queue:", "Customers tap 'I Have Completed Payment', sending the order into the Admin Verification queue for 1-click confirmation."),
            ("Cash on Delivery (COD) Option:", "Customers also have full flexibility to select Cash on Delivery with 1 tap."),
        ]),
        ("C. Precision GPS Distance-Based Delivery Engine", [
            ("Haversine Distance Calculator:", "Measures exact road distance between the Khamgaon store hub (20.6865° N, 76.5654° E) and the customer's delivery pin."),
            ("Transparent Pricing Rules:", "Free delivery automatically applies for orders of ₹2,000 or above, or store pickup. Orders below ₹2,000 are charged ₹5 per kilometer (min ₹20)."),
            ("Interactive Leaflet Map:", "Customers can drag the pin on the map to their exact doorstep or tap 'Use My GPS' for 1-click browser geolocation."),
            ("15km Service Radius Guard:", "Orders beyond the store's 15km delivery perimeter are prompted to choose store pickup, preventing unserviceable deliveries."),
        ]),
        ("D. Open Food Facts Automated Cataloging & Competitor Pricing", [
            ("1-Click Barcode / Product Auto-Fill:", "Store managers can enter a barcode or search term to auto-fetch official descriptions, ingredients, package quantities, and full nutrition tables from the Open Food Facts global database."),
            ("Competitor Price Comparison Widget:", "Each product page features a live comparison showing Kirana Point's low price vs Blinkit, Zepto, BigBasket, and JioMart, highlighting customer savings!"),
        ]),
        ("E. WhatsApp Business Automation", [
            ("1-Click Invoice Notification:", "Formatted WhatsApp invoice drafts with order breakdown, items list, total amount, and delivery address sent directly via wa.me."),
            ("Direct Customer Support:", "A floating WhatsApp button allows customers to connect with the store manager in 1 tap for custom grocery requests or special delivery notes."),
        ]),
        ("F. Complete Store Management Console (Admin Portal)", [
            ("Visual Order Status Pipeline:", "Interactive stepper moving orders through: Confirmed ➔ Packing & Preparing ➔ Out for Delivery ➔ Delivered / Picked Up."),
            ("Payment Verification Panel:", "Dedicated queue highlighting unverified UPI transfers for quick verification."),
            ("Inventory & Low Stock Alerts:", "Real-time indicators warning when essential staples or dairy products drop below threshold."),
            ("Product Catalog Management:", "Full control to add new products, edit pricing/discounts, update images, or toggle stock availability."),
            ("Revenue Analytics & Reports:", "Visual charts tracking daily/weekly sales volume, popular items, and customer transaction counts."),
            ("Store Settings Customizer:", "Easily update delivery rates per km, free delivery thresholds, operating hours, and store coordinates."),
        ]),
    ]

    for title, items in sections:
        story.append(Paragraph(title, h2_style))
        for b_name, b_text in items:
            story.append(Paragraph(f"• <b>{b_name}</b> {b_text}", bullet_style))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 8))

    # 3. Store Credentials Reference Table
    story.append(Paragraph("3. Store Credentials & Access Reference", h1_style))
    cred_data = [
        [Paragraph("User Role", th_style), Paragraph("Login Identifier", th_style), Paragraph("Password", th_style), Paragraph("Target Destination", th_style)],
        [Paragraph("<b>Store Owner (Admin)</b>", td_style), Paragraph("<b>pratham@kiranapoint.com</b><br/>(or mobile: 8208232735)", td_style), Paragraph("<b>admin123</b>", td_style), Paragraph("<b>/admin</b> (Store Console)", td_bold_style)],
        [Paragraph("<b>Customer Account</b>", td_style), Paragraph("Any customer email/phone<br/>(or register new account)", td_style), Paragraph("Customer password", td_style), Paragraph("<b>/</b> (Grocery Storefront)", td_style)],
    ]
    cred_table = Table(cred_data, colWidths=[110, 160, 100, 150])
    cred_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0, 1), (-1, 1), PRIMARY_LIGHT),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(cred_table)
    story.append(Spacer(1, 12))

    # 4. Summary & Next Steps
    story.append(Paragraph("4. Deployment & Launch Roadmap", h1_style))
    story.append(Paragraph(
        "1. <b>GitHub Source Code</b>: Successfully committed and pushed to <code>https://github.com/Neilarmstrong-00/Kirana-Point.git</code>.<br/>"
        "2. <b>Vercel Production Hosting</b>: 1-click deployable on Vercel with automatic global CDN caching and SSL certificates.<br/>"
        "3. <b>Zero Technical Complexity for Store Owner</b>: Mr. Pratham Tarde can easily manage orders, track payments, and update prices from any mobile phone or computer.",
        body_style
    ))

    doc.build(story)
    print(f"PDF created successfully at: {pdf_path}")
    return pdf_path

if __name__ == "__main__":
    create_pdf()

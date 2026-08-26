import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'))

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_docx():
    doc = Document()

    # Set page margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    PRIMARY = RGBColor(45, 122, 58)      # Emerald green #2D7A3A
    ACCENT = RGBColor(194, 94, 0)        # Amber accent #C25E00
    DARK = RGBColor(30, 41, 59)          # Slate #1E293B

    # Document Header Title
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title_p.add_run("🛒 KIRANA POINT")
    title_run.font.name = "Georgia"
    title_run.font.size = Pt(26)
    title_run.font.bold = True
    title_run.font.color.rgb = PRIMARY

    sub_p = doc.add_paragraph()
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub_run = sub_p.add_run("Your Store Is Now Online!\nOwner Guide & Feature Handbook for Mr. Pratham Tarde")
    sub_run.font.name = "Calibri"
    sub_run.font.size = Pt(13)
    sub_run.font.color.rgb = DARK

    # Meta Info Card Table
    meta_table = doc.add_table(rows=4, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Store Name & Owner:", "Kirana Point — Mr. Pratham Tarde"),
        ("Store Address:", "Main Road, Khamgaon, Dist. Buldhana, Maharashtra 444303"),
        ("Live Website Link:", "https://kirana-point.vercel.app"),
        ("Store UPI & WhatsApp:", "8208232735@axl  |  +91 8208232735"),
    ]
    for idx, (label, val) in enumerate(meta_data):
        row = meta_table.rows[idx]
        cell_0 = row.cells[0]
        cell_1 = row.cells[1]
        
        cell_0.width = Inches(2.2)
        cell_1.width = Inches(4.5)
        
        p0 = cell_0.paragraphs[0]
        r0 = p0.add_run(label)
        r0.font.bold = True
        r0.font.size = Pt(10)
        r0.font.color.rgb = PRIMARY
        
        p1 = cell_1.paragraphs[0]
        r1 = p1.add_run(val)
        r1.font.size = Pt(10)
        r1.font.color.rgb = DARK
        if "https://" in val:
            r1.font.bold = True
        
        set_cell_background(cell_0, "F0FDF4")
        set_cell_background(cell_1, "F8FAFC")
        set_cell_margins(cell_0, top=100, bottom=100, left=150, right=150)
        set_cell_margins(cell_1, top=100, bottom=100, left=150, right=150)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # 1. Store Owner Login Credentials (HIGHLIGHTED FIRST)
    h1 = doc.add_heading("1. Your Store Owner Login Credentials", level=1)
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(4)

    p_intro = doc.add_paragraph()
    p_intro.add_run("Keep these login details safe. You will use them to open your store admin panel, manage products, check incoming customer orders, and verify UPI payments.")

    cred_table = doc.add_table(rows=5, cols=2)
    cred_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cred_info = [
        ("Store Website Link", "https://kirana-point.vercel.app"),
        ("Admin Portal Direct Link", "https://kirana-point.vercel.app/admin"),
        ("Login Email / Phone", "pratham@kiranapoint.com  (or your phone: 8208232735)"),
        ("Admin Password", "admin123"),
        ("Your Direct UPI ID for Payments", "8208232735@axl  (Linked to your bank account)"),
    ]
    for idx, (lbl, val) in enumerate(cred_info):
        row = cred_table.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.5)
        c1.width = Inches(4.2)
        
        p0 = c0.paragraphs[0]
        r0 = p0.add_run(lbl)
        r0.font.bold = True
        r0.font.size = Pt(10)
        r0.font.color.rgb = PRIMARY
        
        p1 = c1.paragraphs[0]
        r1 = p1.add_run(val)
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = DARK
        
        set_cell_background(c0, "F0FDF4")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, top=100, bottom=100, left=140, right=140)
        set_cell_margins(c1, top=100, bottom=100, left=140, right=140)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # 2. What This Online Store Does for You
    h1 = doc.add_heading("2. What This Website Does for Your Shop", level=1)
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(4)

    benefits = [
        ("100% Direct UPI Payments to Your Bank:", "When customers pay online using Google Pay, PhonePe, or Paytm, the money goes 100% directly into your UPI ID (8208232735@axl). There are no third-party cut fees or commission charges."),
        ("Zero Platform Commission (0% Cut):", "Unlike apps like Blinkit or Zepto that take 15% to 25% of your money, here 100% of your selling price and delivery charge stays in your pocket."),
        ("You Own All Your Customers:", "You have the full list of your customers' names, phone numbers, and delivery addresses in Khamgaon. No middleman controls your business."),
        ("Automatic Distance-Based Delivery:", "The website automatically calculates the exact road distance from your shop in Khamgaon to the customer's home (₹5 per kilometer, Free delivery over ₹2,000)."),
        ("Works on Any Mobile Phone (Like an App):", "Customers and you can open the website on Android phones or iPhones, and even tap 'Add to Home Screen' to use it like a mobile app."),
    ]

    for title, desc in benefits:
        bp = doc.add_paragraph(style='List Bullet')
        r_title = bp.add_run(title + " ")
        r_title.font.bold = True
        r_title.font.size = Pt(10)
        r_title.font.color.rgb = PRIMARY
        r_desc = bp.add_run(desc)
        r_desc.font.size = Pt(10)
        r_desc.font.color.rgb = DARK

    # 3. How Your Customers Use the Website
    h1 = doc.add_heading("3. How Your Customers Shop on Your Website", level=1)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(4)

    customer_steps = [
        ("Step 1: Open Website & Browse Items", "Customers open https://kirana-point.vercel.app on their phone. They can easily scroll through Atta, Rice, Dal, Milk, Oil, Masalas, Snacks, and Fresh Vegetables."),
        ("Step 2: Search or Filter", "They can type in the search box (e.g. 'Tata Salt', 'Amul Butter', 'Aashirvaad Atta') to instantly find what they need."),
        ("Step 3: Add to Cart", "They tap 'Add' and use the '+' or '-' buttons to choose their desired quantity (1 kg, 5 kg, 1 liter, packets, etc.)."),
        ("Step 4: Choose Delivery or Pickup", "They select whether they want Doorstep Home Delivery in Khamgaon or Store Counter Pickup."),
        ("Step 5: Pay via UPI or Cash on Delivery", "They can tap Google Pay, PhonePe, or Paytm to pay directly to your UPI ID, or choose Cash on Delivery (COD)."),
        ("Step 6: Live Tracking & WhatsApp Receipt", "They receive an instant order summary and can message your store directly on WhatsApp in 1 tap."),
    ]

    for title, desc in customer_steps:
        bp = doc.add_paragraph(style='List Bullet')
        r_title = bp.add_run(title + ": ")
        r_title.font.bold = True
        r_title.font.size = Pt(10)
        r_title.font.color.rgb = ACCENT
        r_desc = bp.add_run(desc)
        r_desc.font.size = Pt(10)
        r_desc.font.color.rgb = DARK

    # 4. How You (Store Owner) Manage Orders & Products
    h1 = doc.add_heading("4. How to Manage Your Store Daily (Step-by-Step)", level=1)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(4)

    admin_guides = [
        ("A. How to Log in to Your Admin Dashboard", "1. Open the website on your phone or computer.\n2. Tap 'Admin' in the top corner or go to /admin.\n3. Enter: pratham@kiranapoint.com and password: admin123.\n4. Your Store Dashboard will open showing total sales, pending orders, and low stock alerts."),
        ("B. How to Check & Process New Customer Orders", "1. Tap 'Orders' in your Admin menu.\n2. You will see new orders marked as 'Awaiting Payment' or 'Order Placed'.\n3. Tap on any order to see the full customer bill, items list, customer phone number, and delivery address.\n4. If the customer paid by UPI, check your UPI app (GPay/PhonePe). Once confirmed, click 'Verify Payment ✅'."),
        ("C. How to Update Order Status (Dispatching)", "1. When you start packing items in your shop, click 'Mark as Preparing 📦'.\n2. When your delivery person leaves to deliver, click 'Dispatch Out for Delivery 🚚'.\n3. When delivered, click 'Mark as Delivered ✅'. (The customer's screen updates automatically!)."),
        ("D. How to Change Prices or Stock Quantities", "1. Tap 'Product Catalog' in the Admin menu.\n2. Tap 'Edit' on any item (e.g. Tata Salt or Fortune Oil).\n3. Change the Selling Price or update the Stock Quantity.\n4. Click 'Save Changes' — your website updates instantly!"),
        ("E. How to Add a New Product to Your Store", "1. Tap 'Add New Product'.\n2. Enter product name, brand, category, MRP, and your selling price.\n3. Click Save — the new item immediately appears for customers to buy."),
    ]

    for title, desc in admin_guides:
        h2 = doc.add_heading(title, level=2)
        h2.paragraph_format.space_before = Pt(8)
        h2.paragraph_format.space_after = Pt(2)
        p = doc.add_paragraph()
        r = p.add_run(desc)
        r.font.size = Pt(9.5)
        r.font.color.rgb = DARK

    # 5. Tips to Grow Your Local Business
    h1 = doc.add_heading("5. Simple Tips to Grow Your Orders in Khamgaon", level=1)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(4)

    tips = [
        ("Share on WhatsApp Status & Groups:", "Post your store link (https://kirana-point.vercel.app) on your WhatsApp status and local Khamgaon community groups so regular customers can order anytime."),
        ("Print a QR Code on Your Counter:", "Put a small board on your counter saying 'Order Online from Home: https://kirana-point.vercel.app'."),
        ("Offer Same-Day Delivery:", "Deliver local orders within 30-45 minutes to build trusted, loyal neighbourhood customers."),
    ]
    for title, desc in tips:
        bp = doc.add_paragraph(style='List Bullet')
        r_title = bp.add_run(title + " ")
        r_title.font.bold = True
        r_title.font.size = Pt(10)
        r_title.font.color.rgb = PRIMARY
        r_desc = bp.add_run(desc)
        r_desc.font.size = Pt(10)
        r_desc.font.color.rgb = DARK

    docx_path = "D:\\Project Files\\Client Projects\\Kirana Point\\Kirana_Point_Client_Feature_Presentation.docx"
    doc.save(docx_path)
    print(f"DOCX created successfully at: {docx_path}")
    return docx_path

if __name__ == "__main__":
    create_docx()

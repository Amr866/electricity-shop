"""
End-to-End Test Suite for Electricity Shop Checkout Flow with Corporate Dual Invoicing.
Uses Playwright to verify:
1. Corporate Invoicing Dynamic Form Toggling & Validation Guards
2. Personal Invoice Checkout (B2C Flow)
3. Corporate Invoice Checkout & Official Tax Invoice Generation (B2B Flow)
4. Payment gateway integration and order invoice rendering
"""

import sys
import json
import time
from playwright.sync_api import sync_playwright, expect

# Ensure immediate unbuffered output
sys.stdout.reconfigure(line_buffering=True)

BASE_URL = "http://127.0.0.1:3000"

SAMPLE_CART_ITEM = [
    {
        "id": "cmtezo5ay0001opc9xay25wan",
        "name": "موتور کولر آبی موتوژن ۳/۴ اسب بخار دو خازنه اصل تبریز (سیم‌پیچی مس)",
        "slug": "cooler-motor-motogen-3-4",
        "basePrice": 4150000,
        "price": 4150000,
        "image": "/images/products/cooler-motor.png",
        "quantity": 1,
        "stock": 10,
    }
]

def seed_cart(page):
    """Seed cart in localStorage and navigate to checkout."""
    page.goto(f"{BASE_URL}/")
    page.wait_for_load_state("networkidle")
    cart_json = json.dumps(SAMPLE_CART_ITEM)
    page.evaluate(f"localStorage.setItem('shiasi_cart_v1', '{cart_json}');")
    page.goto(f"{BASE_URL}/checkout")
    page.wait_for_load_state("networkidle")

def test_corporate_form_toggle_and_validation(page):
    print("\n--- Test 1: Corporate Invoicing Toggle & Validation Guard ---", flush=True)
    seed_cart(page)

    # Verify initial state: Corporate fields should NOT be visible
    company_input = page.locator("input[placeholder='نام شرکت']")
    expect(company_input).to_have_count(0)
    print("✓ Initial state confirmed: Corporate fields hidden by default", flush=True)

    # Click the Corporate Invoice checkbox
    corp_checkbox = page.locator("input[type='checkbox']")
    corp_checkbox.check()
    
    # Assert corporate fields appear dynamically
    company_input = page.locator("input[placeholder='نام شرکت']")
    national_input = page.locator("input[placeholder='شناسه ملی ۱۱ رقمی']")
    economic_input = page.locator("input[placeholder='کد اقتصادی ۱۲ رقمی']")
    
    expect(company_input).to_be_visible()
    expect(national_input).to_be_visible()
    expect(economic_input).to_be_visible()
    print("✓ Corporate fields dynamically appeared upon checking official invoice checkbox", flush=True)

    # Fill basic details but leave corporate credentials empty to test validation guard
    page.fill("input[placeholder*='علیرضا شیاسی']", "آزمون‌گر سیستم")
    page.fill("input[placeholder='۰۹۱۳۲۴۵۶۷۸۹']", "09131234567")
    page.fill("textarea[placeholder*='نجف‌آباد']", "اصفهان، نجف‌آباد، خیابان شریعتی، بن‌بست نسترن، پلاک ۱۲")

    # Verify HTML5 form validity prevents submission when mandatory corporate fields are blank
    is_valid = company_input.evaluate("el => el.checkValidity()")
    assert not is_valid, "Company name should be invalid when required and blank"
    
    # Target the checkout submit button unambiguously
    submit_btn = page.locator("button.bg-amber-500[type='submit']")

    # Disable HTML5 validation on the checkout form specifically to test React state validation
    submit_btn.evaluate("btn => btn.closest('form').noValidate = true")
    submit_btn.click()

    # Verify validation error is triggered
    error_banner = page.locator(".bg-rose-50, .text-rose-500, p:has-text('الزامی')")
    expect(error_banner.first).to_be_visible()
    print("✓ Validation guard verified: Incomplete corporate invoice cannot be submitted", flush=True)

def test_personal_invoice_checkout(page):
    print("\n--- Test 2: Standard Personal (B2C) Checkout Flow ---", flush=True)
    seed_cart(page)

    # Fill customer info
    page.fill("input[placeholder*='علیرضا شیاسی']", "محمد حسینی")
    page.fill("input[placeholder='۰۹۱۳۲۴۵۶۷۸۹']", "09131112233")
    page.fill("textarea[placeholder*='نجف‌آباد']", "اصفهان، نجف‌آباد، خیابان میرداماد، فرعی ۲، پلاک ۸")

    # Ensure corporate is unchecked
    corp_checkbox = page.locator("input[type='checkbox']")
    if corp_checkbox.is_checked():
        corp_checkbox.uncheck()

    # Select Zarinpal payment option
    page.locator("label:has-text('پرداخت اینترنتی')").click()

    # Submit order
    submit_btn = page.locator("button.bg-amber-500[type='submit']")
    submit_btn.click()
    page.wait_for_url("**/zarinpal-mock**", timeout=20000)
    print("✓ Personal order created and redirected to Zarinpal gateway mock", flush=True)

    # In Zarinpal Mock, approve payment
    page.locator("button:has-text('پرداخت موفق')").click()
    page.wait_for_url("**/order-tracking/**", timeout=20000)
    print("✓ Payment approved and redirected to Order Tracking & Invoice page", flush=True)

    # Verify Invoice details for personal buyer
    expect(page.locator("text=محمد حسینی").first).to_be_visible()
    expect(page.locator("text=شرکت:").first).to_have_count(0)
    expect(page.locator("text=شناسه ملی:").first).to_have_count(0)
    print("✓ Personal invoice verified: Buyer name displayed without corporate fields", flush=True)

def test_corporate_invoice_checkout(page):
    print("\n--- Test 3: Complete Corporate (B2B) Dual Invoicing Flow ---", flush=True)
    seed_cart(page)

    # Fill personal contact info
    page.fill("input[placeholder*='علیرضا شیاسی']", "مهندس امیرحسین باقری")
    page.fill("input[placeholder='۰۹۱۳۲۴۵۶۷۸۹']", "09139876543")
    page.fill("textarea[placeholder*='نجف‌آباد']", "اصفهان، شهرک صنعتی نجف‌آباد ۲، بلوار پژوهش، پلاک ۱۰۱")

    # Enable Corporate Invoice
    corp_checkbox = page.locator("input[type='checkbox']")
    if not corp_checkbox.is_checked():
        corp_checkbox.check()

    # Fill mandatory corporate credentials
    page.fill("input[placeholder='نام شرکت']", "شرکت صنایع الکترونیک زاینده‌رود")
    page.fill("input[placeholder='شناسه ملی ۱۱ رقمی']", "10103456789")
    page.fill("input[placeholder='کد اقتصادی ۱۲ رقمی']", "411123456789")
    print("✓ Corporate credentials filled: Company Name, National Code, Economic Code", flush=True)

    # Select Zarinpal online gateway
    page.locator("label:has-text('پرداخت اینترنتی')").click()

    # Submit order
    submit_btn = page.locator("button.bg-amber-500[type='submit']")
    submit_btn.click()
    page.wait_for_url("**/zarinpal-mock**", timeout=20000)
    print("✓ Corporate order successfully created and redirected to Gateway", flush=True)

    # In Zarinpal Mock, complete payment
    page.locator("button:has-text('پرداخت موفق')").click()
    page.wait_for_url("**/order-tracking/**", timeout=20000)
    print("✓ Gateway callback processed, Order Tracking & Official Invoice loaded", flush=True)

    # Verify Official Invoice fields
    invoice = page.locator("#printable-invoice")
    expect(invoice).to_be_visible()

    expect(invoice.locator("text=مهندس امیرحسین باقری")).to_be_visible()
    expect(invoice.locator("text=شرکت صنایع الکترونیک زاینده‌رود")).to_be_visible()
    expect(invoice.locator("text=10103456789")).to_be_visible()
    expect(invoice.locator("text=411123456789")).to_be_visible()
    print("✓ Official Tax Invoice confirmed: Company Name, National ID, and Economic Code all present", flush=True)

    # Capture visual screenshot of the corporate invoice
    page.screenshot(path="tests/e2e/corporate_invoice_proof.png", full_page=True)
    print("✓ Screenshot captured at tests/e2e/corporate_invoice_proof.png", flush=True)

def main():
    print("Starting Playwright E2E Checkout & Corporate Dual Invoicing Test Suite...", flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="msedge")
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        try:
            test_corporate_form_toggle_and_validation(page)
            test_personal_invoice_checkout(page)
            test_corporate_invoice_checkout(page)
            print("\n========================================================", flush=True)
            print("ALL END-TO-END CHECKOUT & CORPORATE INVOICING TESTS PASSED!", flush=True)
            print("========================================================", flush=True)
        finally:
            browser.close()

if __name__ == "__main__":
    main()

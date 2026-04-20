import requests
import json
from supabase import create_client
from dotenv import load_dotenv
import os

# ============================================================
# HireSense — Apple Internship Scraper (Phase 1)
# Source: SimplifyJobs Summer2026 listings.json
# Fills: companies, job_postings tables
# ============================================================

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def scrape_apple_postings():
    print("Fetching listings.json from GitHub...")

    url = "https://raw.githubusercontent.com/SimplifyJobs/Summer2026-Internships/dev/.github/scripts/listings.json"
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Failed to fetch listings.json: {response.status_code}")
        return []

    listings = json.loads(response.text)
    print(f"Total listings in repo: {len(listings)}")

    apple_postings = []

    for listing in listings:
        company = listing.get("company_name", "")

        # Filter for Apple only
        if "apple" not in company.lower():
            continue

        title = listing.get("title", "")
        locations = listing.get("locations", [])
        location = ", ".join(locations) if locations else "Unknown"
        apply_url = listing.get("url", "")
        is_active = listing.get("active", False)

        apple_postings.append({
            "company": company,
            "role": title,
            "location": location,
            "apply_url": apply_url,
            "is_active": is_active
        })

        status = "Active" if is_active else "Closed"
        print(f"  [{status}] {title} — {location}")

    print(f"\nTotal Apple postings found: {len(apple_postings)}")
    active = sum(1 for p in apple_postings if p["is_active"])
    print(f"Active: {active} | Closed: {len(apple_postings) - active}")
    return apple_postings


def get_or_create_company():
    print("\nChecking companies table...")
    existing = supabase.table("companies").select("id").eq("name", "Apple").execute()

    if existing.data:
        company_id = existing.data[0]["id"]
        print(f"Apple already exists (id: {company_id})")
        return company_id

    result = supabase.table("companies").insert({
        "name": "Apple",
        "description": "Multinational technology company that designs and develops consumer electronics, software, and online services.",
        "industry": "Technology",
        "linkedin_url": "https://linkedin.com/company/apple",
        "careers_url": "https://jobs.apple.com",
        "headquarters": "Cupertino, CA"
    }).execute()

    company_id = result.data[0]["id"]
    print(f"Inserted Apple (id: {company_id})")
    return company_id


def insert_postings(postings, company_id):
    if not postings:
        print("No postings to insert.")
        return

    print(f"\nInserting {len(postings)} postings into job_postings...")
    inserted = 0
    skipped = 0
    errors = 0

    for posting in postings:
        try:
            supabase.table("job_postings").insert({
                "company_id": company_id,
                "title": posting["role"],
                "location": posting["location"],
                "season": "Summer",
                "year": 2026,
                "apply_url": posting["apply_url"],
                "source": "simplify_github",
                "is_active": posting["is_active"]
            }).execute()
            print(f"  Inserted: {posting['role']} - {posting['location']}")
            inserted += 1

        except Exception as e:
            err = str(e).lower()
            if "duplicate" in err or "unique" in err or "23505" in err:
                print(f"  Skipped (duplicate): {posting['role']}")
                skipped += 1
            else:
                print(f"  Error: {posting['role']} - {e}")
                errors += 1

    print(f"\nDone! Inserted: {inserted} | Skipped: {skipped} | Errors: {errors}")


if __name__ == "__main__":
    postings = scrape_apple_postings()
    if postings:
        company_id = get_or_create_company()
        insert_postings(postings, company_id)
    else:
        print("No Apple postings found.")
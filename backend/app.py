from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3001", "http://localhost:3000"])

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

@app.route('/companies/trending', methods=['GET'])
def get_trending_companies():
    response = supabase.table("companies").select("id, name").execute()
    return jsonify(response.data)

@app.route('/companies/search', methods=['GET'])
def search_companies():
    query = request.args.get('q', '')
    response = supabase.table("companies").select("id, name").ilike("name", f"%{query}%").execute()
    return jsonify(response.data)

@app.route('/companies/<int:company_id>', methods=['GET'])
def get_company(company_id):
    response = supabase.table("companies").select("*").eq("id", company_id).execute()
    if response.data:
        return jsonify(response.data[0])
    return jsonify({ "error": "Company not found" }), 404

@app.route('/companies/<int:company_id>/postings', methods=['GET'])
def get_company_postings(company_id):
    response = supabase.table("job_postings").select("*").eq("company_id", company_id).eq("is_active", True).execute()
    return jsonify(response.data)

@app.route('/postings/<int:posting_id>', methods=['GET'])
def get_posting(posting_id):
    posting = supabase.table("job_postings").select("*").eq("id", posting_id).execute()
    skills = supabase.table("required_skills").select("*").eq("posting_id", posting_id).execute()
    analysis = supabase.table("posting_analysis").select("*").eq("posting_id", posting_id).execute()
    reviews = supabase.table("intern_reviews").select("*").eq("company_id", posting_id).execute()
    flags = supabase.table("legitimacy_flags").select("*").eq("posting_id", posting_id).execute()

    return jsonify({
        "posting": posting.data[0] if posting.data else None,
        "skills": skills.data,
        "analysis": analysis.data[0] if analysis.data else None,
        "reviews": reviews.data,
        "flags": flags.data
    })

@app.route('/postings/recent', methods=['GET'])
def get_recent_postings():
    response = supabase.table("job_postings").select("id, title, company_id, companies(name)").eq("is_active", True).order("created_at", desc=True).limit(5).execute()
    return jsonify(response.data)

@app.route('/companies/<int:company_id>/reputation', methods=['GET'])
def get_company_reputation(company_id):
    response = supabase.table("company_reputation").select("*").eq("company_id", company_id).execute()
    if response.data:
        return jsonify(response.data[0])
    return jsonify({ "error": "No reputation data found" }), 404

@app.route('/companies/<int:company_id>/interview-questions', methods=['GET'])
def get_interview_questions(company_id):
    response = supabase.table("interview_questions").select("*").eq("company_id", company_id).execute()
    return jsonify(response.data)

if __name__ == '__main__':
    app.run(debug=True)
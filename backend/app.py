from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.route('/companies/trending', methods=['GET'])
def get_trending_companies():
    return jsonify([
        { "id": 1, "name": "Google" },
        { "id": 2, "name": "Meta" },
        { "id": 3, "name": "Microsoft" }
    ])

if __name__ == '__main__':
    app.run(debug=True)
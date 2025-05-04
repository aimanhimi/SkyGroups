from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
from bson import ObjectId
import uuid
import json

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173"]}})

# MongoDB connection
mongo_uri = os.getenv('MONGO_URI')
try:
    client = MongoClient(mongo_uri)
    # Test the connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB")
    db = client[os.getenv('DB_NAME')]
    group_trips_collection = db['groupTrips']
except Exception as e:
    print(f"Failed to connect to MongoDB: {str(e)}")
    raise e

# Custom JSON encoder for MongoDB ObjectID and dates
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super(JSONEncoder, self).default(obj)

app.json_encoder = JSONEncoder

# Routes
@app.route('/api/group-trip', methods=['POST'])
def create_group_trip():
    data = request.get_json()
    print(f"Received create request with data: {data}")  # Debug log
    
    if not data or 'groupCode' not in data or 'numUsers' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        # Check if group already exists
        existing_group = group_trips_collection.find_one({"groupTripId": data['groupCode']})
        if existing_group:
            return jsonify({"error": "Group code already exists"}), 409
            
        group_trip = {
            "groupTripId": data['groupCode'],
            "num_users": data['numUsers'],
            "users": [],
            "createdAt": datetime.utcnow()
        }
        
        result = group_trips_collection.insert_one(group_trip)
        print(f"Created group trip with ID: {result.inserted_id}")  # Debug log
        
        return jsonify({
            "success": True,
            "id": str(result.inserted_id),
            "groupCode": data['groupCode']
        }), 201
        
    except Exception as e:
        print(f"Error creating group: {str(e)}")  # Debug log
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/group-trip/<string:group_code>', methods=['GET'])
def get_group_trip(group_code):
    group_trip = group_trips_collection.find_one({"groupTripId": group_code})
    
    if not group_trip:
        return jsonify({"error": "Group trip not found"}), 404
    
    return jsonify({
        "groupTripId": group_trip["groupTripId"],
        "num_users": group_trip["num_users"],
        "users": group_trip["users"],
        "exists": True
    })

@app.route('/api/group-trip/<string:group_code>/preferences', methods=['POST'])
def update_preferences(group_code):
    data = request.get_json()
    print(f"Received preferences update for group {group_code}:", data)  # Debug log
    
    if not data or 'userId' not in data:
        return jsonify({"error": "User ID is required"}), 400
    
    try:
        group_trip = group_trips_collection.find_one({"groupTripId": group_code})
        print(f"Found group trip:", group_trip)  # Debug log
        
        if not group_trip:
            return jsonify({"error": "Group trip not found"}), 404
        
        # Create or update user preferences
        user_data = {
            "userId": data["userId"],
            "from": data.get("from", ""),
            "destinationIdeas": data.get("destinationIdeas", []),
            "dates": data.get("dates", {"start": None, "end": None}),
            "interests": data.get("interests", []),
            "budget": data.get("budget", {"min": 0, "max": 0, "currency": "EUR"}),
            "completed": data.get("completed", False),
            "updatedAt": datetime.utcnow()
        }
        
        # Check if user already exists in the group
        user_exists = False
        for i, user in enumerate(group_trip["users"]):
            if user["userId"] == data["userId"]:
                # Update existing user
                group_trip["users"][i] = user_data
                user_exists = True
                print(f"Updating existing user:", user_data)  # Debug log
                break
        
        if not user_exists:
            # Add new user
            group_trip["users"].append(user_data)
            print(f"Adding new user:", user_data)  # Debug log
        
        # Update the document in MongoDB
        result = group_trips_collection.update_one(
            {"groupTripId": group_code},
            {"$set": {"users": group_trip["users"]}}
        )
        
        print(f"MongoDB update result:", result.modified_count)  # Debug log
        
        if result.modified_count == 0:
            return jsonify({"error": "Failed to update preferences"}), 500
        
        return jsonify({"success": True})

    except Exception as e:
        print(f"Error updating preferences: {str(e)}")  # Debug log
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/group-trip/<string:group_code>/status', methods=['GET'])
def get_group_status(group_code):
    try:
        print(f"Getting status for group: {group_code}")  # Debug log
        
        # Find the group trip document
        group_trip = group_trips_collection.find_one({"groupTripId": group_code})
        print(f"Found group trip: {group_trip}")  # Debug log
        
        if not group_trip:
            print(f"Group not found: {group_code}")  # Debug log
            return jsonify({"error": "Group trip not found"}), 404
        
        # Count completed users
        completed_users = len([user for user in group_trip["users"] if user.get("completed", False)])
        total_users = group_trip["num_users"]
        
        # Check if all users have completed
        all_completed = completed_users == total_users
        
        response_data = {
            "completed": completed_users,
            "total": total_users,
            "allCompleted": all_completed,
            "users": [
                {
                    "userId": user["userId"],
                    "completed": user.get("completed", False)
                } for user in group_trip["users"]
            ]
        }
        print(f"Returning status: {response_data}")  # Debug log
        
        return jsonify(response_data)

    except Exception as e:
        print(f"Error getting group status: {str(e)}")  # Debug log
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/group-trip/<string:group_code>/suggestions', methods=['GET'])
def get_suggestions(group_code):
    group_trip = group_trips_collection.find_one({"groupTripId": group_code})
    
    if not group_trip:
        return jsonify({"error": "Group trip not found"}), 404
    
    # In a real app, this would analyze the preferences and generate destination suggestions
    # For now, we'll return mock data
    
    # Mock destination suggestions
    suggestions = [
        {
            "id": str(uuid.uuid4()),
            "name": "Barcelona, Spain",
            "image": "https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg",
            "description": "A vibrant city with stunning architecture, beautiful beaches, and amazing food.",
            "interests": ["Culture", "Beach", "Nightlife", "Food"],
            "price": "€€",
            "likes": 0,
            "dislikes": 0
        },
        # Add more destination suggestions here...
    ]
    
    return jsonify(suggestions)

@app.route('/api/group-trip/<string:group_code>/votes', methods=['POST'])
def save_votes(group_code):
    data = request.get_json()
    
    if not data or 'results' not in data:
        return jsonify({"error": "Missing votes data"}), 400
    
    group_trip = group_trips_collection.find_one({"groupTripId": group_code})
    
    if not group_trip:
        return jsonify({"error": "Group trip not found"}), 404
    
    # Update the group trip with voting results
    result = group_trips_collection.update_one(
        {"groupTripId": group_code},
        {"$set": {"votingResults": data["results"]}}
    )
    
    if result.modified_count == 0:
        return jsonify({"error": "Failed to save votes"}), 500
    
    return jsonify({"success": True})

@app.route('/api/group-trip/<string:group_code>/results', methods=['GET'])
def get_results(group_code):
    group_trip = group_trips_collection.find_one({"groupTripId": group_code})
    
    if not group_trip:
        return jsonify({"error": "Group trip not found"}), 404
    
    # In a real app, this would analyze the votes and generate final results
    # For now, we'll return mock data
    
    # Mock results
    results = [
        {
            "id": 1,
            "rank": 1,
            "name": "Barcelona, Spain",
            "image": "https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg",
            "description": "A vibrant city with stunning architecture, beautiful beaches, and amazing food.",
            "interests": ["Culture", "Beach", "Nightlife", "Food"],
            "price": "€€",
            "matchScore": 92,
            "votes": {"likes": 5, "dislikes": 1}
        },
        # Add more results here...
    ]
    
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
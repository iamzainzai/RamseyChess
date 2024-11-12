from flask import Blueprint, request, jsonify
from data_access.user_manager import UserProfileManager

profile_routes = Blueprint('profle_routes', __name__)

@profile_routes.route('/get_player_data', methods=['POST'])
def get_player_data():
  """Subscribes the player if not in the database, and returns its data as the emty set , else retrieves its chess bots data"""
  data = request.json

  oauth_sub = data.get("sub", None)
  manager   = UserProfileManager()
  manager.load_one_by_sub(oauth_sub)
  
  user_mongo_data = manager.getCurrent()
  if user_mongo_data:
    return jsonify(user_mongo_data)
  else:
    return jsonify({})

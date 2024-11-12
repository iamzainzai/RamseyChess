from flask import Blueprint, request, jsonify
from data_access.user_manager import UserProfileManager, UserProfileDoc
from bson.objectid import ObjectId
from typing import Any

profile_routes = Blueprint('profle_routes', __name__)

@profile_routes.route('/get_player_data', methods=['POST'])
def get_player_data() -> Any:
  """Subscribes the player if not in the database, and returns its data as the emty set , else retrieves its chess bots data"""
  data = request.json
  if data:
    oauth_sub = data.get("sub", None)
    nickname  = data.get("nickname", None)
    username  = data.get("username", None)

  manager   = UserProfileManager()

  if manager.load_one_by_sub(oauth_sub):
    user_mongo_data = manager.getCurrent()
    return jsonify(user_mongo_data) , 200
  
  else:
    new_user : UserProfileDoc = UserProfileDoc(
        _id=ObjectId(),  # Generate a new ObjectId
        sub=oauth_sub,
        nickname=nickname,
        username=username,
        elo=1000,
        strategies=[],
        last_login=None
    )

  if manager.add_user(new_user):
    manager.load_one_by_sub(oauth_sub)
    user_mongo_data = manager.getCurrent()
    return jsonify(user_mongo_data) , 200
  else:
    return jsonify({"ERROR": "COULD NOT CREATE USER"}) , 400

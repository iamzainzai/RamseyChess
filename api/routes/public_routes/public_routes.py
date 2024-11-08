from flask import Blueprint, jsonify
from data_access.material_manager import EvaluateMaterialManager
from data_access.danger_manager import EvaluateDangerManager
from data_access.strategy_cards_manager import AiPremadeStratDoc, AiPremadeManager
import sys

public_routes = Blueprint('public_routes', __name__)

@public_routes.route('/get_strategies', methods=['GET'])
def get_strategies():
  pm = AiPremadeManager()
  public_strats = pm.getNullOwner()
  print(public_strats, file=sys.stdout)
  return jsonify({
    "strategies" : public_strats
  })

@public_routes.route('/get_strategies_expand', methods=['GET'])
def get_strategies_expand():
  pm = AiPremadeManager()
  public_strats = pm.getNullOwner()

  print(public_strats, file=sys.stdout)
  return public_strats


@public_routes.route('/get_evaluators', methods=['GET'])
def get_evaluators():
  """
  Retrieve all evaluators with a null owner.
  This endpoint returns two lists: one for material evaluators and one for danger evaluators,
  both of which have no assigned owner.
  ---
  responses:
    200:
      description: A JSON object containing lists of material and danger evaluators with no owner.
      schema:
        type: object
        properties:
          material_evaluators:
            type: array
            items:
              type: object
              description: A list of material evaluators with null owner.
          danger_evaluators:
            type: array
            items:
              type: object
              description: A list of danger evaluators with null owner.
  """
  em = EvaluateMaterialManager()
  ed = EvaluateDangerManager()

  public_ems = em.getNullOwner()
  public_eds = ed.getNullOwner()

  return jsonify({
    "material_evaluators" : public_ems,
    "danger_evaluators": public_eds
  })

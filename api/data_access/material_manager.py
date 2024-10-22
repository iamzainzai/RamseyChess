from data_access.connector import db
from dataclasses import dataclass , asdict
from bson.objectid import ObjectId
from typing import Dict , Optional
import json
from bson.json_util import dumps

@dataclass
class EvaluateMaterialDoc:
    _id           : ObjectId
    name          : str
    ownPieces     : Dict[str, float]
    opponentPieces: Dict[str, float]
    owner         : Optional[str] = None #UUID



class EvaluateMaterialManager():
    def __init__(self) -> None:
        self.docs = db.get_collection('evaluate_material')
        #Current doc that can be modified in memory
        self.current_doc = None

    def loadOne(self, name : str, owner=None):
        filter = {"name": name}  
        if owner is not None:
            filter["owner"] = owner
        
        self.current_doc = self.docs.find_one(filter)
        if self.current_doc is None:
            self.current_doc = self.docs.find_one({"name": "default2"})
        return self.current_doc

    def getCurrent(self):
        return json.loads(dumps(self.current_doc))

    def insertByName(self , name : str , ownPieces : Dict[str, float] , opponentPieces : Dict[str, float], owner = None) -> bool:
        existing_doc = self.docs.find_one({"name": name})
        if existing_doc:
            return False  
        new_doc = EvaluateMaterialDoc(
            _id            = ObjectId(),
            name           = name,
            ownPieces      = ownPieces,
            opponentPieces = opponentPieces
        )
        result = self.docs.insert_one(asdict(new_doc))
        return result.acknowledged

    def getNullOwner(self):
        return list(self.docs.find({"owner": None}, {"_id": 0}))
        


if __name__ == "__main__":
    # Test data access
    em = EvaluateMaterialManager()
    piece_value = {
    "pawn"  : 1.0,
    "knight": 3.0,
    "bishop": 3.0,
    "rook"  : 5.0,
    "queen" : 9.0,
    "king"  : 20.0
    }

    result = em.insertByName('default2', piece_value , piece_value)
    print(result)
    em.loadOne("default2")
    print(em.current_doc)

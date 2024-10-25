interface ObjectId {
    $oid: string;
  }
  
  interface PieceValues {
    pawn: number;
    knight: number;
    bishop: number;
    rook: number;
    queen: number;
  }
  
  interface EvaluateMaterialData {
    _id: ObjectId;
    name: string;
    owner: string | null;
    blackPieces: PieceValues;
    whitePieces: PieceValues;
  }
  
  interface EvaluateDangerData {
    _id: ObjectId;
    name: string;
    whitePieces: {
      hangingPieces: number;
      attackedPieces: number;
    };
    blackPieces: {
      hangingPieces: number;
      attackedPieces: number;
    };
    owner: string | null;
  }
  
  interface Strategy {
    collection: string;
    strat_id: string;
  }
  
  export interface StrategyCardData {
    _id: ObjectId;
    name: string;
    strategy_list: Strategy[];
    wins: number;
    losses: number;
    elo: number;
    evaluate_material_data: EvaluateMaterialData;
    evaluate_danger_data: EvaluateDangerData;
  }
  
  export const mockStrategyCardData: StrategyCardData[] = [
    {
      _id: { $oid: '67173c8542b47fc669033e9b' },
      name: 'Material Strategy',
      strategy_list: [
        {
          collection: 'evaluate_material',
          strat_id: '67173c8542b47fc669033e9b'
        }
      ],
      wins: 10,
      losses: 2,
      elo: 1500,
      evaluate_material_data: {
        _id: { $oid: '67173c8542b47fc669033e9b' },
        name: 'Material Evaluation',
        owner: null,
        blackPieces: {
          pawn: -1,
          knight: -3,
          bishop: -3,
          rook: -5,
          queen: -9
        },
        whitePieces: {
          pawn: 1,
          knight: 3,
          bishop: 3,
          rook: 5,
          queen: 9
        }
      },
      evaluate_danger_data: {
        _id: { $oid: '67173cdf42b47fc669033e9e' },
        name: 'Danger Evaluation',
        whitePieces: {
          hangingPieces: 1.5,
          attackedPieces: 3
        },
        blackPieces: {
          hangingPieces: 1.5,
          attackedPieces: 3
        },
        owner: null
      }
    },
    {
      _id: { $oid: '67173cdf42b47fc669033e9e' },
      name: 'Danger Strategy',
      strategy_list: [
        {
          collection: 'evaluate_danger',
          strat_id: '67173cdf42b47fc669033e9e'
        }
      ],
      wins: 8,
      losses: 5,
      elo: 1400,
      evaluate_material_data: {
        _id: { $oid: '67173c8542b47fc669033e9b' },
        name: 'Material Evaluation',
        owner: null,
        blackPieces: {
          pawn: -1,
          knight: -3,
          bishop: -3,
          rook: -5,
          queen: -9
        },
        whitePieces: {
          pawn: 1,
          knight: 3,
          bishop: 3,
          rook: 5,
          queen: 9
        }
      },
      evaluate_danger_data: {
        _id: { $oid: '67173cdf42b47fc669033e9e' },
        name: 'Danger Evaluation',
        whitePieces: {
          hangingPieces: 1.5,
          attackedPieces: 3
        },
        blackPieces: {
          hangingPieces: 1.5,
          attackedPieces: 3
        },
        owner: null
      }
    },
    {
      _id: { $oid: '67173cdf42b47fc669033e9e' },
      name: 'Danger Strategy',
      strategy_list: [
        {
          collection: 'evaluate_danger',
          strat_id: '67173cdf42b47fc669033e9e'
        }
      ],
      wins: 8,
      losses: 5,
      elo: 1400,
      evaluate_material_data: {
        _id: { $oid: '67173c8542b47fc669033e9b' },
        name: 'Material Evaluation',
        owner: null,
        blackPieces: {
          pawn: -1,
          knight: -3,
          bishop: -3,
          rook: -5,
          queen: -9
        },
        whitePieces: {
          pawn: 1,
          knight: 3,
          bishop: 3,
          rook: 5,
          queen: 9
        }
      },
      evaluate_danger_data: {
        _id: { $oid: '67173cdf42b47fc669033e9e' },
        name: 'Danger Evaluation',
        whitePieces: {
          hangingPieces: 1.5,
          attackedPieces: 3
        },
        blackPieces: {
          hangingPieces: 1.5,
          attackedPieces: 3
        },
        owner: null
      }
    }
  ];
export const GAME_EVENTS = {
  GAME_STARTED: 'game:started',
  GAME_PAUSED: 'game:paused',
  GAME_RESUMED: 'game:resumed',
  GAME_OVER: 'game:over',

  PIECE_SPAWNED: 'piece:spawned',
  PIECE_MOVED: 'piece:moved',
  PIECE_ROTATED: 'piece:rotated',
  PIECE_LOCKED: 'piece:locked',
  PIECE_CORRUPTED: 'piece:corrupted',

  PLAYER_ERROR: 'player:error',

  LINE_CLEARED: 'line:cleared',

  OXYGEN_LOW: 'oxygen:low',
  OXYGEN_DEPLETED: 'oxygen:depleted',
  OXYGEN_RECOVERED: 'oxygen:recovered',

  INFECTION_CREATED: 'infection:created',
  INFECTION_PROPAGATED: 'infection:propagated',
  INFECTION_CONTAINED: 'infection:contained',
  INFECTION_REACHED_TOP: 'infection:reached-top',

  AI_MESSAGE: 'ai:message',
  AI_INTERFERENCE_STARTED:
    'ai:interference-started',
  AI_INTERFERENCE_ENDED:
    'ai:interference-ended',

  REALITY_SHIFT: 'reality:shift',
  REALITY_CORRUPTED:
    'reality:corrupted',
  DEADSPACE_ENTERED:
    'deadspace:entered',
  DEADSPACE_EXITED:
    'deadspace:exited',
  REALITY_COLLAPSE:
    'reality:collapse'
}
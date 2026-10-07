const FEEDBACK_MESSAGES = {
  OXYGEN: {
    LOW: [
      'OXÍGENO EN NIVEL CRÍTICO.',
      'PUEDO OÍR TU RESPIRACIÓN.',
      'EL OXÍGENO DESCIENDE.'
    ],

    DEPLETED: [
      'ASFIXIA.',
      'OXÍGENO AGOTADO.',
      'FUNCIÓN RESPIRATORIA: FALLIDA.'
    ]
  },

  INFECTION: {
    CREATED: [
      'TEJIDO NECRÓTICO DETECTADO.',
      'CONTAMINACIÓN DETECTADA.',
      'MATERIAL BIOLÓGICO NO IDENTIFICADO.'
    ],

    PROPAGATED: [
      'LA CONTAMINACIÓN SE PROPAGA.',
      'LA INFECCIÓN ESTÁ CRECIENDO.',
      'CONTENCIÓN COMPROMETIDA.'
    ],

    CONTAINED: [
      'CONTENCIÓN REGISTRADA.',
      'ZONA CONTENIDA.',
      'PROPAGACIÓN INTERRUMPIDA.'
    ]
  },

  AI: {
    INTERFERENCE_STARTED: [
      'SEÑAL INTERRUMPIDA.',
      'CONTROL DE SISTEMA COMPROMETIDO.',
      'ENTRADA NO AUTORIZADA.'
    ],

    INTERFERENCE_ENDED: [
      'SEÑAL RESTABLECIDA.',
      'CONTROL RESTAURADO.'
    ],

    CORRUPTION: [
      'INTEGRIDAD DE PIEZA COMPROMETIDA.',
      'ALTERACIÓN DETECTADA.',
      'ESTRUCTURA NO CONFORME.'
    ]
  },

  REALITY: {
    SHIFT: [
      'ANOMALÍA ESTRUCTURAL DETECTADA.',
      'DESFASE DE REALIDAD DETECTADO.',
      'LA ESTRUCTURA HA CAMBIADO.'
    ],

    CORRUPTED: [
      'LA REALIDAD ESTÁ CAMBIANDO.',
      'INTEGRIDAD DE REALIDAD COMPROMETIDA.',
      'LOS DATOS YA NO COINCIDEN.'
    ],

    UNSTABLE: [
      'ESTABILIDAD DE REALIDAD: CRÍTICA.',
      'LA ESTRUCTURA ESTÁ CEDIENDO.',
      'INTEGRIDAD DEL ESPACIO: INCIERTA.'
    ],

    COLLAPSE: [
      'COLAPSO DE REALIDAD.',
      'ESTRUCTURA DE REALIDAD: FALLIDA.',
      'LA REALIDAD HA COLAPSADO.'
    ]
  },

  DEADSPACE: {
    ENTERED: [
      'DEADSPACE',
      'LA REALIDAD NO COINCIDE.',
      'REGIÓN NO CONFORME.',
      'REFERENCIA ESPACIAL PERDIDA.'
    ],

    EXITED: [
      'INTEGRIDAD DE REALIDAD RESTAURADA.',
      'REFERENCIA ESPACIAL RECUPERADA.'
    ]
  },

  DEEP_MAW: {
    PRESENCE_LOW: [
      '¿LO VISTE?',
      'ALGO CAMBIÓ.',
      '¿ESCUCHASTE ESO?'
    ],

    PRESENCE_MEDIUM: [
      'ALGO ESTÁ AQUÍ.',
      'NO FUE TU MOVIMIENTO.',
      'HAY ALGO OBSERVANDO.'
    ],

    PRESENCE_HIGH: [
      'ESTÁ OBSERVANDO.',
      'NO MIRES.',
      'LA REALIDAD NO COINCIDE.'
    ],

    PRESENCE_CRITICAL: [
      'NO ESTÁS DONDE CREES.',
      'NO DEBERÍAS ESTAR AQUÍ.',
      'ÉL YA ESTÁ AQUÍ.'
    ],

    CORRUPTION: [
      'ALGO HA CAMBIADO.',
      'ESO NO ESTABA AHÍ.',
      'LA ESTRUCTURA HA SIDO ALTERADA.'
    ],

    INTERFERENCE: [
      'NO FUE TU MOVIMIENTO.',
      'ALGO INTERVINO.',
      'ESA DECISIÓN NO FUE TUYA.'
    ],

    COMMUNICATION: [
      '¿LO VISTE?',
      'NO MIRES.',
      'SIGUE.',
      'TODAVÍA NO.'
    ],

    REALITY: [
      'LA REALIDAD ESTÁ CEDIENDO.',
      'LOS LÍMITES SE ESTÁN MOVIENDO.',
      'ALGO ESTÁ CAMBIANDO DE LUGAR.'
    ],

    DEADSPACE: [
      'LA REALIDAD NO COINCIDE.',
      'NO ESTÁS DONDE CREES.',
      'REFERENCIA PERDIDA.'
    ]
  }
}

export function getMessages(
  category,
  state
) {
  const messages =
    FEEDBACK_MESSAGES[
      category
    ]?.[state]

  if (
    !messages ||
    messages.length === 0
  ) {
    return []
  }

  return [
    ...messages
  ]
}

export function getRandomMessage(
  category,
  state
) {
  const messages =
    getMessages(
      category,
      state
    )

  if (
    messages.length === 0
  ) {
    return null
  }

  const index =
    Math.floor(
      Math.random() *
      messages.length
    )

  return messages[index]
}

export function getDeepMawMessage(
  level
) {
  const normalizedLevel =
    Math.max(
      0,
      Number(level) || 0
    )

  if (
    normalizedLevel >= 6
  ) {
    return getRandomMessage(
      'DEEP_MAW',
      'PRESENCE_CRITICAL'
    )
  }

  if (
    normalizedLevel >= 4
  ) {
    return getRandomMessage(
      'DEEP_MAW',
      'PRESENCE_HIGH'
    )
  }

  if (
    normalizedLevel >= 2
  ) {
    return getRandomMessage(
      'DEEP_MAW',
      'PRESENCE_MEDIUM'
    )
  }

  return getRandomMessage(
    'DEEP_MAW',
    'PRESENCE_LOW'
  )
}

export {
  FEEDBACK_MESSAGES
}
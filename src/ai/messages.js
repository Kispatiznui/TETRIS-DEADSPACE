const AI_MESSAGES = {
  MISTAKE: [
    'INÚTIL.',
    'OTRA VEZ.',
    'ERROR DE EJECUCIÓN.',
    'NO APRENDES.',
    'PREDECIBLE.'
  ],

  OXYGEN: [
    'EL OXÍGENO DESCIENDE.',
    'PUEDO OÍR TU RESPIRACIÓN.',
    'NO TE QUEDA MUCHO TIEMPO.',
    '¿CUÁNTO CREES QUE PUEDES SOPORTAR?'
  ],

  INFECTION: [
    'LO DEJASTE ENTRAR.',
    'YA ESTÁ DENTRO.',
    'NO PUEDES CONTENERLO.',
    'ESTÁ CRECIENDO.',
    'LA CONTENCIÓN ES UNA ILUSIÓN.'
  ],

  PROGRESS: [
    'SIGUES INTENTÁNDOLO.',
    'INTERESANTE.',
    'TODAVÍA NO HAS MUERTO.',
    'CONTINÚA.'
  ],

  THREAT: [
    'EL SISTEMA TE OBSERVA.',
    'NO ESTÁS SOLO.',
    'NO PUEDES SALVARLOS.',
    'EL PROTOCOLO NO FUE DISEÑADO PARA TI.',
    'ESTO NO ES UN JUEGO.'
  ],

  SILENCE: []
}

export function getRandomMessage(
  category
) {
  const messages =
    AI_MESSAGES[category]

  if (
    !messages ||
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

export function getMessages(
  category
) {
  return [
    ...(AI_MESSAGES[category] || [])
  ]
}

export {
  AI_MESSAGES
}
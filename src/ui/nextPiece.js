export function createNextPiece() {
  const panel =
    document.createElement('aside')

  panel.id =
    'next-piece'

  const title =
    document.createElement('h2')

  title.textContent =
    'NEXT'

  const preview =
    document.createElement('div')

  preview.id =
    'next-piece-preview'

  panel.append(
    title,
    preview
  )

  return {
    element: panel,

    update(piece) {
      if (!piece) {
        return
      }

      preview.innerHTML = ''

      const width =
        piece.shape[0].length

      const height =
        piece.shape.length

      const previewWidth = 4
      const previewHeight = 4

      const offsetX =
        Math.floor(
          (previewWidth - width) / 2
        )

      const offsetY =
        Math.floor(
          (previewHeight - height) / 2
        )

      for (
        let y = 0;
        y < previewHeight;
        y++
      ) {
        for (
          let x = 0;
          x < previewWidth;
          x++
        ) {
          const block =
            document.createElement('span')

          const pieceX =
            x - offsetX

          const pieceY =
            y - offsetY

          const value =
            piece.shape[pieceY]?.[pieceX]

          if (value) {
            block.style.backgroundColor =
              piece.color
          }

          preview.appendChild(block)
        }
      }
    }
  }
}
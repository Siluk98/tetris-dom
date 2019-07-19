
export function getHtmlTile(position) {
  return document.querySelector(`.row:nth-child(${position.y + 1}) .tile:nth-child(${position.x + 1})`);
}

export function getFigureBlockPositions({ x, y, shape }) {
  return shape.map((row, rowIndex) => {
    return row
      .map((block, blockIndex) => ({
        x: blockIndex + x,
        y: rowIndex + y,
        exists: block,
      }))
      .filter(block => block.exists)
      .map(block => ({
        x: block.x,
        y: block.y,
      }));
  })
    .reduce((acc, nextRow) => acc.concat(nextRow), [])
}

export function getFigureBlockPositionsInsideBoard(figureBlockPositions, boardHeight) {
  return figureBlockPositions
    .filter(block => block.y >= 0)
    .filter(block => block.y < boardHeight)
}

export function getBlockPositionsFromBoardRows(boardRows) {
  return getFigureBlockPositions({
    x: 0,
    y: 0,
    shape: boardRows
  });
}

export function canTranslateFigureByVector(figure, vector, boardRows) {
  let figureBlockPosition = getFigureBlockPositions(figure);
  let translatedFigureBlockPosition = figureBlockPosition.map(block => ({
    x: block.x + vector.x,
    y: block.y + vector.y,
  }));

  let boardBlockPositions = getBlockPositionsFromBoardRows(boardRows);

  if (translatedFigureBlockPosition.some(block =>
    block.y >= boardRows.length ||
    block.x < 0 ||
    block.x >= boardRows[0].length
  )) {
    return false;
  }

  return !boardBlockPositions.some(block => translatedFigureBlockPosition.find(translatedBlock =>
    translatedBlock.x === block.x &&
    translatedBlock.y === block.y
  ));
}

export function getSlammedFigure(figure, boardRows) {
  let slammedFigure = {
    ...figure,
    shape: [...figure.shape],
  }

  while (canTranslateFigureByVector(slammedFigure, { x: 0, y: 1 }, boardRows)) {
    slammedFigure.y++;
  }

  return slammedFigure;
}

export function getFullRows(boardRows) {
  return boardRows
    .map(row => row.every(tile => tile))
    .map((isFullFlag, flagIndex) => isFullFlag ? flagIndex : null)
    .filter(el => el !== null)
}

export function getBoardAfterPoppingRows(indexesOfRowsToPop, boardRows) {
  return [
    ...Array(indexesOfRowsToPop.length).fill(Array(boardRows[0].length).fill('')),
    ...(boardRows.filter((boardRow, rowIndex) => !indexesOfRowsToPop.includes(rowIndex)))
  ];
}

export function isFigurePartiallyAboveBoard(figure) {
  return figure.y < 0;
}

// original rotation-related functions

export function getFigureCenter(figure) {
  if (!figure.rotable) {
    return null;
  }

  let relativeCenterPosition = figure.shape
    .map((row, rowIndex) => ({ x: row.indexOf(2), y: rowIndex }))
    .filter(el => el.x !== -1)
  [0];

  return {
    x: relativeCenterPosition.x + figure.x,
    y: relativeCenterPosition.y + figure.y,
  };
}

export function getRotatedBlockPositions(center, blockPositions) {
  return blockPositions.map(block => ({
    x: center.x + center.y - block.y,
    y: center.y - center.x + block.x
  }));
}

export function canFigureBeRotatedAsNewFigure(newFigure, boardRows) {
  const allFigureBlocks = getFigureBlockPositions(newFigure);

  const areSomeBlocksInvalid = allFigureBlocks.some(block =>
    block.x < 0 ||
    block.x >= boardRows[0].length ||
    block.y >= boardRows.length
  )

  if (areSomeBlocksInvalid) {
    return false;
  }

  return !getFigureBlockPositionsInsideBoard(allFigureBlocks, boardRows.length).some(block => boardRows[block.y][block.x]);
}

// new rotation-related functions

export function getFigureAfterRotation(figure) {
  const center = getFigureCenter(figure);
  const blockPositions = getFigureBlockPositions(figure);
  const rotatedBlockPositions = getRotatedBlockPositions(center, blockPositions);
  const typedBlockPositions = getTypedBlockPositions(rotatedBlockPositions, center);

  // todo

  return {
    ...figure,
    x: newFigureX,
    y: newFigureY,
    shape: newFigureShape
  }
}

export function getTypedBlockPositions(blockPositions, center) {
  const typedBlockPositions = blockPositions.map(block => ({ ...block, blockType: 1 }));
  typedBlockPositions.find(block => block.x === center.x && block.y === center.y).blockType = 2;

  return typedBlockPositions
}

export function getFigureFromTypedBlockPositions(typedBlockPositions) {
  // todo - break this function to two functions:

  // 1. return
  /*
    {
      x: 0,
      y: 0,
      shape: [
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    }
  */

  // 2. return
  /*
    {
      x: 0,
      y: 0,
      shape: [
        [0, 1],
        [2, 1],
        [1, 0],
      ],
    }
  */

  const blockPositionsSortedByX = [...typedBlockPositions].sort((block, nextBlock) => block.x - nextBlock.x);
  const blockPositionsSortedByY = [...typedBlockPositions].sort((block, nextBlock) => block.y - nextBlock.y);

  const minX = blockPositionsSortedByX[0].x;
  const minY = blockPositionsSortedByY[0].y;

  const shape = [...(Array(blockPositionsSortedByY.slice(-1)[0].y - minY + 1))]
    .map(() => Array(blockPositionsSortedByX.slice(-1)[0].x - minX + 1).fill(0));

  typedBlockPositions.forEach(block => {
    shape[block.y - minY][block.x - minX] = block.blockType
  });

  return {
    x: minX,
    y: minY,
    shape
  }
}

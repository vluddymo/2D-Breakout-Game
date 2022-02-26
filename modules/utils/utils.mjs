function emptyContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }
}

function addBlock(parent, blocks) {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    parent.appendChild(block);
  }
}


export {emptyContainer, addBlock}
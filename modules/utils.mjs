export default function emptyContainer(container){
    while (container.firstChild){
        container.removeChild(container.lastChild)
    }
}
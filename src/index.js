// Element Template Draggable 
interact('.draggable')  
    .draggable(
        { 
            manualStart: true, // manualStart since we will move the cloned template element
            onmove: dragMoveHandler,
        })
        .on('move', function (event) {
            var interaction = event.interaction;
            
            // if the pointer was moved while being held down
            // and an interaction hasn't started yet 
            if (interaction.pointerIsDown && !interaction.interacting()) {
                var original = event.currentTarget;
                // Clone the template element and start dragging the clone
                var clone = event.currentTarget.cloneNode(true);
                clone.style.position = 'absolute';
                clone.style.zIndex = 9999;
                original.parentNode.appendChild(clone);

                // start a drag interaction targeting the clone
                interaction.start({ name: 'drag' },
                                    event.interactable,
                                    clone);
            }   
    }); 

// Handling Drag Moving 
function dragMoveHandler (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // update zIndex to make this always on top
    target.style.zIndex = 9999;
}
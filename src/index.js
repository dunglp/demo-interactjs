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

// DROP ZONE
interact('.dropzone')
    .dropzone({  
        // Require a 100% element overlap for a drop to be possible
        overlap: 1.00,
        accept: '.draggable', // only accept this class to be able to dropped on
        // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        },
        ondragenter: function (event) {
            var dropzoneElement = event.target;

            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
        },
        ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
        },
        ondrop: function (event) {
            event.relatedTarget.classList.remove("draggable");
            event.relatedTarget.classList.add("inside-draggable");
        },
        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
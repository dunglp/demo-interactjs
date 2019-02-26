var dropZone = document.getElementById('drop-zone');

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

// Content Element Draggable 
interact('.inside-draggable')  
    .draggable({
        inertia: true,
        restrict: {
            restriction: dropZone, // Restrict to drag only inside Content area
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        autoScroll: true,
        onmove: dragMoveHandler,
    })
    .resizable({
        edges: { 
            left: true, 
            right: true, 
            bottom: true, 
            top: true 
        },

        // keep the edges inside the parent
        restrictEdges: {
            outer: 'parent',
            endOnly: true,
        },
        restrictSize: {
            min: { width: 252, height: 80 },
        },
        inertia: true,
        onmove: onInsideDraggableResizeMoveHandler
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

// Handling Content Element Resize
function onInsideDraggableResizeMoveHandler(event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

        x += event.deltaRect.left;
        y += event.deltaRect.top;
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';
        target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
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
            // Create a clone of dragging element 
            var clone = event.relatedTarget.cloneNode(true),
                rect = interact.getElementRect(event.relatedTarget);

            // Remove dragging element from DOM 
            if(event.relatedTarget.parentNode) {
                event.relatedTarget.parentNode.removeChild(event.relatedTarget);
            }

            var dzRect = interact.getElementRect(dropZone),
                // Calculate Clone element position inside dropzone 
                left = rect.left - (dzRect.left + 20),
                top = rect.top - (dzRect.top + 40);

            // Disable template element draggable 
            clone.classList.remove("draggable");
            // Enable Content Element draggable
            clone.classList.add("inside-draggable");

            // Update clone element : 
            clone.style.position = 'absolute';
            clone.style.top = rect.top;
            clone.style.left = rect.left;
            clone.style.width = rect.width+"px";
            clone.style.zIndex = 0;
            clone.style.webkitTransform = clone.style.transform = 'translate(' + left + 'px,' + top + 'px)';
            clone.setAttribute('data-x', left);
            clone.setAttribute('data-y', top);

            // Add clone element to dropzone 
            if(event.target) {
                event.target.appendChild(clone);
            }
        },
        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    }).resizable({
        // resize from all edges and corners
        edges: { 
            left: false, 
            right: false, 
            bottom: true, 
            top: false 
        },

        // keep the edges inside the parent
        restrictEdges: {
            outer: 'parent',
            endOnly: true,
        },

        inertia: true,
    })
    .on('resizemove', function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';
        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
    }).on('resizeend', function (event) {
        event.target.textContent = '';
    });
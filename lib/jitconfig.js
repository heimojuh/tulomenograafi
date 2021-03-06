var labelType, useGradients, nativeTextSupport, animate;

(function() {
    var ua = navigator.userAgent,
    iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
    typeOfCanvas = typeof HTMLCanvasElement,
    nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
    textSupport = nativeCanvasSupport && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();

function init(graafi, selite, data) {

    var sb = new $jit.Sunburst({  
        //id container for the visualization  
        injectInto: graafi,  
        //Distance between levels  
        levelDistance: 90,  
        //Change node and edge styles such as  
        //color, width and dimensions.  
        Node: {  
            overridable: true,  
            type: useGradients ? 'gradient-multipie' : 'multipie'  
        },  
        //Select canvas labels  
        //'HTML', 'SVG' and 'Native' are possible options  
        Label: {  
            type: labelType  
        },  
        //Change styles when hovering and clicking nodes  
        NodeStyles: {  
            enable: true,  
            type: 'Native',  
            stylesClick: {  
                'color': '#33dddd'  
            },  
            stylesHover: {  
                'color': '#dd3333'  
            }  
        },  
        //Add tooltips  
        Tips: {  
            enable: true,  
            onShow: function(tip, node) {  
                var html = "<div class=\"tip-title\">" + node.name + "</div>";   
                var data = node.data;  
                if("days" in data) {  
                    html += "<b>Last modified:</b> " + data.days + " days ago";  
                }  
                if("size" in data) {  
                    html += "<br /> " + data.size + "e";  
                }  
                tip.innerHTML = html;  
            }  
        },  
        //implement event handlers  
        Events: {  
            enable: true,  
            onClick: function(node) {  
                if(!node) return;  
                //Build detailed information about the file/folder  
                //and place it in the right column.  
                var html = "<h4>" + node.name + "</h4>", data = node.data;  
                if("days" in data) {  
                    html += "<b>Last modified:</b> " + data.days + " days ago";  
                }  
                if("size" in data) {  
                    html += "<br /><br / " + data.size+ "e";  
                }  
                if("description" in data) {  
                    html += "<br /><br /><pre>" + data.description + "<br>"+data.size+"e</pre>";  
                }  
                $jit.id(selite).innerHTML = html;  
                //hide tip  
                sb.tips.hide();  
                //rotate  
                sb.rotate(node, animate? 'animate' : 'replot', {  
                    duration: 1000,  
                    transition: $jit.Trans.Quart.easeInOut  
                });  
            }  
        },  
        // Only used when Label type is 'HTML' or 'SVG'  
        // Add text to the labels.   
        // This method is only triggered on label creation  
        onCreateLabel: function(domElement, node){  
            var labels = sb.config.Label.type,  
            aw = node.getData('angularWidth');  
            if (labels === 'HTML' && (node._depth < 2 || aw > 2000)) {  
                domElement.innerHTML = node.name;  
            } else if (labels === 'SVG' && (node._depth < 2 || aw > 2000)) {  
                domElement.firstChild.appendChild(document.createTextNode(node.name));  
            }  
        },  
        // Only used when Label type is 'HTML' or 'SVG'  
        // Change node styles when labels are placed  
        // or moved.  
        onPlaceLabel: function(domElement, node){  
            var labels = sb.config.Label.type;  
            if (labels === 'SVG') {  
                var fch = domElement.firstChild;  
                var style = fch.style;  
                style.display = '';  
                style.cursor = 'pointer';  
                style.fontSize = "0.8em";  
                fch.setAttribute('fill', "#fff");  
            } else if (labels === 'HTML') {  
                var style = domElement.style;  
                style.display = '';  
                style.cursor = 'pointer';  
                style.fontSize = "0.8em";  
                style.color = "#ddd";  
                var left = parseInt(style.left, 10);  
                var w = domElement.offsetWidth;  
                style.left = (left - w / 2) + 'px';  
            }  
        }  
    });  
    //load JSON data.  
    sb.loadJSON(data);  
    //compute positions and plot.  
    sb.refresh();  
}

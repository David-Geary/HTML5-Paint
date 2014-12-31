/*
 * Copyright (C) 2012 David Geary. This code is from the book
 * Core HTML5 Canvas, published by Prentice-Hall in 2012.
 *
 * License:
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The Software may not be used to create training material of any sort,
 * including courses, books, instructional videos, presentations, etc.
 * without the express written consent of David Geary.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/

var COREHTML5 = COREHTML5 || { };

// Constructor................................................................

COREHTML5.paintExample = function() {
   var paint = this;
   
   this.iconCanvas = document.getElementById('paint-icon-canvas');
   this.drawingCanvas = document.getElementById('paint-drawing-canvas');
   this.drawingContext = this.drawingCanvas.getContext('2d');
   this.backgroundContext = document.createElement('canvas').getContext('2d');
   this.iconContext = this.iconCanvas.getContext('2d');
   this.strokeStyleSelect = document.getElementById('paint-strokeStyleSelect');
   this.fillStyleSelect = document.getElementById('paint-fillStyleSelect');
   this.lineWidthSelect = document.getElementById('paint-lineWidthSelect');
   this.eraseAllButton = document.getElementById('paint-erase-all');
   this.snapshotButton = document.getElementById('paint-snapshot-button');
   this.controls = document.getElementById('paint-controls');
   this.curveInstructions = document.getElementById('paint-curve-instructions');
   this.curveInstructionsOkayButton = document.getElementById('paint-curve-instructions-okay-button');
   this.curveInstructionsNoMoreButton = document.getElementById('paint-curve-instructions-no-more-button');
   this.paintInformation = document.getElementById('paint-information-icon');

   this.CURVE_INSTRUCTIONS_LS_KEY = 'COREHTML5.canvas.paintInstructions';

   this.CONTROL_POINT_RADIUS = 15;
   this.CONTROL_POINT_FILL_STYLE = 'rgba(255,255,0,0.5)';
   this.CONTROL_POINT_STROKE_STYLE = 'rgba(0, 0, 255, 0.8)';
   
   this.GRID_HORIZONTAL_SPACING = 10;
   this.GRID_VERTICAL_SPACING = 10;
   this.GRID_LINE_COLOR = 'rgb(0, 0, 200)';

   this.ERASER_ICON_GRID_COLOR = 'rgb(0, 0, 200)';
   this.ERASER_ICON_CIRCLE_COLOR = 'rgba(100, 140, 200, 0.5)';
   this.ERASER_ICON_RADIUS = 20;

   this.SLINKY_LINE_WIDTH = 1;
   this.SLINKY_SHADOW_STYLE = 'rgba(0,0,0,0.2)';
   this.SLINKY_SHADOW_OFFSET = -5;
   this.SLINKY_SHADOW_BLUR = 20;
   this.SLINKY_RADIUS = 60;

   this.ERASER_LINE_WIDTH = 1;
   this.ERASER_SHADOW_STYLE = 'blue';
   this.ERASER_STROKE_STYLE = 'rgba(0,0,255,0.6)';
   this.ERASER_SHADOW_OFFSET = -5;
   this.ERASER_SHADOW_BLUR = 20;
   this.ERASER_RADIUS = 40;

   this.SHADOW_COLOR = 'rgba(0,0,0,0.7)';

   this.ICON_BACKGROUND_STYLE = '#eeeeee';
   this.ICON_BORDER_STROKE_STYLE = 'rgba(100, 140, 230, 0.5)';
   this.ICON_STROKE_STYLE = 'rgb(100, 140, 230)';
   this.ICON_FILL_STYLE = '#dddddd';

   this.TEXT_ICON_FILL_STYLE = 'rgba(100, 140, 230, 0.5)';
   this.TEXT_ICON_TEXT = 'T';

   this.CIRCLE_ICON_RADIUS = 20;

   this.ICON_RECTANGLES = [
      { x: 13.5, y: 13.5, w: 48, h: 48 },
      { x: 13.5, y: 71.5, w: 48, h: 48 },
      { x: 13.5, y: 129.5, w: 48, h: 48 },
      { x: 13.5, y: 187.5, w: 48, h: 48 },
      { x: 13.5, y: 245.5, w: 48, h: 48 },
      { x: 13.5, y: 303.5, w: 48, h: 48 },
      { x: 13.5, y: 361.5, w: 48, h: 48 },
      { x: 13.5, y: 419.5, w: 48, h: 48 },
      { x: 13.5, y: 477.5, w: 48, h: 48 },
      { x: 13.5, y: 477.5, w: 48, h: 48 }
   ];

   this.LINE_ICON = 0;
   this.RECTANGLE_ICON = 1;
   this.CIRCLE_ICON = 2;
   this.OPEN_PATH_ICON = 3;
   this.CLOSED_PATH_ICON = 4;
   this.CURVE_ICON = 5;
   this.TEXT_ICON = 6;
   this.SLINKY_ICON = 7;
   this.ERASER_ICON = 8;

   this.CONTROL_POINT_RADIUS = 5;
   this.CONTROL_POINT_STROKE_STYLE = 'blue';
   this.CONTROL_POINT_FILL_STYLE = 'rgba(255, 255, 0, 0.5)';
   this.END_POINT_STROKE_STYLE = 'navy';
   this.END_POINT_FILL_STYLE   = 'rgba(0, 255, 0, 0.5)';
   this.GUIDEWIRE_STROKE_STYLE = 'rgba(0,0,230,0.4)';

   this.endPoints     = [ {}, {} ];  // end point locations (x, y)
   this.controlPoints = [ {}, {} ];  // control point locations (x, y)
   this.draggingPoint = false; // End- or control-point the user is dragging

   this.drawingSurfaceImageData = null;
   this.rubberbandW = null;
   this.rubberbandH = null;
   this.rubberbandUlhc = {};

   this.dragging = false;
   this.mousedown = {};
   this.lastRect = {};
   this.lastX = 0;
   this.lastY = 0;

   this.controlPoint = {};
   this.editingCurve = false;
   this.curveStart = {};
   this.curveEnd = {};
   
   this.doFill = true;
   this.selectedRect = null;
   this.selectedFunction;

   this.editingText = false;
   this.currentText;

   this.keyboard = new COREHTML5.Keyboard();

   this.iconContext.strokeStyle = this.ICON_STROKE_STYLE;
   this.iconContext.fillStyle = this.ICON_FILL_STYLE;

   this.iconContext.font = '48px Palatino';
   this.iconContext.textAlign = 'center';
   this.iconContext.textBaseline = 'middle';

   this.drawingContext.font = '48px Palatino';
   this.drawingContext.textBaseline = 'bottom';

   this.drawingContext.strokeStyle = this.strokeStyleSelect.value;
   this.drawingContext.fillStyle = this.fillStyleSelect.value;
   this.drawingContext.lineWidth = this.lineWidthSelect.value;

   this.drawGrid(this.drawingContext, this.GRID_LINE_COLOR, 10, 10);
   this.selectedRect = this.ICON_RECTANGLES[this.CURVE_ICON];
   this.selectedFunction = 'curve';

   // This event listener prevents touch devices from
   // scrolling the visible viewport.

   document.body.addEventListener('touchmove', function (e) {
      e.preventDefault();
   }, false);
   
   this.drawIcons();
   this.drawBackground();

   this.keyboard.appendTo('paint-keyboard');

   this.keyboard.addKeyListener( function (key) { 
      if (key === 'Enter') paint.enter();
      else if (key === '<') paint.backspace();
      else paint.insert(key);
   });

   document.onkeydown = function (e) {
      if (navigator.platform === 'iPad' && !this.keyboardVisible) return;
      if (e.ctrlKey || e.metaKey) return;

      if (e.keyCode === 8) {  // backspace
         e.preventDefault();
         paint.backspace();
      }
      else if (e.keyCode === 13) { // enter
         e.preventDefault();
         paint.enter();
      }
   }
   
   document.onkeypress = function (e) {
      var key = String.fromCharCode(e.which);

      if (navigator.platform === 'iPad' && !this.keyboardVisible) return;
      if (e.ctrlKey || e.metaKey) return;

      if (paint.editingText && e.keyCode !== 8) {
         e.preventDefault();
         paint.insert(key);
      }

      e.preventDefault();
   }

   // Control canvas event handlers.................................

   this.iconCanvas.onmousedown = function (e) {
      var x = e.x || e.clientX,
          y = e.y || e.clientY,
        loc = paint.windowToCanvas(paint.iconCanvas, x, y);

      e.preventDefault();
      paint.mouseDownOrTouchStartInControlCanvas(loc);
   }
   
   this.iconCanvas.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
         e.preventDefault();
         paint.mouseDownOrTouchStartInControlCanvas(
            paint.windowToCanvas(paint.iconCanvas,
               e.touches[0].clientX, e.touches[0].clientY));
      }
   });

   // Drawing canvas event handlers.................................

   this.drawingCanvas.onmousedown = function (e) {
      var x = e.x || e.clientX,
          y = e.y || e.clientY;

      e.preventDefault();
      paint.mouseDownOrTouchStartInDrawingCanvas(
         paint.windowToCanvas(paint.drawingCanvas, x, y));
   }

   this.drawingCanvas.ontouchstart = function (e) { 
      if (e.touches.length === 1) {
         e.preventDefault();
         paint.mouseDownOrTouchStartInDrawingCanvas(
            paint.windowToCanvas(paint.drawingCanvas,
               e.touches[0].clientX, e.touches[0].clientY));
      }
   }

   this.drawingCanvas.ontouchmove = function (e) { 
      if (e.touches.length === 1) {
         paint.mouseMoveOrTouchMoveInDrawingCanvas(
            paint.windowToCanvas(paint.drawingCanvas,
               e.touches[0].clientX, e.touches[0].clientY));
      }
   }

   this.drawingCanvas.ontouchend = function (e) { 
      var loc;
   
      if (e.changedTouches.length === 1) {
         loc = paint.windowToCanvas(paint.drawingCanvas, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
         paint.mouseUpOrTouchEndInDrawingCanvas(loc);
      }
   }

   this.drawingCanvas.onmousemove = function (e) {
      var x = e.x || e.clientX,
          y = e.y || e.clientY,
        loc = paint.windowToCanvas(paint.drawingCanvas, x, y);

      e.preventDefault();
      paint.mouseMoveOrTouchMoveInDrawingCanvas(loc);
   }

   this.drawingCanvas.onmouseup = function (e) {
      var x = e.x || e.clientX,
          y = e.y || e.clientY,
        loc = paint.windowToCanvas(paint.drawingCanvas, x, y);

      e.preventDefault();
      paint.mouseUpOrTouchEndInDrawingCanvas(loc);
   }

   // Control event handlers........................................

   this.strokeStyleSelect.onchange = function (e) {
      paint.drawingContext.strokeStyle = paint.strokeStyleSelect.value;
   };

   this.fillStyleSelect.onchange = function (e) {
      paint.drawingContext.fillStyle = paint.fillStyleSelect.value;
   };

   this.lineWidthSelect.onchange = function (e) {
      paint.drawingContext.lineWidth = paint.lineWidthSelect.value;
   };

   this.eraseAllButton.onclick = function (e) {
      paint.drawingContext.clearRect(0,0,
                               paint.drawingCanvas.width,
                               paint.drawingCanvas.height);
      paint.drawGrid(paint.drawingContext, paint.GRID_LINE_COLOR, 10, 10);
      paint.saveDrawingSurface();
      paint.rubberbandW = paint.rubberbandH = 0;
   };

   this.curveInstructionsOkayButton.onclick = function (e) {
      paint.curveInstructions.style.display = 'none';
   };

   this.curveInstructionsNoMoreButton.onclick = function (e) {
      paint.curveInstructions.style.display = 'none';
      localStorage[paint.CURVE_INSTRUCTIONS_LS_KEY]= 'no';
   };

   this.snapshotButton.onclick = function (e) {
      var dataUrl,
          snapshotImageElement = document.getElementById('paint-snapshot-image-element'),
          snapshotInstructions = document.getElementById('paint-snapshot-instructions'),
          eraseAllButton = document.getElementById('paint-erase-all'),
          paintDiv = document.getElementById('paint-div');

      e.preventDefault();
      
      if (paint.snapshotButton.innerHTML === 'Take a snapshot') {
         dataUrl = paint.drawingCanvas.toDataURL();

         paint.snapshotButton.innerHTML = 'Back to Paint';
         snapshotImageElement.src = dataUrl;
         
         snapshotImageElement.style.display = 'inline';
         paint.iconCanvas.style.opacity = 0.1;
         eraseAllButton.style.opacity = 0.1;
         paint.controls.style.opacity = 0.0;

         snapshotInstructions.style.display = 'inline';

         setTimeout( function (e) {
            snapshotInstructions.style.opacity = 1.0;
         },100);
      }
      else {
         snapshotImageElement.style.display = 'none';
         
         snapshotInstructions.style.display = 'none';
         setTimeout( function (e) {
            snapshotInstructions.style.opacity = 0;
         },100);

         paint.controls.style.opacity = 1.0;
         eraseAllButton.style.opacity = 1.0;
         paint.iconCanvas.style.opacity = 1.0;
         paint.snapshotButton.innerHTML = 'Take a snapshot';
      }
   };
};

COREHTML5.paintExample.prototype = {
// Grid..........................................................

drawGrid: function (context, color, stepx, stepy) {
   context.save()

   context.strokeStyle = color;
   context.fillStyle = '#ffffff';
   context.lineWidth = 0.5;
   context.fillRect(0, 0, context.canvas.width, context.canvas.height);
   context.globalAlpha = 0.1;

   context.beginPath();
   for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
     context.moveTo(i, 0);
     context.lineTo(i, context.canvas.height);
   }
   context.stroke();

   context.beginPath();
   for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
     context.moveTo(0, i);
     context.lineTo(context.canvas.width, i);
   }
   context.stroke();

   context.restore();
},

// Icons.........................................................

drawLineIcon: function (rect) {
   this.iconContext.beginPath();
   this.iconContext.moveTo(rect.x + 5, rect.y + 5);
   this.iconContext.lineTo(rect.x + rect.w - 5, rect.y + rect.h - 5);
   this.iconContext.stroke();
},

drawRectIcon: function (rect) {
   this.fillIconLowerRight(rect);
   this.iconContext.strokeRect(rect.x + 5, rect.y + 5,
                               rect.w - 10, rect.h - 10); 
},

drawCircleIcon: function (rect) {
   var startAngle = 3*Math.PI/4,
       endAngle = 7*Math.PI/4,
       center = {x: rect.x + rect.w/2, y: rect.y + rect.h/2 };

   this.fillIconLowerRight(rect);

   this.iconContext.beginPath();
   this.iconContext.arc(rect.x + rect.w/2, rect.y + rect.h/2,
                   this.CIRCLE_ICON_RADIUS, 0, Math.PI*2, false);
   this.iconContext.stroke();
},

drawOpenPathIcon: function (rect) {
   this.iconContext.beginPath();
   this.drawOpenPathIconLines(rect);
   this.iconContext.stroke();
},

drawClosedPathIcon: function (rect) {
   this.fillIconLowerRight(rect);
   this.iconContext.beginPath();
   this.drawOpenPathIconLines(rect);
   this.iconContext.closePath();
   this.iconContext.stroke();
},

drawCurveIcon: function (rect) {
   this.fillIconLowerRight(rect);
   this.iconContext.beginPath();
   this.iconContext.beginPath();
   this.iconContext.moveTo(rect.x + rect.w - 10, rect.y + 5);
   this.iconContext.quadraticCurveTo(rect.x - 10, rect.y,
                                     rect.x + rect.w - 10,
                                     rect.y + rect.h - 5);
   this.iconContext.stroke();
},

drawTextIcon: function (rect) {
   var text = this.TEXT_ICON_TEXT;
   
   this.fillIconLowerRight(rect);
   this.iconContext.fillStyle = this.TEXT_ICON_FILL_STYLE;
   this.iconContext.fillText(text, rect.x + rect.w/2,
                             rect.y + rect.h/2 + 5);
   this.iconContext.strokeText(text, rect.x + rect.w/2,
                               rect.y + rect.h/2 + 5);
},

drawSlinkyIcon: function (rect) {
   var x, y;
   
   this.fillIconLowerRight(rect);

   this.iconContext.save();
   this.iconContext.strokeStyle = 'rgba(100, 140, 230, 0.6)';

   for (var i=-2; i < rect.w/3 + 2; i+=1.5) {
      if (i < rect.w/6) x = rect.x + rect.w/3 + i + rect.w/8;
      else              x = rect.x + rect.w/3 + (rect.w/3 - i) + rect.w/8;

      y = rect.y + rect.w/3 + i;
      
      this.iconContext.beginPath();
      this.iconContext.arc(x, y, 12, 0, Math.PI*2, false);
      this.iconContext.stroke();
   }
   this.iconContext.restore();
},

drawEraserIcon: function (rect) {
   var rect = this.ICON_RECTANGLES[this.ERASER_ICON];
   this.iconContext.save();

   this.iconContext.beginPath();
   this.iconContext.arc(rect.x + rect.w/2,
                        rect.y + rect.h/2,
                        this.ERASER_ICON_RADIUS, 0, Math.PI*2, false);

   this.iconContext.strokeStyle = this.ERASER_ICON_CIRCLE_COLOR;
   this.iconContext.stroke();

   this.iconContext.clip(); // restrict drawGrid() to the circle

   this.drawGrid(this.iconContext, this.ERASER_ICON_GRID_COLOR, 5, 5);

   this.iconContext.restore();
},

drawIcon: function (rect) {
   this.iconContext.save();

   this.iconContext.strokeStyle = this.ICON_BORDER_STROKE_STYLE;
   this.iconContext.strokeRect(rect.x, rect.y, rect.w, rect.h);
   this.iconContext.strokeStyle = this.ICON_STROKE_STYLE;
   
   if (rect.y === this.ICON_RECTANGLES[this.LINE_ICON].y)             this.drawLineIcon(rect);
   else if (rect.y === this.ICON_RECTANGLES[this.RECTANGLE_ICON].y)   this.drawRectIcon(rect);
   else if (rect.y === this.ICON_RECTANGLES[this.CIRCLE_ICON].y)      this.drawCircleIcon(rect);
   else if (rect.y === this.ICON_RECTANGLES[this.OPEN_PATH_ICON].y)   this.drawOpenPathIcon(rect);
   else if (rect.y === this.ICON_RECTANGLES[this.CLOSED_PATH_ICON].y) this.drawClosedPathIcon(rect, 20);
   else if (rect.y === this.ICON_RECTANGLES[this.TEXT_ICON].y)        this.drawTextIcon(rect);
   else if (rect.y === this.ICON_RECTANGLES[this.CURVE_ICON].y)       this.drawCurveIcon(rect);
   else if (rect.y === this.ICON_RECTANGLES[this.ERASER_ICON].y)      this.drawEraserIcon(rect);
   else if (rect.y === this.ICON_RECTANGLES[this.SLINKY_ICON].y)      this.drawSlinkyIcon(rect);

   this.iconContext.restore();
},

drawIcons: function () {
   var paint = this;
   
   this.iconContext.clearRect(0,0, this.iconCanvas.width,
                                   this.iconCanvas.height);
   
   this.ICON_RECTANGLES.forEach(function(rect) {
      paint.iconContext.save();

      if (paint.selectedRect === rect) paint.setSelectedIconShadow();
      else                             paint.setIconShadow();

      paint.iconContext.fillStyle = paint.ICON_BACKGROUND_STYLE;
      paint.iconContext.fillRect(rect.x, rect.y, rect.w, rect.h);

      paint.iconContext.restore();

      paint.drawIcon(rect);
   });
},

drawOpenPathIconLines: function (rect) {
   this.iconContext.lineTo(rect.x + 13, rect.y + 19);
   this.iconContext.lineTo(rect.x + 15, rect.y + 17);
   this.iconContext.lineTo(rect.x + 25, rect.y + 12);
   this.iconContext.lineTo(rect.x + 35, rect.y + 13);
   this.iconContext.lineTo(rect.x + 38, rect.y + 15);
   this.iconContext.lineTo(rect.x + 40, rect.y + 17);
   this.iconContext.lineTo(rect.x + 39, rect.y + 23);
   this.iconContext.lineTo(rect.x + 36, rect.y + 25);
   this.iconContext.lineTo(rect.x + 32, rect.y + 27);
   this.iconContext.lineTo(rect.x + 28, rect.y + 29);
   this.iconContext.lineTo(rect.x + 26, rect.y + 31);
   this.iconContext.lineTo(rect.x + 24, rect.y + 33);
   this.iconContext.lineTo(rect.x + 22, rect.y + 35);
   this.iconContext.lineTo(rect.x + 20, rect.y + 37);
   this.iconContext.lineTo(rect.x + 18, rect.y + 39);
   this.iconContext.lineTo(rect.x + 16, rect.y + 39);
   this.iconContext.lineTo(rect.x + 13, rect.y + 36);
   this.iconContext.lineTo(rect.x + 11, rect.y + 34);
},

fillIconLowerRight: function (rect) {
   this.iconContext.beginPath();
   this.iconContext.moveTo(rect.x + rect.w, rect.y);
   this.iconContext.lineTo(rect.x + rect.w, rect.y + rect.h);
   this.iconContext.lineTo(rect.x, rect.y + rect.h);
   this.iconContext.closePath();
   this.iconContext.fill();
},

isPointInIconLowerRight: function (rect, x, y) {
   this.iconContext.beginPath();   
   this.iconContext.moveTo(rect.x + rect.w, rect.y);
   this.iconContext.lineTo(rect.x + rect.w, rect.y + rect.h);
   this.iconContext.lineTo(rect.x, rect.y + rect.h);
            
   return this.iconContext.isPointInPath(x, y);
},

getIconFunction: function (rect, loc) {
   var action;

   if (rect.y === this.ICON_RECTANGLES[this.LINE_ICON].y)             action = 'line';
   else if (rect.y === this.ICON_RECTANGLES[this.RECTANGLE_ICON].y)   action = 'rectangle';
   else if (rect.y === this.ICON_RECTANGLES[this.CIRCLE_ICON].y)      action = 'circle';
   else if (rect.y === this.ICON_RECTANGLES[this.OPEN_PATH_ICON].y)   action = 'path';
   else if (rect.y === this.ICON_RECTANGLES[this.CLOSED_PATH_ICON].y) action = 'pathClosed';
   else if (rect.y === this.ICON_RECTANGLES[this.CURVE_ICON].y)       action = 'curve';
   else if (rect.y === this.ICON_RECTANGLES[this.TEXT_ICON].y)        action = 'text';
   else if (rect.y === this.ICON_RECTANGLES[this.SLINKY_ICON].y)      action = 'slinky';
   else if (rect.y === this.ICON_RECTANGLES[this.ERASER_ICON].y)      action = 'erase';

   if (action === 'rectangle'  || action === 'circle' ||
       action === 'pathClosed' || action === 'text'   ||
       action === 'curve'      || action === 'slinky') {
      this.doFill = this.isPointInIconLowerRight(rect, loc.x, loc.y);
   }

   return action;
},

setIconShadow: function () {
   this.iconContext.shadowColor = this.SHADOW_COLOR;
   this.iconContext.shadowOffsetX = 1;
   this.iconContext.shadowOffsetY = 1;
   this.iconContext.shadowBlur = 2;
},

setSelectedIconShadow: function () {
   this.iconContext.shadowColor = this.SHADOW_COLOR;
   this.iconContext.shadowOffsetX = 4;
   this.iconContext.shadowOffsetY = 4;
   this.iconContext.shadowBlur = 5;
},

selectIcon: function (rect) {
   this.selectedRect = rect;
   this.drawIcons();
},

// Saving/Restoring the drawing surface..........................

saveDrawingSurface: function () {
   this.drawingSurfaceImageData = this.drawingContext.getImageData(0, 0,
                             this.drawingCanvas.width,
                             this.drawingCanvas.height);
},

restoreDrawingSurface: function () {
   this.drawingContext.putImageData(this.drawingSurfaceImageData, 0, 0);
},

// Rubberbands...................................................

updateRubberbandRectangle: function (loc) {
   this.rubberbandW = Math.abs(loc.x - this.mousedown.x);
   this.rubberbandH = Math.abs(loc.y - this.mousedown.y);

   if (loc.x > this.mousedown.x) this.rubberbandUlhc.x = this.mousedown.x;
   else                          this.rubberbandUlhc.x = loc.x;

   if (loc.y > this.mousedown.y) this.rubberbandUlhc.y = this.mousedown.y;
   else                          this.rubberbandUlhc.y = loc.y;
}, 

drawRubberbandRectangle: function () {
   this.drawingContext.strokeRect(this.rubberbandUlhc.x,
                             this.rubberbandUlhc.y,
                             this.rubberbandW, this.rubberbandH); 
},

drawRubberbandLine: function (loc) {
   this.drawingContext.beginPath();
   this.drawingContext.moveTo(this.mousedown.x, this.mousedown.y);
   this.drawingContext.lineTo(loc.x, loc.y);
   this.drawingContext.stroke();
},

drawRubberbandCircle: function (loc) {
   var angle = Math.atan(this.rubberbandH/this.rubberbandW);
   var radius = this.rubberbandH / Math.sin(angle);
   
   if (this.mousedown.y === loc.y) {
      radius = Math.abs(loc.x - this.mousedown.x); 
   }

   this.drawingContext.beginPath();
   this.drawingContext.arc(this.mousedown.x, this.mousedown.y, radius, 0, Math.PI*2, false); 
   this.drawingContext.stroke();
},

drawRubberband: function (loc) {
   this.drawingContext.save();

   if (this.selectedFunction === 'rectangle') {
      this.drawRubberbandRectangle();
   }
   else if (this.selectedFunction === 'line' ||
            this.selectedFunction === 'curve') {
      this.drawRubberbandLine(loc);
   }
   else if (this.selectedFunction === 'circle') { 
      this.drawRubberbandCircle(loc);
   }

   this.drawingContext.restore();
},

// Eraser........................................................

setPathForEraser: function () {
   this.drawingContext.beginPath();
   this.drawingContext.moveTo(this.lastX, this.lastY);
   this.drawingContext.arc(this.lastX, this.lastY,
                      this.ERASER_RADIUS + this.ERASER_LINE_WIDTH,
                      0, Math.PI*2, false);
},

setSlinkyAttributes: function () {
  this.drawingContext.lineWidth     = this.lineWidthSelect.value;
  this.drawingContext.shadowColor   = this.strokeStyleSelect.value;
  this.drawingContext.shadowOffsetX = this.SLINKY_SHADOW_OFFSET; 
  this.drawingContext.shadowOffsetY = this.SLINKY_SHADOW_OFFSET;
  this.drawingContext.shadowBlur    = this.SLINKY_SHADOW_BLUR;
  this.drawingContext.strokeStyle   = this.strokeStyleSelect.value;
},

setEraserAttributes: function () {
  this.drawingContext.lineWidth     = this.ERASER_LINE_WIDTH;
  this.drawingContext.shadowColor   = this.ERASER_SHADOW_STYLE;
  this.drawingContext.shadowOffsetX = this.ERASER_SHADOW_OFFSET; 
  this.drawingContext.shadowOffsetY = this.ERASER_SHADOW_OFFSET;
  this.drawingContext.shadowBlur    = this.ERASER_SHADOW_BLUR;
  this.drawingContext.strokeStyle   = this.ERASER_STROKE_STYLE;
},

eraseLast: function () {
   var x = this.lastX - this.ERASER_RADIUS - this.ERASER_LINE_WIDTH,
       y = this.lastY - this.ERASER_RADIUS - this.ERASER_LINE_WIDTH,
       w = this.ERASER_RADIUS*2+this.ERASER_LINE_WIDTH*2,
       h = w,
       cw = this.drawingContext.canvas.width,
       ch = this.drawingContext.canvas.height;

   this.drawingContext.save();

   this.setPathForEraser();
   this.drawingContext.clip();

      if (x + w > cw) w = cw - x;
      if (y + h > ch) h = ch - y;

      if (x < 0) { x = 0; }
      if (y < 0) { y = 0; }

      this.drawingContext.drawImage(
         this.backgroundContext.canvas, x, y, w, h, x, y, w, h);

   this.drawingContext.restore();
},

drawEraser: function (loc) {
   this.drawingContext.save();
   this.setEraserAttributes();     

   this.drawingContext.beginPath();
   this.drawingContext.arc(loc.x, loc.y, this.ERASER_RADIUS,
                           0, Math.PI*2, false);
   this.drawingContext.clip();
   this.drawingContext.stroke();

   this.drawingContext.restore();
},

drawSlinky: function (loc) {
   this.drawingContext.save();
   this.setSlinkyAttributes();     

   this.drawingContext.beginPath();
   this.drawingContext.arc(loc.x, loc.y, this.ERASER_RADIUS,
                           0, Math.PI*2, false);
   this.drawingContext.clip();

   this.drawingContext.strokeStyle = this.strokeStyleSelect.value;
   this.drawingContext.stroke();

   if (this.doFill) {
      this.drawingContext.shadowColor = undefined;
      this.drawingContext.shadowOffsetX = 0;
      this.drawingContext.globalAlpha = 0.2;
      this.drawingContext.fill();
   }
   this.drawingContext.restore();
},

// Finish drawing lines, circles, and rectangles.................

finishDrawingLine: function (loc) {   
   this.drawingContext.beginPath();
   this.drawingContext.moveTo(this.mousedown.x, this.mousedown.y);
   this.drawingContext.lineTo(loc.x, loc.y);
   this.drawingContext.stroke();
},

finishDrawingCircle: function (loc) {
   var angle = Math.atan(this.rubberbandH/this.rubberbandW),
       radius = this.rubberbandH / Math.sin(angle);
   
   if (this.mousedown.y === loc.y) {
      radius = Math.abs(loc.x - this.mousedown.x); 
   }

   this.drawingContext.beginPath();
   this.drawingContext.arc(this.mousedown.x, this.mousedown.y,
                      radius, 0, Math.PI*2, false); 

   if (this.doFill) {
      this.drawingContext.fill();
   }

   this.drawingContext.stroke();
},

finishDrawingRectangle: function () {
   if (this.rubberbandW > 0 && this.rubberbandH > 0) {
      if (this.doFill) {
        this.drawingContext.fillRect(this.rubberbandUlhc.x,
                                this.rubberbandUlhc.y,
                                this.rubberbandW, this.rubberbandH) 
      }
      this.drawingContext.strokeRect(this.rubberbandUlhc.x,
                                this.rubberbandUlhc.y,
                                this.rubberbandW, this.rubberbandH); 
   }
},

// Drawing curves................................................

/* Previous version:
drawControlPoint: function () {
   this.drawingContext.save();

   this.drawingContext.strokeStyle = this.CONTROL_POINT_STROKE_STYLE;
   this.drawingContext.fillStyle   = this.CONTROL_POINT_FILL_STYLE;
   this.drawingContext.lineWidth   = 1.0;

   this.drawingContext.beginPath();
   this.drawingContext.arc(this.controlPoint.x, this.controlPoint.y,
                           this.CONTROL_POINT_RADIUS, 0, Math.PI*2, false);
   this.drawingContext.stroke(); 
   this.drawingContext.fill();

   this.drawingContext.restore();
},
*/
drawCurve: function () {
   this.drawingContext.beginPath();
   this.drawingContext.moveTo(this.curveStart.x, this.curveStart.y);
   this.drawingContext.quadraticCurveTo(this.controlPoint.x, this.controlPoint.y,
                                   this.curveEnd.x, this.curveEnd.y);
   this.drawingContext.stroke();
},

finishDrawingCurve: function () {
   this.drawingContext.save();
   this.drawingCanvas.style.cursor = 'crosshair';
   this.drawingContext.strokeStyle = this.strokeStyleSelect.value;
   this.restoreDrawingSurface();
   this.drawingContext.strokeStyle = this.strokeStyleSelect.value;
   this.drawingContext.fillStyle = this.fillStyleSelect.value;
   this.drawingContext.lineWidth = this.lineWidthSelect.value;
   this.drawBezierCurve(); 

   if (this.doFill) {
      this.drawingContext.fillStyle = this.fillStyleSelect.value;
      this.drawingContext.fill();
   }

   this.saveDrawingSurface();
   this.drawingContext.restore();
},

// Guidewires....................................................

drawHorizontalLine: function (y) {
   this.drawingContext.beginPath();
   this.drawingContext.moveTo(0, y+0.5);
   this.drawingContext.lineTo(this.drawingCanvas.width, y+0.5);
   this.drawingContext.stroke();
},

drawVerticalLine: function (x) {
   this.drawingContext.beginPath();
   this.drawingContext.moveTo(x+0.5, 0);
   this.drawingContext.lineTo(x+0.5, this.drawingCanvas.height);
   this.drawingContext.stroke();
},

drawGuidewires: function (x, y) {
   this.drawingContext.save();
   this.drawingContext.strokeStyle = 'rgba(0,0,230,0.4)';
   this.drawingContext.lineWidth = 0.5;
   this.drawVerticalLine(x);
   this.drawHorizontalLine(y);
   this.drawingContext.restore();
},

// START NEW STUFF

// End points and control points......................................

drawControlPoint: function (index) {
   this.drawingContext.beginPath();
   this.drawingContext.arc(this.controlPoints[index].x, this.controlPoints[index].y,
               this.CONTROL_POINT_RADIUS, 0, Math.PI*2, false);
   this.drawingContext.stroke();
   this.drawingContext.fill();
},

drawControlPoints: function () {
   this.drawingContext.save();
   this.drawingContext.strokeStyle = this.CONTROL_POINT_STROKE_STYLE;
   this.drawingContext.fillStyle   = this.CONTROL_POINT_FILL_STYLE;
   this.drawingContext.lineWidth   = 1.0;

   this.drawControlPoint(0);
   this.drawControlPoint(1);

   this.drawingContext.stroke();
   this.drawingContext.fill();
   this.drawingContext.restore();
},

drawEndPoint: function (index) {
   this.drawingContext.beginPath();
   this.drawingContext.arc(this.endPoints[index].x, this.endPoints[index].y,
               this.CONTROL_POINT_RADIUS, 0, Math.PI*2, false);
   this.drawingContext.stroke();
   this.drawingContext.fill();
},

drawEndPoints: function () {
   this.drawingContext.save();
   this.drawingContext.strokeStyle = this.END_POINT_STROKE_STYLE;
   this.drawingContext.fillStyle   = this.END_POINT_FILL_STYLE;
   this.drawingContext.lineWidth   = 1.0;

   this.drawEndPoint(0);
   this.drawEndPoint(1);

   this.drawingContext.stroke();
   this.drawingContext.fill();
   this.drawingContext.restore();
},

drawControlAndEndPoints: function () {
   this.drawControlPoints();
   this.drawEndPoints();
},

cursorInEndPoint: function (loc) {
   var pt, self = this;

   this.endPoints.forEach( function(point) {
      self.drawingContext.beginPath();
      self.drawingContext.arc(point.x, point.y,
                  self.CONTROL_POINT_RADIUS, 0, Math.PI*2, false);

      if (self.drawingContext.isPointInPath(loc.x, loc.y)) {
         pt = point;
      }
   });

   return pt;
},

cursorInControlPoint: function (loc) {
   var pt, self = this;

   this.controlPoints.forEach( function(point) {
      self.drawingContext.beginPath();
      self.drawingContext.arc(point.x, point.y, 
                  self.CONTROL_POINT_RADIUS, 0, Math.PI*2, false);

      if (self.drawingContext.isPointInPath(loc.x, loc.y)) {
         pt = point;
      }
   });

   return pt;
},

updateDraggingPoint: function (loc) {
   this.draggingPoint.x = loc.x;
   this.draggingPoint.y = loc.y;
},

drawBezierCurve: function () {
   this.drawingContext.save();
   this.drawingContext.beginPath();
   this.drawingContext.moveTo(this.endPoints[0].x, this.endPoints[0].y);
   this.drawingContext.bezierCurveTo(this.controlPoints[0].x, this.controlPoints[0].y,
                         this.controlPoints[1].x, this.controlPoints[1].y,
                         this.endPoints[1].x, this.endPoints[1].y);
   this.drawingContext.stroke();
   this.drawingContext.restore();
},

updateEndAndControlPoints: function () {
   this.endPoints[0].x = this.rubberbandUlhc.x;
   this.endPoints[0].y = this.rubberbandUlhc.y;

   this.endPoints[1].x = this.rubberbandUlhc.x + this.rubberbandW;
   this.endPoints[1].y = this.rubberbandUlhc.y  + this.rubberbandH;

   this.controlPoints[0].x = this.rubberbandUlhc.x;
   this.controlPoints[0].y = this.rubberbandUlhc.y  + this.rubberbandH;

   this.controlPoints[1].x = this.rubberbandUlhc.x + this.rubberbandW;
   this.controlPoints[1].y = this.rubberbandUlhc.y;
},

// END NEW STUFF

// Keyboard......................................................

showKeyboard: function () {
   var keyboardElement = document.getElementById('paint-keyboard');

   keyboardElement.style.position = 'absolute';
   keyboardElement.style.height = '370px';
   keyboardElement.style.top = '250px';
   keyboardElement.style.left = '30px';
   keyboardElement.style.border = 'thin inset rgba(0,0,0,0.5)';
   keyboardElement.style.borderRadius = '20px';

   this.keyboard.resize(940, 368);
   this.keyboard.translucent = this.mousedown.y > this.drawingCanvas.height/2;
   this.keyboard.draw();
   this.keyboardVisible = true;
},

hideKeyboard: function () {
   var keyboardElement = document.getElementById('paint-keyboard');

   keyboardElement.style.height = '0px';
   keyboardElement.style.top = '760px';
   keyboardElement.style.border = '';
   keyboardElement.style.borderRadius = '';
   keyboardElement.style.display = 'none';

   this.keyboardVisible = false;
},

// Event handling functions......................................

windowToCanvas: function (canvas, x, y) {
   var bbox = canvas.getBoundingClientRect();
   return { x: x - bbox.left * (canvas.width  / bbox.width),
            y: y - bbox.top  * (canvas.height / bbox.height)
          };
},

mouseDownOrTouchStartInControlCanvas: function (loc) {
   var paint = this;
   
   if (this.editingText) {
      this.editingText = false;
      this.eraseTextCursor();

      if (navigator.platform === 'iPad') {
         this.hideKeyboard();
      }
   }
  
   this.ICON_RECTANGLES.forEach(function(rect) {
      paint.iconContext.beginPath();

      paint.iconContext.rect(rect.x, rect.y, rect.w, rect.h);

      if (paint.iconContext.isPointInPath(loc.x, loc.y)) {
         paint.selectIcon(rect, loc);
         paint.selectedFunction = paint.getIconFunction(rect, loc);

         if (paint.selectedFunction === 'text') {
            paint.drawingCanvas.style.cursor = 'text';
         }
         else {
            paint.drawingCanvas.style.cursor = 'crosshair';
         }
      }
   });
},

// Key event handlers............................................

backspace: function () {
   this.restoreDrawingSurface();
   this.currentText = this.currentText.slice(0, -1);
   this.eraseTextCursor();
},

enter: function () {
   this.finishDrawingText();
   this.mousedown.y += this.drawingContext.measureText('W').width;
   this.saveDrawingSurface();
   this.startDrawingText();
},

insert: function (key) {
   this.currentText += key;
   this.restoreDrawingSurface();
   this.drawCurrentText();
   this.drawTextCursor();
},

eraseTextCursor: function () {
   this.restoreDrawingSurface();
   this.drawCurrentText();
},

drawCurrentText: function () {
   if (this.doFill)
      this.drawingContext.fillText(this.currentText, this.mousedown.x, this.mousedown.y);

   this.drawingContext.strokeText(this.currentText, this.mousedown.x, this.mousedown.y);
},

drawTextCursor: function () {
  var widthMetric = this.drawingContext.measureText(this.currentText),
      heightMetric = this.drawingContext.measureText('W'),
      cursorLoc = {
        x: this.mousedown.x + widthMetric.width,
        y: this.mousedown.y - heightMetric.width + 5
      };

   this.drawingContext.beginPath();
   this.drawingContext.moveTo(cursorLoc.x, cursorLoc.y);
   this.drawingContext.lineTo(cursorLoc.x, cursorLoc.y + heightMetric.width - 12);
   this.drawingContext.stroke();
},

startDrawingText: function () {
   this.editingText = true; 
   this.currentText = '';
   this.drawTextCursor();

   if (navigator.platform === 'iPad')
      this.showKeyboard();
},

finishDrawingText: function () {
   this.restoreDrawingSurface();
   this.drawCurrentText();
},

mouseDownOrTouchStartInDrawingCanvas: function (loc) {
   this.dragging = true;

   if (this.editingText) {
      this.finishDrawingText();
   }
   else if (this.editingCurve) {
      this.draggingPoint = this.cursorInControlPoint(loc);
      
      if (!this.draggingPoint) {
         this.draggingPoint = this.cursorInEndPoint(loc);
      }

      if(!this.draggingPoint) {
         this.restoreDrawingSurface();
         this.finishDrawingCurve();
         this.editingCurve = false;
         this.draggingPoint = false;
         this.dragging = false;
      }
   }

   if (!this.draggingPoint) {
      this.saveDrawingSurface();
      this.mousedown.x = loc.x;
      this.mousedown.y = loc.y;
   
      if (this.selectedFunction === 'path' || this.selectedFunction === 'pathClosed') {
         this.drawingContext.beginPath();
         this.drawingContext.moveTo(loc.x, loc.y);               
      }
      else if (this.selectedFunction === 'text') {
         this.startDrawingText();
      }
      else {
         this.editingText = false;
      }      

      this.lastX = loc.x;
      this.lastY = loc.y;
   }
},

moveControlPoint: function (loc) {
   this.controlPoint.x = loc.x;
   this.controlPoint.y = loc.y;
},

mouseMoveOrTouchMoveInDrawingCanvas: function (loc) {
   if (this.draggingPoint) {
      this.restoreDrawingSurface();

      this.moveControlPoint(loc);

      this.drawingContext.save();

      this.drawGuidewires(loc.x, loc.y);

      this.updateDraggingPoint(loc);
      this.drawControlAndEndPoints();
      this.drawBezierCurve();
   }
   else if (this.dragging) {
      if (this.selectedFunction === 'erase') {
         this.eraseLast();
         this.drawEraser(loc);
      }
      else if (this.selectedFunction === 'slinky') {
         this.drawSlinky(loc);
      }
      else if (this.selectedFunction === 'path' ||
               this.selectedFunction === 'pathClosed') {
         this.drawingContext.lineTo(loc.x, loc.y);
         this.drawingContext.stroke();
      }
      else if (this.selectedFunction === 'curve') {
         this.restoreDrawingSurface();
         this.updateRubberbandRectangle(loc);
         this.updateDraggingPoint(loc);
         this.updateEndAndControlPoints();
         this.drawControlAndEndPoints();
         this.drawBezierCurve();
      }
      else { // For lines, circles, rectangles, and curves, draw rubberbands
         this.restoreDrawingSurface();
         this.updateRubberbandRectangle(loc);
         this.drawRubberband(loc);   
      }

      this.lastX = loc.x;
      this.lastY = loc.y;
   
      this.lastRect.w = this.rubberbandW;
      this.lastRect.h = this.rubberbandH;
   }

   if (this.dragging) {
       if (this.selectedFunction === 'line' ||
           this.selectedFunction === 'rectangle' ||
           this.selectedFunction === 'circle') {
         this.drawGuidewires(loc.x, loc.y);
      }
   }
},

endPath: function (loc) {
   this.drawingContext.lineTo(loc.x, loc.y);
   this.drawingContext.stroke();
                 
   if (this.selectedFunction === 'pathClosed') {
      this.drawingContext.closePath();

      if (this.doFill) {
         this.drawingContext.fill();
      }
      this.drawingContext.stroke();
   }
},

mouseUpOrTouchEndInDrawingCanvas: function (loc) {
   if (this.selectedFunction !== 'erase'  &&
       this.selectedFunction !== 'slinky' &&
       this.selectedFunction !== 'curve') {
      this.restoreDrawingSurface();
   }

   if (this.dragging && ! this.draggingPoint) {
      if (this.selectedFunction === 'erase') { 
         this.eraseLast(); 
      }
      else if (this.selectedFunction === 'path' ||
               this.selectedFunction === 'pathClosed') { 
         this.endPath(loc);
      }
      else {
         if (this.selectedFunction === 'line')      this.finishDrawingLine(loc);
         else if (this.selectedFunction === 'rectangle') this.finishDrawingRectangle();
         else if (this.selectedFunction === 'circle')    this.finishDrawingCircle(loc);
         else if (this.selectedFunction === 'curve') {
            if (!this.editingCurve) {
               this.updateRubberbandRectangle(loc);
               this.drawControlAndEndPoints();

               this.dragging = false;
               this.editing = true;
               this.editingCurve = true;

               this.drawingContext.canvas.style.cursor = 'pointer';

               if (localStorage[this.CURVE_INSTRUCTIONS_LS_KEY] !== 'no') {
                  this.curveInstructions.style.display = 'inline';
               }
            }
            else {
               this.restoreDrawingSurface();
               this.updateRubberbandRectangle(loc);
               this.drawBezierCurve();
            }
         }
     }
   }
   this.dragging = false;
   this.draggingPoint = false;
},

drawBackground: function () {
   this.backgroundContext.canvas.width = this.drawingContext.canvas.width;
   this.backgroundContext.canvas.height = this.drawingContext.canvas.height;

   this.drawGrid(this.backgroundContext, this.GRID_LINE_COLOR, 10, 10);
},
};

function SoMoveControl() {
}

SoMoveControl.prototype.setOnMovelistener = function(canvas) {
    canvas.addEventListener("mousedown", down, false);
    canvas.addEventListener("mousemove", moving, false);
    canvas.addEventListener("mouseup", up, false);
    canvas.addEventListener("mouseout", up, false);

    function down() {

    }

    function moving() {

    }

    function up() {

    }
};

// Enables draggable to white chess pieces
$("#wht-king, #wht-queen, .wht-rook, .wht-pawn, .wht-knight, .wht-bishop").draggable({
    revert: "invalid",
    scope: "accept"
});

// Enables draggable to black chess pieces
$("#blk-king, #blk-queen, .blk-rook, .blk-pawn, .blk-knight, .blk-bishop").draggable({
    revert: "invalid",
    scope: "accept"
});

$(".wht, .blk").droppable({
    scope: "default",
    drop: function (event, ui) {
        onDrop(this,ui);
    }
});

$(document).ready(function () {
    //initial state of the board
    $("#wht-king, #wht-queen, .wht-bishop, .wht-rook, #blk-king, #blk-queen, .blk-bishop, .blk-rook").draggable("option","disabled",true);

});

//used to store the ids of the divs the selected piece can move;
var moveable_blocks = new Array();

//used to store the currently selected piece
var currentPiece;

//Will remove the block highlighting and scope as soon as the mouse is released.
$("#board").mouseup(function (event) {
    setTimeout(resetBlocks,200);
});

function onDrop(block, piece){
    $(piece.draggable).detach();
    // var cp=$(piece.draggable[0]).clone();
    var id = $(block).attr("id");
    $("#"+id).append(currentPiece);

}

function resetBlocks() {
    console.log("reset_blocks");
    for (var x = 0; x < moveable_blocks.length; x++) {
        if ($('#' + moveable_blocks[x]).attr("class").includes("movable-block-blk")) {
            console.log("1");
            $('#' + moveable_blocks[x]).removeClass("movable-block-blk")
                .droppable("option", "scope", "reject");
        } else if ($('#' + moveable_blocks[x]).attr("class").includes("movable-block-wht")) {
            console.log("2");
            $('#' + moveable_blocks[x]).removeClass("movable-block-wht")
                .droppable("option", "scope", "reject");
        }
    }
    moveable_blocks = new Array();
}

//initial positions of pawns
var wht_pawn_init = [9,10,11,12,13,14,15,16];
var blk_pawn_init = [49,50,51,52,53,54,55,56];

//handels the movement of the pawns
$(".wht-pawn").mousedown(function () {
    pawnMovement(this,"wht");
});

$(".blk-pawn").mousedown(function () {
    pawnMovement(this,"blk");
});

function pawnMovement(piece,color){
    var id = $(piece).parent().attr("id");
    currentPiece = ($('#'+id).children()).clone();
    console.log(currentPiece);
    for (var x=0;x<8;x++){
        if (wht_pawn_init[x]==id || blk_pawn_init[x]==id) {
            console.log(color);
            var temp=(Number(id)+16).toString();
            if (color=="blk"){
                temp=(Number(id)-16).toString();
            }

            if ($('#'+temp).attr("class").includes("blk")){
                $('#'+temp).addClass("movable-block-blk")
                    .droppable("option","scope","accept");
            }else if ($('#'+temp).attr("class").includes("wht")){
                $('#'+temp).addClass("movable-block-wht")
                    .droppable("option","scope","accept");
            }

            moveable_blocks.push(temp);
            break;
        }
    }

    id=(Number(id)+8).toString();
    if (color==="blk"){
        id=(Number(id)-16).toString();
    }
    if ($('#'+id).attr("class").includes("blk")){
        $('#'+id).addClass("movable-block-blk")
            .droppable("option","scope","accept");
    }else if ($('#'+id).attr("class").includes("wht")){
        $('#'+id).addClass("movable-block-wht")
            .droppable("option","scope","accept");
    }
    moveable_blocks.push(id);
}









// Enables draggable to white chess pieces
$(".wht-king, .wht-queen, .wht-rook, .wht-pawn, .wht-knight, .wht-bishop").draggable({
    revert: "invalid",
    scope: "accept"
});

// Enables draggable to black chess pieces
$(".blk-king, .blk-queen, .blk-rook, .blk-pawn, .blk-knight, .blk-bishop").draggable({
    revert: "invalid",
    scope: "accept"
});

$(".wht, .blk").droppable({
    scope: "default",
    drop: drop1
});

$(document).ready(function () {
    //initial state of the board
    // $(".wht-king, .wht-queen, .wht-bishop, .wht-rook, .blk-king, .blk-queen, .blk-bishop, .blk-rook").draggable("option","disabled",true);

});

//used to store the ids of the divs the selected piece can move;
var moveable_blocks = new Array();

//used to store the currently selected piece
var currentPiece;

//Will remove the block highlighting and scope as soon as the mouse is released.
$("#board").mouseup(function (event) {
    setTimeout(resetBlocks,200);
});

function drop1(event,ui){
    onDrop(this,ui,false);
}

function drop2(event, ui) {
    onDrop(this,ui,true);
}

//Action to be excuted once a drop is detected
function onDrop(block, piece, capture){
    if (capture) {
        var existingPiece=$(block).children();
        existingPiece.detach();
    }
    $(piece.draggable).detach();
    // var cp=$(piece.draggable[0]).clone();
    var id = $(block).attr("id");
    console.log(id);
    currentPiece.css("top",0);
    currentPiece.css("left",0);
    $("#"+id).append(currentPiece);
}

function resetBlocks() {
    console.log("reset_blocks");
    for (var x = 0; x < moveable_blocks.length; x++) {
        $('#' + moveable_blocks[x]).removeClass("capture-block")
            .droppable("option", "scope", "reject")
            .droppable("option","drop",drop1);
        if ($('#' + moveable_blocks[x]).attr("class").includes("movable-block-blk")) {
            // console.log("1");
            $('#' + moveable_blocks[x]).removeClass("movable-block-blk")
                .droppable("option", "scope", "reject");
        } else if ($('#' + moveable_blocks[x]).attr("class").includes("movable-block-wht")) {
            // console.log("2");
            $('#' + moveable_blocks[x]).removeClass("movable-block-wht")
                .removeClass("capture-block")
                .droppable("option", "scope", "reject");
        }
    }
    moveable_blocks = new Array();
}

//checks whether the destination block is vacant
function isEmpty(id){
    var check=$("#"+id).children();
    // console.log(check.length);
    return !(check.length>0);
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
    captureMovementPawn(id,color);
    currentPiece = $('#'+id).children();
    console.log(currentPiece);
    var empty=isEmpty(Number(id)+8);
    if (color=="blk"){
        empty=isEmpty(Number(id)-8);
    }
    if (empty) {
        for (var x=0;x<8;x++){
            if (wht_pawn_init[x]==id || blk_pawn_init[x]==id) {
                empty=isEmpty(Number(id)+16);
                if (color=="blk"){
                    empty=isEmpty(Number(id)-16);
                    if (wht_pawn_init[x]==id){
                        break;
                    }
                }else{
                    if (blk_pawn_init[x]==id){
                        break;
                    }
                }
                if (empty) {
                    var temp = (Number(id) + 16).toString();
                    if (color == "blk") {
                        temp = (Number(id) - 16).toString();
                    }
                    if ($('#' + temp).attr("class").includes("blk")) {
                        $('#' + temp).addClass("movable-block-blk")
                            .droppable("option", "scope", "accept");
                    } else if ($('#' + temp).attr("class").includes("wht")) {
                        $('#' + temp).addClass("movable-block-wht")
                            .droppable("option", "scope", "accept");
                    }

                    moveable_blocks.push(temp);
                    break;
                }
            }
        }

        if (color==="blk"){
            id=(Number(id)-8).toString();
        }else{
            id=(Number(id)+8).toString();
        }

        if ($('#' + id).attr("class").includes("blk")) {
            $('#' + id).addClass("movable-block-blk")
                .droppable("option", "scope", "accept");
        } else if ($('#' + id).attr("class").includes("wht")) {
            $('#' + id).addClass("movable-block-wht")
                .droppable("option", "scope", "accept");
        }
        moveable_blocks.push(id);
    }
}


function captureMovementPawn(id,color){
    var checkId=Number(id)+7;
    if (color=="blk"){
        checkId=Number(id)-7;
    }
    var empty=isEmpty(checkId);
    if(!empty){
        checkEnemy(checkId,color)
    }
    checkId=Number(id)+9;
    if (color=="blk"){
        checkId=Number(id)-9;
    }
    empty=isEmpty(checkId);
    if(!empty){
        checkEnemy(checkId,color)
    }

}


//ijfasohfapsoiufuhaofiuhhas;sofiuiha;fou
function checkEnemy(id,color){
    if (!($('#' + id).children().attr("class").includes(color))){
        $('#'+id).addClass("capture-block")
            .droppable("option","scope","accept")
            .droppable("option","drop",drop2);
        moveable_blocks.push(id);
    }
}

//handels the movement of the knights
$(".wht-knight").mousedown(function () {
    knightMovement(this,"wht");
});

$(".blk-knight").mousedown(function () {
    knightMovement(this,"blk");
});

var knight_move_pattern=[10,17,15,6]

function knightMovement(piece,color){
    var id = $(piece).parent().attr("id");
    currentPiece = $('#'+id).children();
    var empty;
    for (var x=0;x<knight_move_pattern.length;x++){
        var nextId=Number(id)+knight_move_pattern[x];
        if (!(nextId>64 || nextId<0)) {
            empty = isEmpty(nextId);
            if (empty) {
                setMovableTo(nextId);
            } else {
                checkEnemy(nextId,color);
            }
        }
        nextId=Number(id)-knight_move_pattern[x];
        if (!(nextId>64 || nextId<0)) {
            empty = isEmpty(nextId);
            if (empty) {
                setMovableTo(nextId);
            } else {
                checkEnemy(nextId,color);
            }
        }
    }
}

var firstColoumn=[1,9,17,25,33,41,49,57];
var lastColoumn=[8,16,24,32,40,48,56,64];

//handels the movement of the bishops
$(".wht-bishop").mousedown(function () {
    bishopMovement(this,"wht");
});

$(".blk-bishop").mousedown(function () {
    bishopMovement(this,"blk");
});

function bishopMovement(piece,color){
    var id = $(piece).parent().attr("id");
    currentPiece = $('#'+id).children();
    var nextId=Number(id)+7;
    var empty;
    while (!(nextId>64 || nextId<0)){
        empty=isEmpty(nextId);
        if(empty){
            setMovableTo(nextId);
            nextId=nextId+7;
        }else{
            checkEnemy(nextId);
            break;
        }

        if (nextId%9==0 || nextId%8==0 || nextId==1){
            break;
        }
    }
}










function setMovableTo(nextId){
    console.log(nextId);
    if ($('#' + nextId).attr("class").includes("blk")) {
        $('#' + nextId).addClass("movable-block-blk")
            .droppable("option", "scope", "accept");
    } else if ($('#' + nextId).attr("class").includes("wht")) {
        $('#' + nextId).addClass("movable-block-wht")
            .droppable("option", "scope", "accept");
    }
    moveable_blocks.push(nextId);
}
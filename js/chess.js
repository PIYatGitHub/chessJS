let map = Array(), inf = Array(),
    move_color='white', move_from_x, move_from_y,pawn_attack_x,pawn_attack_y,x_clon,y_clon,from_figure, to_figure,
    save_pawn_figure, save_pawn_x, save_pawn_y, possible_moves, current_move = Array(), can_white_castle_left = true,
    can_white_castle_right = true, can_black_castle_left = true, can_black_castle_right = true,
    white_clock, black_clock,distance_w = 300, distance_b = 300,  is_white_paused = true,is_black_paused = true, white_lost_on_time,
    black_lost_on_time, white_score = 0, black_score = 0, resign = false, accept_draw_flag = false, manual_time_switching = false;

function init_map() {
  can_white_castle_left  = true;
  can_white_castle_right = true;
  can_black_castle_left  = true;
  can_black_castle_right = true;
  map=[
    ["R","P","","","","","p","r"],
    ["N","P","","","","","p","n"],
    ["B","P","","","","","p","b"],
    ["Q","P","","","","","p","q"],
    ["K","P","","","","","p","k"],
    ["B","P","","","","","p","b"],
    ["N","P","","","","","p","n"],
    ["R","P","","","","","p","r"]
  ];
}

function init_inf() {
  inf= [
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""]
  ];
}

function can_move(sx, sy, dx, dy) {
  if(!can_move_from(sx,sy))
    return false;
  if(!can_move_to(dx,dy))
    return false;
  if(!is_correct_move(sx,sy,dx,dy))
    return false;
  if(!is_check_after_move(sx,sy,dx,dy))
    return true;
  return false
}

function find_figure(figure) {
  for(let x = 0; x <= 7; x +=1){
    for(let y = 0; y <= 7; y +=1){
      if(map[x][y] === figure){
        return {x,y}
      }
    }
  }
return {x:-1, y:-1}
}
function is_check_after_move(sx,sy,dx,dy) {
  let check;
  move_figure(sx,sy,dx,dy);
  check = is_check();
  back_figure(sx,sy,dx,dy);
  return check;
}
function is_check() {
  let king;
  king = find_figure(move_color === 'white' ? 'K' : 'k');
  for (let x=0; x<=7; x+=1)
    for (let y=0; y<=7; y+=1)
      if (get_color(x,y) !== move_color)
        if(is_correct_move(x,y, king.x, king.y))
          return true;
  return false;
}

function is_checkmate() {
  if(!is_check()) return false;
  return possible_moves === 0;
}

function is_stalemate() {
  if(is_check()) return false;
  return possible_moves === 0;
}

function is_correct_move(sx,sy,dx,dy) {
  let figure = map[sx][sy];
  if(is_king(figure))    return is_correct_king_move    (sx,sy,dx,dy);
  if(is_queen(figure))   return is_correct_queen_move   (sx,sy,dx,dy);
  if(is_bishop(figure))  return is_correct_bishop_move  (sx,sy,dx,dy);
  if(is_knight(figure))  return is_correct_knight_move  (sx,sy,dx,dy);
  if(is_rook(figure))    return is_correct_rook_move    (sx,sy,dx,dy);
  if(is_pawn(figure))    return is_correct_pawn_move    (sx,sy,dx,dy);
  return false;
}

function is_king(figure)  {return figure.toUpperCase() === 'K'; }
function is_queen(figure) {return figure.toUpperCase() === 'Q'; }
function is_bishop(figure){return figure.toUpperCase() === 'B'; }
function is_knight(figure){return figure.toUpperCase() === 'N'; }
function is_rook(figure)  {return figure.toUpperCase() === 'R'; }
function is_pawn(figure)  {return figure.toUpperCase() === 'P'; }

function is_correct_king_move(sx,sy,dx,dy) {
  if (Math.abs(dx-sx)<=1 && Math.abs(dy-sy)<=1) return true;
  return can_castle(sx,sy,dx,dy);
}

function can_castle(sx,sy,dx,dy) {
  let figure = map[sx][sy];
  if (figure === 'K'
      && sx === 4 && sy === 0
      && dx === 6 && dy === 0) return white_castle_to_the_right();
  if (figure === 'K'
      && sx === 4 && sy === 0
      && dx === 2 && dy === 0) return white_castle_to_the_left();

  if (figure === 'k'
      && sx === 4 && sy === 7
      && dx === 6 && dy === 7) return black_castle_to_the_right();
  if (figure === 'k'
      && sx === 4 && sy === 7
      && dx === 2 && dy === 7) return black_castle_to_the_left();
  return false;
}

function white_castle_to_the_right() {
  if(!can_white_castle_right)       return false;
  if(is_check())                    return false;
  if(is_check_after_move(4,0,5,0))  return false;
  if(!is_empty(5,0))                return false;
  if(!is_empty(6,0))                return false;
  if(map[7][0]!=='R')               return false;
  return true;
}

function white_castle_to_the_left () {
  if(!can_white_castle_left)        return false;
  if(is_check())                    return false;
  if(is_check_after_move(4,0,3,0))  return false;
  if(!is_empty(3,0))                return false;
  if(!is_empty(2,0))                return false;
  if(!is_empty(1,0))                return false;
  if(map[0][0]!=='R')               return false;
  return true;
}

function black_castle_to_the_right() {
  if(!can_black_castle_right)       return false;
  if(is_check())                    return false;
  if(is_check_after_move(4,7,5,7))  return false;
  if(!is_empty(5,7))                return false;
  if(!is_empty(6,7))                return false;
  if(map[7][7]!=='r')               return false;
  return true;
}

function black_castle_to_the_left () {
  if(!can_black_castle_left)        return false;
  if(is_check())                    return false;
  if(is_check_after_move(4,7,3,7))  return false;
  if(!is_empty(3,7))                return false;
  if(!is_empty(2,7))                return false;
  if(!is_empty(1,7))                return false;
  if(map[0][7]!=='r')               return false;
  return true;
}

function is_correct_queen_move(sx,sy,dx,dy) {return is_correct_line_move(sx,sy,dx,dy, "Q");}
function is_correct_bishop_move(sx,sy,dx,dy){return is_correct_line_move(sx,sy,dx,dy, "B");}
function is_correct_rook_move(sx,sy,dx,dy)  {return is_correct_line_move(sx,sy,dx,dy, "R");}

function is_correct_knight_move(sx,sy,dx,dy) {
  if (Math.abs(dx - sx) === 1 && Math.abs(dy - sy) === 2) return true;
  if (Math.abs(dx - sx) === 2 && Math.abs(dy - sy) === 1) return true;
  return false;
}

function is_correct_line_move(sx,sy,dx,dy,figure) {
  let delta_x =Math.sign(dx-sx), delta_y=Math.sign(dy-sy);
  if(!is_correct_line_delta(delta_x, delta_y, figure)) {return false;}
  do{
    sx+=delta_x;
    sy+=delta_y;
    if(sx===dx && sy===dy) return true;
  } while (is_empty(sx,sy));
  return false;
}

function is_correct_line_delta(delta_x, delta_y, figure) {
  if (is_rook(figure)) return is_correct_rook_delta(delta_x, delta_y);
  if (is_bishop(figure)) return is_correct_bishop_delta(delta_x, delta_y);
  if (is_queen(figure)) return is_correct_queen_delta();
  return false;
}

function is_correct_rook_delta(delta_x, delta_y)    {return Math.abs(delta_x)+Math.abs(delta_y)===1;}
function is_correct_bishop_delta(delta_x, delta_y)  {return Math.abs(delta_x)+Math.abs(delta_y)===2;}
function is_correct_queen_delta()                   {return true}

function is_empty(x,y) {
  if(!on_map(x,y)) return false;
  return map[x][y] ==="";
}

function on_map(x,y) {return (x>=0 && x<=7 && y>=0 && y<=7);}

function is_correct_pawn_move(sx,sy,dx,dy) {
  if(sy<1 || sy>6) return false;
  if(get_color(sx,sy) ==='white') return is_correct_sign_pawn_move(sx,sy,dx,dy, 1);
  if(get_color(sx,sy) ==='black') return is_correct_sign_pawn_move(sx,sy,dx,dy,-1);
}

function is_correct_sign_pawn_move(sx,sy,dx,dy,sign) {
  if(is_pawn_passant(sx,sy,dx,dy,sign)) return true;
  if(!is_empty(dx,dy)){
    if(Math.abs(dx - sx)!==1) return false;
    return dy - sy === sign;
  }
  if(dx !== sx) return false;
  if(dy-sy === sign) return true;
  if(dy-sy === 2*sign) {
    if(sy !== 1 && sy !== 6) return false;
    return is_empty(sx, sy + sign);
  }
  return false;
}

function is_pawn_passant(sx,sy,dx,dy,sign){
  if(!(dx===pawn_attack_x && dy===pawn_attack_y))  return false;
  if(sign === 1 && sy !== 4) return false;
  if(sign === -1 && sy !== 3) return false;
  if(dy-sy !== sign) return false;
  return (Math.abs(dx - sx) === 1);
}

function mark_moves_from() {
  init_inf();
  possible_moves = 0;
  for (let sx=0; sx<=7; sx+=1)
    for (let sy=0; sy<=7; sy+=1)
      for (let dx=0; dx<=7; dx+=1)
        for (let dy=0; dy<=7; dy+=1)
      if(can_move(sx,sy,dx,dy)) {inf[sx][sy] = '1'; possible_moves += 1;}
}

function mark_moves_to() {
  init_inf();
  for (let x=0; x<=7; x+=1){
    for (let y=0; y<=7; y+=1){
      if(can_move (move_from_x, move_from_y,x,y)){
        inf[x][y] = '2';
      }
    }
  }
}
function can_move_from(x,y) {
  if(!on_map(x,y)) return false;
  return get_color(x,y) === move_color;
}

function can_move_to(x,y) {
  if(!on_map(x,y)) return false;
  if(map[x][y] === "") return true;
  return get_color(x,y) !== move_color;
}

function get_color(x,y) {
  let figure = map[x][y];
  if(figure === '') return "";
 return(figure.toUpperCase() === figure) ? 'white':'black';
}

function click_box(x,y) {
 if(inf[x][y] === '1'){
   click_box_from(x,y);
 } else if (inf[x][y] === '2'){
  click_box_to(x,y);
 }
}

function click_box_from(x,y) {
  move_from_x = x;
  move_from_y=y;
  mark_moves_to();
  show_board();
}

function move_figure(sx,sy,dx,dy) {
  from_figure = map[sx][sy];
  to_figure = map[dx][dy];
  map[dx][dy] = from_figure;
  map[sx][sy] = "";
  move_pawn_attack(from_figure, dx, dy);

}

function back_figure(sx,sy,dx,dy) {
  map[sx][sy] = from_figure;
  map[dx][dy] = to_figure;
  back_pawn_attack();
}

function click_box_to(to_x,to_y) {
  form_current_move(move_from_x,move_from_y,to_x,to_y);
  move_figure(move_from_x,move_from_y,to_x, to_y);
  if((to_y === 7 || to_y === 0) &&
    is_pawn(from_figure)){document.getElementById('pawnPromoteModal').style.display = 'block'; x_clon = to_x; y_clon = to_y;}
  update_castle_flags(move_from_x,move_from_y,to_x,to_y);
  move_casltling_rook(move_from_x,move_from_y,to_x,to_y);
  check_pawn_attack(from_figure,to_x, to_y);
  turn_move();
  mark_moves_from();
  if(is_checkmate() || is_stalemate()) {
    clearInterval(black_clock);
    clearInterval(white_clock);
    document.getElementById('newGame').style.display='inline';
  }
  endGame();
  form_current_move_aux();
  show_board();
}

function form_current_move(move_from_x,move_from_y,to_x,to_y) {
  //TODO Refine that into two columns and stuff///
  let mapToLetter = ['a','b','c','d','e','f','g','h'], entry = '';
  if(map[move_from_x][move_from_y].toUpperCase()!=='P') entry += map[move_from_x][move_from_y];
  console.log('map tox toy',map[to_x][to_y]);
  if(map[to_x][to_y] !== '') entry += ' X ';
  entry += `${mapToLetter[move_from_x]}${move_from_y+1} ${map[to_x][to_y]} ${mapToLetter[to_x]}${to_y+1}`;
  if(map[move_from_x][move_from_y] === 'K' && can_white_castle_left &&  to_x ===2) {entry += ' O-O-O';}
  if(map[move_from_x][move_from_y] === 'K' && can_white_castle_right && to_x ===6) {entry += ' O-O'  ;}
  if(map[move_from_x][move_from_y] === 'k' && can_black_castle_left &&  to_x ===2) {entry += ' O-O-O';}
  if(map[move_from_x][move_from_y] === 'k' && can_black_castle_right && to_x ===6) {entry += ' O-O'  ;}
  current_move.push(entry);
  current_move.push("<br/>");
}
function form_current_move_aux(){
  if(is_check() && possible_moves !== 0)      current_move[current_move.length-2] += ' +';
  if(is_checkmate() && possible_moves === 0)  current_move[current_move.length-2] += ' #';
}


function update_castle_flags(from_x, from_y, to_x, to_y) {
  let figure = map[to_x][to_y];
  if(figure === 'K'){can_white_castle_left  = false; can_white_castle_right = false; }
  if(figure === 'k'){can_black_castle_left  = false; can_black_castle_right = false; }
  if(figure === 'R' && from_x === 0 && from_y === 0){can_white_castle_left  = false; }
  if(figure === 'R' && from_x === 7 && from_y === 0){can_white_castle_right = false; }
  if(figure === 'r' && from_x === 0 && from_y === 7){can_black_castle_left  = false; }
  if(figure === 'r' && from_x === 7 && from_y === 7){can_black_castle_right = false; }
}

function move_casltling_rook(from_x,from_y,to_x,to_y) {
  if(!is_king(map[to_x][to_y])) return;
  if(Math.abs(to_x-from_x)!==2) return;
  if(to_x === 6 && to_y === 0) {map[7][0] = ''; map [5][0] = 'R';}
  if(to_x === 2 && to_y === 0) {map[0][0] = ''; map [3][0] = 'R';}
  if(to_x === 6 && to_y === 7) {map[7][7] = ''; map [5][7] = 'r';}
  if(to_x === 2 && to_y === 7) {map[0][7] = ''; map [3][7] = 'r';}
}

function promote_pawn(from_figure, x_clon, y_clon, user_restored_figure) {
  let fancy_dialog = document.getElementById('pawnPromoteModal');
  if(move_color === 'white')
    user_restored_figure = user_restored_figure.toLowerCase();
  else
    user_restored_figure = user_restored_figure.toUpperCase();
    map[x_clon][y_clon] = user_restored_figure;
    fancy_dialog.style.display = 'none';
    show_board();
}
function move_pawn_attack(from_figure, to_x, to_y) {
  let y;
  if(is_pawn(from_figure)){
    if(to_x === pawn_attack_x && to_y === pawn_attack_y){
      y = move_color === 'white' ? to_y-1 : to_y+1;
      save_pawn_figure =  map[to_x][y];
      save_pawn_x = to_x;
      save_pawn_y = y;
      map[to_x][y] = '';
    }
  }
}
function back_pawn_attack() {
  if(save_pawn_x === -1) return;
  if(save_pawn_x && save_pawn_y && save_pawn_figure){
    map[save_pawn_x][save_pawn_y] = save_pawn_figure;
  }
}
function check_pawn_attack(from_figure, to_x, to_y) {
  pawn_attack_x = -1;
  pawn_attack_y = -1;
  save_pawn_x = -1;
  if(is_pawn(from_figure)){
    if(Math.abs(to_y-move_from_y)){
      pawn_attack_x = move_from_x;
      pawn_attack_y = (move_from_y + to_y)/2;
    }
  }
}

function turn_move() {move_color = (move_color === 'white')?'black':'white';
  alternate_time(move_color);
}

function figure_to_html(figure) {
  switch (figure){
    case "K": return "&#9812;"; case "k": return "&#9818;";
    case "Q": return "&#9813;"; case "q": return "&#9819;";
    case "R": return "&#9814;"; case "r": return "&#9820;";
    case "B": return "&#9815;"; case "b": return "&#9821;";
    case "N": return "&#9816;"; case "n": return "&#9822;";
    case "P": return "&#9817;"; case "p": return "&#9823;";
    default:  return "&nbsp;";
  }
}
function show_board() {
  let html = '<table border = "1">';
  for(let y = 7; y >= 0; y -=1){
    html += '<tr class="chessRow">';
    for(let x = 0; x <= 7; x +=1){
      let color;
      if(inf[x][y] === ""){
        color = (x + y)%2 === 0 ? "#393939" : "#e5e5e5";
      } else {
        color = (inf[x][y] === "1") ?"#92d5b8" : "#D6D6AD" ;
      }
      if(get_color(x,y) === 'white'){
        html+="<td class='fields' style='height:80px; width:80px; " +
          "font-size:60px; color:#d2822f;"+
          "background-color: "+color+"' onclick='click_box(" + x + "," +y +");'>";
        html+=figure_to_html(map[x][y]);
        html+="</td>"
      } else {
        html+="<td class='fields' style='height:80px; width:80px; " +
          "font-size:60px; color:#F2574F;"+
          "background-color: "+color+"' onclick='click_box(" + x + "," +y +");'>";
        html+=figure_to_html(map[x][y]);
        html+="</td>"
      }

    }
    html += "</tr>";
  }
  document.getElementById('board').innerHTML = html;
  show_info();
}

function show_info() {
  let html = "Who is on the move? " + move_color + "<br/>", curr_move = current_move.join("");
  html+= curr_move;
  document.getElementById('moves').innerHTML = html;
}

function show_loader(time){
  let loader =  document.getElementById('loader');
  loader.style.display='block';
  setTimeout(function () {loader.style.display='none'; show_startup_screen();}, time);
}

function show_startup_screen() {document.getElementById('startNewGame').style.display='block';}

function parse_game_prefs(){

  start_new_game();
}

function start_new_game() {
  document.getElementById('startNewGame').style.display='none';
  init_map();
  move_color = 'white';
  mark_moves_from();
  white_clock = setInterval(init_timers('white'),1000);
  black_clock = setInterval(init_timers('black'),1000);
  if(!manual_time_switching) {
    document.getElementById('wc_man').style.display = 'none';
    document.getElementById('bc_man').style.display = 'none';
  }
  if(document.getElementById('newGame').style.display === 'inline') {
    document.getElementById('newGame').style.display='none';
  }
  show_board();
}

function init_timers(color) {
  if (color === 'white') {
    return function() {
      let seconds = Math.floor(distance_w%60);
      document.getElementById("min_white").innerHTML = Math.floor(distance_w/60).toString();
      if (seconds <10) document.getElementById("sec_white").innerHTML = '0' + seconds;
      else  document.getElementById("sec_white").innerHTML = seconds.toString();
      if (distance_w < 0) {
        clearInterval(white_clock);
        document.getElementById("min_white").innerHTML = 'NO';
        document.getElementById("sec_white").innerHTML = 'TIME';
        white_lost_on_time = true;
        endGame();
      }
      if(!is_white_paused) distance_w-=1;
    }
  } else{
    return function() {
        let seconds = Math.floor(distance_b%60);
        document.getElementById("min_black").innerHTML =  Math.floor(distance_b/60).toString();
         if (seconds <10)  document.getElementById("sec_black").innerHTML = '0' + seconds;
         else document.getElementById("sec_black").innerHTML = seconds.toString();
         if (distance_b < 0) {
          clearInterval(black_clock);
          document.getElementById("min_black").innerHTML = 'NO';
          document.getElementById("sec_black").innerHTML = 'TIME';
          black_lost_on_time = true;
          endGame();
        }
        if(!is_black_paused) distance_b-=1;
      }
    }
}

function alternate_time(flag){
  if(flag === 'white') {
    is_white_paused = false;
    is_black_paused = true;
  } else if(flag === 'black') {
    is_white_paused = true;
    is_black_paused = false;
  }
}

function offer_draw() {document.getElementById('offerDraw').style.display = 'block';}
function accept_draw(){
  document.getElementById('offerDraw').style.display = 'none';
  document.getElementById('newGame').style.display='inline';
  accept_draw_flag = true;
  endGame();
}
function reject_draw() {
  document.getElementById('offerDraw').style.display = 'none';
  accept_draw_flag = false;
}
function open_resign_modal() {document.getElementById('resignModal').style.display = 'block';}
function hide_resign_modal() {document.getElementById('resignModal').style.display = 'none';}

function resignGame() {
    resign = true;
    endGame();
    document.getElementById('resignModal').style.display = 'none';
    document.getElementById('newGame').style.display='inline';
    resign = false;
}

 function endGame() {
    let s_white = document.getElementById('s_white'),
        s_black = document.getElementById('s_black');
    try {
      if(white_lost_on_time){
        reset_game();
        black_score+=1;
        document.getElementById('newGame').style.display='inline';
      }else if(black_lost_on_time){
        reset_game();
        white_score+=1;
        document.getElementById('newGame').style.display='inline';
      }else if(is_checkmate()){
        reset_game();
        move_color ==='white'?black_score +=1:white_score+=1;
      } else if(is_stalemate() || accept_draw_flag){
        reset_game();
        black_score +=0.5;white_score+=0.5;
      } else if(resign){
        reset_game();
        move_color ==='white'?black_score +=1:white_score+=1;
      }
    } catch (e) {

    }finally {
      s_black.innerHTML = black_score.toString();
      s_white.innerHTML = white_score.toString();
    }
}

function reset_game() {
  init_inf();
  clearInterval(black_clock);
  clearInterval(white_clock);
  white_lost_on_time = false; black_lost_on_time = false; accept_draw_flag = false; resign = false;
  distance_w = distance_b = 300;
  is_white_paused = true;is_black_paused = true; manual_time_switching = false;
  can_white_castle_left = true;can_white_castle_right = true; can_black_castle_left = true; can_black_castle_right = true;
}
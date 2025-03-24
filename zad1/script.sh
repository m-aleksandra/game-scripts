#!/bin/bash

BOARD_FILE="tic_tac_toe.save"
END_GAME=false
IS_PVP=false
PLAYERS=("X" "O")
WIN_PATTERNS=(
    "012"  # Top row
    "345"  # Middle row
    "678"  # Bottom row
    "036"  # Left column
    "147"  # Middle column
    "258"  # Right column
    "048"  # Main diagonal
    "246"  # Anti-diagonal
)

display_numbered_board() {
    echo "Board positions: "
    echo " 0 | 1 | 2 "
    echo "---+---+---"
    echo " 3 | 4 | 5 "
    echo "---+---+---"
    echo " 6 | 7 | 8 "
}

display_board() {
    echo "Current board state: "
    echo " ${BOARD:0:1} | ${BOARD:1:1} | ${BOARD:2:1} "
    echo "---+---+---"
    echo " ${BOARD:3:1} | ${BOARD:4:1} | ${BOARD:5:1} "
    echo "---+---+---"
    echo " ${BOARD:6:1} | ${BOARD:7:1} | ${BOARD:8:1} "
}

get_next_player() {
    x_count=$(grep -o "X" <<< "$BOARD" | wc -l)
    o_count=$(grep -o "O" <<< "$BOARD" | wc -l)

    if [[ "$x_count" -le "$o_count" ]]; then
        TURN=0
    else
        TURN=1
    fi
}

check_end() {
    empty_count=$(grep -o " " <<< "$BOARD" | wc -l)
    if [[ "$empty_count" -eq 0 ]]; then
        END_GAME=true
        echo "It's a tie!"
        if [[ "$IS_PVP" == true ]]; then
            rm -f "$BOARD_FILE"
        fi
        exit 0
    fi
}

check_win() {
    for pattern in "${WIN_PATTERNS[@]}"; do
        a=${BOARD:${pattern:0:1}:1}
        b=${BOARD:${pattern:1:1}:1}
        c=${BOARD:${pattern:2:1}:1}
        
        if [[ "$a" != " " && "$a" == "$b" && "$b" == "$c" ]]; then
            echo "Player $a wins!"
            END_GAME=true
            display_board
            if [[ "$IS_PVP" == true ]]; then
                rm -f "$BOARD_FILE"
            fi
            exit 0
        fi
    done
}

save_game() {
    echo "$BOARD" > "$BOARD_FILE"
}

user_move() {
    echo -n "Enter your move ${PLAYERS[$TURN]} (0-8): "
    read -r i

    if [[ "$i" =~ ^[0-8]$ ]] && [[ ${BOARD:$i:1} == " " ]]; then
        BOARD="${BOARD:0:i}${PLAYERS[$TURN]}${BOARD:i+1}"
        check_win
        check_end
    else
        echo "Invalid move"
        user_move
    fi
}

computer_move() {
    echo "Computer (O) move..."

    empty_positions=()
    for idx in {0..8}; do
        if [[ ${BOARD:$idx:1} == " " ]]; then
            empty_positions+=("$idx")
        fi
    done

    if [[ ${#empty_positions[@]} -gt 0 ]]; then
        move=$(printf '%s\n' "${empty_positions[@]}" | shuf -n 1)
        BOARD="${BOARD:0:move}O${BOARD:move+1}"
    
        check_win
        check_end
    fi
}

echo "1 - player vs player game (new)"
echo "2 - player vs player game (saved)"
echo "3 - player vs computer game"
echo -n "Choose option (1-3): "
read -r choice

if [[ "$choice" == '1' ]]; then
    echo "player vs player"
    echo "New game"
    BOARD="         "
    TURN=0
    IS_PVP=true  
elif [[ "$choice" == '2' && -f "$BOARD_FILE" ]]; then
    BOARD=$(< "$BOARD_FILE")
    get_next_player
    IS_PVP=true  
elif [[ "$choice" == '3' ]]; then
    echo "computer vs human"
    echo "New game"
    BOARD="         "
    TURN=0
else 
    echo "Invalid choice"
    exit 1
fi

while [ "$END_GAME" = false ]; do
    display_board
    display_numbered_board
    user_move

    if [[ "$choice" == '3' ]]; then
        # player vs computer
        computer_move
    else
        # 2 players
        TURN=$((1 - TURN))
        save_game
    fi
done

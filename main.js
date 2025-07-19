let board = function () {

    let gameBoard = [['', '', ''], ['', '', ''], ['', '', '']]

    function get(x, y) {
        if (x > 2 || x < 0 || y > 2 || y < 0) {
            return null
        }
        return gameBoard[x][y]
    }

    function set(x, y, value) {
        if (x > 2 || x < 0 || y < 0 || y > 2) {
            return false
        }
        gameBoard[x][y] = value
        return true
    }

    function print() {
        console.log(gameBoard)
    }

    function checkComplete() {
        for (let i = 0; i <= 2; i++){
            for (let j = 0; j <= 2; j++){
                if (gameBoard[i][j] == "") {
                    return false
                }
            }
        }
        return true;
    }

    function check_win(x, y, value) {
        return check_row(x, value) || check_column(y, value) || check_diagnol(x, y, value)
    }

    function check_row(x, value) {
        for (let i = 0; i <= 2; i++) {
            if (gameBoard[x][i] != value) {
                return false;
            }
        }
        return true;
    }

    function check_column(y, value) {
        for (let i = 0; i <= 2; i++) {
            if (gameBoard[i][y] != value) {
                return false;
            }
        }
        return true;
    }

    function check_diagnol(x, y, value) {
        function check_diagnol1() {
            for (let i = 0; i <= 2; i++) {
                if (gameBoard[i][i] != value) {
                    return false
                }
            }
            return true;
        }
        function check_diagnol2() {
            let j = 0;
            for (let i = 2; i >= 0; i--) {
                if (gameBoard[j][i] != value) {
                    return false
                }
                j += 1
            }
            return true
        }
        if (x == 1 && y == 1) {
            return check_diagnol1() || check_diagnol2()
        }
        else if ((x == 0 && y == 0) || (x == 2 && y == 2)) {
            return check_diagnol1()
        } else if ((x == 2 && y == 0) || (x == 0 && y == 2)) {
            return check_diagnol2()
        }
        return false
    }



    return {
        set,
        get,
        print,
        checkComplete,
        check_win
    }
}()

let player = function (name, value) {
    return { name, value }
}


let controller = function (board) {


    function startgame() {
        let nameA = prompt("Enter name of player A ")
        let valueA = prompt("Enter your symbol ( X or O): ")
        let nameB = prompt("Enter name of player B ")
        let valueB = valueA == "X" ? "O" : "X"
        let playerA = valueA == "X" ? player(nameA, valueA) : player(nameB, valueB)
        let playerB = valueA == "O" ? player(nameA, valueA) : player(nameB, valueB)

        let turn = "X";
        while (true) {
            console.log(`player ${turn == "X" ? playerA.name : playerB.name}'s Turn, Enter x and y co-ordinates`)
            let x = prompt("Enter X")
            let y = prompt("Enter y")
            if (board.get(x, y) == "")
                board.set(x, y, turn)
            else {
                alert("Already filled cell, choose another")
                continue
            }
            if (board.check_win(x, y, turn)) {
                console.log(`player ${turn == "X" ? playerA.name : playerB.name}' has won the game!!!`)
                return
            }
            if (board.checkComplete()) {
                console.log("No one has one, it was a tight match!!")
                return
            }
            turn = turn == "X" ? "O" : "X";

            board.print()
        }

    }

    return {startgame}
    
}(board)

controller.startgame()
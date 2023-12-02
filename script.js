let game;

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const dropToken = (row, column, player) => {
        //   const availableCells = board.filter((row) => row[column].getValue() === 0).map(row => row[column]);

        //   if (!availableCells.length) return;
        if (board[row][column].getValue() === "") {
            board[row][column].addToken(player);
        }
        else {
            alert("Invalid move, try again");
            throw "Invalid move";
        }
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return { getBoard, dropToken, printBoard };
}

function Cell() {
    let value = "";

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

function GameController(
    playerOneName = document.getElementById("P1").value,
    playerTwoName = document.getElementById("P2").value
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];
    console.log(playerOneName);
    console.log(playerTwoName);

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };


    const checkWinner = () => {
        const board = game.getBoard();

        // Check rows
        for (let i = 0; i < 3; i++) {
            if (
                board[i][0].getValue() !== "" &&
                board[i][0].getValue() === board[i][1].getValue() &&
                board[i][1].getValue() === board[i][2].getValue()
            ) {
                return board[i][0].getValue();
            }
        }

        // Check columns
        for (let i = 0; i < 3; i++) {
            if (
                board[0][i].getValue() !== "" &&
                board[0][i].getValue() === board[1][i].getValue() &&
                board[1][i].getValue() === board[2][i].getValue()
            ) {
                return board[0][i].getValue();
            }
        }

        // Check diagonals
        if (
            board[0][0].getValue() !== "" &&
            board[0][0].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][2].getValue()
        ) {
            return board[0][0].getValue();
        }

        if (
            board[0][2].getValue() !== "" &&
            board[0][2].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][0].getValue()
        ) {
            return board[0][2].getValue();
        }

        return null; // No winner yet
    };

    const isBoardFull = () => {
        const currentBoard = board.getBoard();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (currentBoard[i][j].getValue() === "") {
                    return false; // There is an empty cell, game is not full
                }
            }
        }
        return true; // All cells are filled, game is full
    };

    const endGame = (result) => {
        const playerTurnDiv = document.querySelector('.turn');
        const gameover = document.createElement('div');
        gameover.setAttribute("class","result");

        if (result === "draw") {
            console.log("It's a draw!");
            gameover.innerHTML = `It's a draw!`;
        } else {
            if (result == "X") {
                console.log(`${playerOneName} is the winner!`);
                gameover.innerHTML = `${playerOneName} is the winner!`;
            }
            else {
                console.log(`${playerTwoName} is the winner!`);
                gameover.innerHTML = `${playerTwoName} is the winner!`;
            }
        }
        if (playerTurnDiv) playerTurnDiv.replaceWith(gameover);

    };


    const playRound = (row, column) => {
        console.log(
            `Dropping ${getActivePlayer().name}'s token into row ${row} and ${column}...`
        );
        board.dropToken(row, column, getActivePlayer().token);

        const winner = checkWinner();
        if (winner) {
            endGame(winner);
        } else if (isBoardFull()) {
            endGame("draw");
        } else {
            switchPlayerTurn();
            printNewRound();
        }
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        checkWinner,
        endGame
    };
}

function ScreenController() {
    game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = "";

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn`


        // Render board squares
        board.forEach(row => {
            row.forEach((cell, index) => {
                // Anything clickable should be a button!!
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                // Create a data attribute to identify the column
                // This makes it easier to pass into our `playRound` function 
                cellButton.dataset.column = index
                cellButton.dataset.row = board.indexOf(row)
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })

    }

    // Add event listener for the board
    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        // Make sure I've clicked a column and not the gaps in between
        if (!selectedColumn || !selectedRow) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();

        // alert("GEIASU")
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    // Initial render
    updateScreen();

    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

// ScreenController();
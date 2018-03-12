import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'tachyons';
import { Button, Header, Icon } from 'semantic-ui-react';

//Create components 
//Create and fill grid 

class App extends React.Component {
    constructor(){
        super()
        this.speed = 200
        this.rows = 30
        this.columns = 50
        
        this.state = {
            grid: Array(this.rows).fill().map(() => Array(this.columns).fill({cellState: 0, status: ""})),
            generations: 0,
        }
    }
    componentDidMount(){
        this.seed()
        // this.runButton()
    }

    seed = () => {
        let gridCopy = arrayClone(this.state.grid)
        gridCopy.map((row, i) => 
            row.map((col, j) => 
                gridCopy[i][j].cellState = Math.floor((Math.random() * 2))))
        this.setState({
            grid: gridCopy,
            generations: 0
        })
    }

    handleCellClick = (row, col) => {
        let gridCopy = arrayClone(this.state.grid)
        if(gridCopy[row][col].cellState === 1) gridCopy[row][col].cellState = 0
        else if (gridCopy[row][col].cellState === 0) gridCopy[row][col].cellState = 1
        this.setState({ grid: gridCopy })
    }

    handleRunClick = () => {
        this.runButton()
    }

    handlePauseClick = () => {
        clearInterval(this.intervalId)
    }

    handleNewGridClick = () => {
        if(this.intervalId){
            clearInterval(this.intervalId)
        }
        this.seed()
    }

    handleClearGridClick = () => {
        clearInterval(this.intervalId)
        let grid = Array(this.rows).fill().map(() => Array(this.columns).fill({cellState: 0, status: ""}))
        this.setState({ grid: grid, generations: 0 })
        
    }

    handleSpeedClick = (speed) => {
        clearInterval(this.intervalId)
        this.speed = speed
        this.runButton()
    }


    runButton = () => {
        this.intervalId = setInterval(this.run, this.speed)
    }

    run = () => {
        let grid = this.state.grid 
        let nextGrid = arrayClone(this.state.grid)
        let generations = this.state.generations

        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columns; j++){
                let cellState = grid[i][j].cellState
                let neighbours = this.countNeighbours(grid, i, j)

                if(cellState === 0 && neighbours === 3){
                    nextGrid[i][j].cellState = 1
                    nextGrid[i][j].status = "newborn"
                } else if (cellState === 1 && (neighbours < 2)) {
                    nextGrid[i][j].cellState = 0;
                    nextGrid[i][j].status = "dead"
                  } else if(cellState === 1 && (neighbours > 3)) {
                    nextGrid[i][j].cellState = 0;
                    nextGrid[i][j].status = "dead"
                  } else {
                      nextGrid[i][j].cellState = cellState
                      nextGrid[i][j].status = "static"
                  }
            }
        }
        generations++
        this.setState({ grid: nextGrid, generations: generations })
    }

    countNeighbours = (grid, x , y) => {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let row = (x + i + this.rows) % this.rows;
                let col = (y + j + this.columns) % this.columns;
                sum += grid[row][col].cellState;
            }
        }
        sum -= grid[x][y].cellState;
        return sum;
    }

    

    render(){
        return (
            <div>
                <div className="mt5 mb4">
                    <div className="flex justify-center mb0">
                        <Button icon="bug" circular inverted color="purple" size="massive"/>
                    </div>
                    <Header as="h2" textAlign="center" color="purple">
                        <Header.Content className="header">
                            The Game of Life
                        </Header.Content>
                        <p className="f4 mt2">Generations: {this.state.generations}</p>
                    </Header>
                </div>
                <div className="mt5">
                    <Grid
                        grid={this.state.grid}
                        rows={this.rows}
                        columns={this.columns}
                        onClick={this.handleCellClick}
                        width={this.width}
                        height={this.height}
                    />
                    <BasicControls
                        onRunClick={this.handleRunClick}
                        onPauseClick={this.handlePauseClick}
                        onNewGridClick={this.handleNewGridClick}
                        onClearGridClick={this.handleClearGridClick}
                    />
                    <SpeedControls
                        onSpeedClick={this.handleSpeedClick}
                    />
                </div>
            </div>
        )
    }
}

class Grid extends React.Component {
    createCell(i, j){
    //    let cellClass = "cell " + this.props.grid[i][j].status
    let cellClass;
    if(this.props.grid[i][j].cellState == 1 && this.props.grid[i][j].status == "newborn"){
        cellClass = "cell newborn"
    } 
    else if (this.props.grid[i][j].cellState == 1) {
        cellClass = "cell live"
    } else {
        cellClass = "cell dead"
    }
    
        return (
            <Cell
                row={i}
                col={j}
                cellClass={cellClass}
                onClick={this.props.onClick}
            />
        )
    }
    render(){
        const width = this.props.columns * 14
        return (
     
            <div className="grid" style={{width: width}}>

                {this.props.grid.map((row, i) =>    
                    (row.map((col, j) =>    
                        this.createCell(i, j)   
                    )))}
            </div>
        )
  
    }
 
}

class Cell extends React.Component {
    handleCellClicked = () => {
        this.props.onClick(this.props.row, this.props.col)
    }
    render(){
        return (
            <div id="cell"
                className={this.props.cellClass}
                onClick={this.handleCellClicked}
            >
            </div>
        )
    }
}

class BasicControls extends React.Component {
    render(){
        return (
            <div className="flex justify-center mt5">
                <Button 
                    inverted color='purple'
                    onClick={this.props.onRunClick}
                    >Run
                </Button>
                <Button 
                    inverted color='purple'
                    onClick={this.props.onPauseClick}
                    >Pause
                </Button>
                <Button 
                    inverted color='purple'
                    onClick={this.props.onNewGridClick}
                    >New Grid
                </Button>
                <Button 
                    inverted color='purple'
                    onClick={this.props.onClearGridClick}
                    >Clear Grid
                </Button>
            </div>
        )
    }
}

class SpeedControls extends React.Component {
    handleSpeedClick = (event) => {
        let speed = event.target.value
        console.log(speed)
        this.props.onSpeedClick(speed)
    }
    render(){
        return (
            <div className = "flex justify-center mt2">
                <Button onClick={this.handleSpeedClick} value={1000} inverted color='purple'>Slow</Button>
                <Button onClick={this.handleSpeedClick} value={500} inverted color='purple'>Medium</Button>
                <Button onClick={this.handleSpeedClick} value={200} inverted color='purple'>Fast</Button>
            </div>
        )
    }
}

function arrayClone(arr){
    return JSON.parse(JSON.stringify(arr))
}

ReactDOM.render(<App/>, document.getElementById('app'));



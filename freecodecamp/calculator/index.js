const mainContent = document.getElementById('root');

function ClickableArea(props) {

  return(
    <div className="clickable-area">
      <button id="clear" onClick={(e) => props.onClick(e.target.value)} value="AC">AC</button>
      <button id="divide" className="operator-key" onClick={(e) => props.onClick(e.target.value)} value="/">/</button>
      <button id="multiply" className="operator-key" onClick={(e) => props.onClick(e.target.value)} value="*">*</button>
      <button id="seven" className="num-key" onClick={(e) => props.onClick(e.target.value)} value="7">7</button>
      <button id="eight" className="num-key" onClick={(e) => props.onClick(e.target.value)} value="8">8</button>
      <button id="nine" className="num-key" onClick={(e) => props.onClick(e.target.value)} value="9">9</button>
      <button id="subtract" className="operator-key" onClick={(e) => props.onClick(e.target.value)} value="-">-</button>
      <button id="four" className="num-key" onClick={(e) => props.onClick(e.target.value)} value="4">4</button>
      <button id="five" className="num-key" onClick={(e) => props.onClick(e.target.value)} value="5">5</button>
      <button id="six" className="num-key" onClick={(e) => props.onClick(e.target.value)} value="6">6</button>
      <button id="add" className="operator-key" onClick={(e) => props.onClick(e.target.value)} value="+">+</button>
      <button id="one" className="num-key" onClick={(e) => props.onClick(e.target.value)} value="1">1</button>
      <button id="two" className="num-key" onClick={(e) => props.onClick(e.target.value)} value="2">2</button>
      <button id="three" className="num-key" onClick={(e) => props.onClick(e.target.value)} value="3">3</button>
      <button id="equals" onClick={(e) => props.onClick(e.target.value)} value="=">=</button>
      <button  id="zero" className="num-key" onClick={(e) => props.onClick(e.target.value)} value="0">0</button>
      <button id="decimal" className="num-key" onClick={(e) => props.onClick(e.target.value)} value=".">.</button>                
    </div>
  );
}

const CalcUtil = (
  function() {
    const DISPLAY_INIT_VALUE = '0';
    const MAX_DISPLAY_LEN = 22;
    const NUM_KEYS = [".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ];
    const OPERATORS = ["/", "*", "-", "+"];

      function getCalcState(updatedDisplay, updatedEquation) {
        const display = updatedDisplay || DISPLAY_INIT_VALUE;
        const equation = updatedEquation ? [...updatedEquation] : [];

        return {
          display,
          equation
          
        };
      }

      function dispatch(value, state) {
        let display = state.display;
        let equation = state.equation;

        // Process clear

        if(value === 'AC') {
          return getCalcState();      
        }

        // Process equal

        if(value === '=') {
          return processEqual(state);          
        }

        // Adjust state
        let adjustedState = getCalcState(state.display, 
                                        equationIncludesEqual(state.equation) ? [] : state.equation);

        // Process operator

        if(isOperator(value)) {
          return processOperator(value, adjustedState);
        }

        // Process number key

        return processNumKey(value, adjustedState);

      }

      function processEqual(state) {
        let display = state.display;
        let equation = state.equation;

        let isDisplayNumber = !isNaN(display);

        if(!isDisplayNumber || equationIncludesEqual(equation)) {
          return;
        }

        // Add the number in the display to the equation.
        equation.push(display);

        let op1 = null;
        let operator = null;
        let op2 = null;

        equation.forEach((e, index) => {

          if(!operator && isOperator(e)) {
            operator = e;
          } else if(!op1) {
            op1 = e;
          } else if(!op2) {
            op2 = e;
          }

          if(op1 && operator && op2) {
            // execute expression
            let result = executeExpression(op1, operator, op2);

            // Use result for next expression
            op1 = result;
            operator = null;
            op2 = null;            

            let isLastResult = index === (equation.length - 1);

            if(isLastResult) {
              display = result.toString();

              // Put result in equation
              equation.push('=');
              equation.push(display);             
            }
          }
        });

        return getCalcState(display, equation);
      }

      function executeExpression(op1, operator, op2) {
        let result = 0;

        switch(operator) {
            case '/':
              result = Number(op1) / Number(op2);
              break;
            case '*':
              result = Number(op1) * Number(op2);
              break;
            case '-':
              result = Number(op1) - Number(op2);
              break;
            case '+':
              result = Number(op1) + Number(op2);                             
          }

          return Number.isInteger(result) ? result : result.toString();
      }

      function processNumKey(numKey, state) {
        let display = state.display;

        if((display.length == 1) && (display[0] === DISPLAY_INIT_VALUE)) {

          if(numKey === '.') {
            display += numKey;
          } else {
            display = numKey;
          }

        } else {
          display += numKey;
        }

        let isNumber = !isNaN(display);

        if(isNumber) {
          return getCalcState(display, state.equation);
        }

      }

      function processOperator(operator, state) {
        let display = state.display;
        let equation = state.equation;

        if(equation.length == 0) {          
          equation.push(display);
          equation.push(operator);          

          return getCalcState(DISPLAY_INIT_VALUE, equation);
        }

        if(display === DISPLAY_INIT_VALUE) {

          switch(operator) {
            case '-':
              display = operator;
              break;
            default:
              // Replace last added operator
              equation[equation.length - 1] = operator;
          }

          return getCalcState(display, equation);
        } 
        
        if((display === '-') && (operator !== '-')) {
          
          display = DISPLAY_INIT_VALUE;
          equation[equation.length - 1] = operator;          

          return getCalcState(display, equation);
        }

       equation.push(display);
       equation.push(operator);
        
        return getCalcState(DISPLAY_INIT_VALUE, equation);        
      }

      function isOperator(value) {
        return OPERATORS.includes(value);
      }

      function equationIncludesEqual(equation) {
        return equation.includes('=');
      }

      return {getCalcState, dispatch, MAX_DISPLAY_LEN};
  }    
)();

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = CalcUtil.getCalcState();
  }
  
  handleClick = (value) => {

    let state = CalcUtil.dispatch(value, this.state);    

    if(state) {
      if(state.display.length <= CalcUtil.MAX_DISPLAY_LEN) {
        this.setState(state);
      }      
    }
  }

  render() {

    return (
      <>
        <h1>Calculator</h1>
        <div className="calculator">
            <div className="equation-area">{this.state.equation.join('')}</div>
            <div className="entry-area" id="display">{this.state.display}</div>
            <ClickableArea onClick={(value) => this.handleClick(value)}/>
        </div>
      </>      
    );
  }
}

ReactDOM.render(<Calculator />, mainContent);

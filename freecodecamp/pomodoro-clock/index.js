const mainContent = document.getElementById('root');

const ClockUtil = (
  function() {
    const MAX_LENGTH = {break: 60, session: 60};
    const LABEL = {break: "Break", session: "Session"};

    let time = (seconds) =>
      ('0'+ Math.floor(seconds/60) % 60).slice(-2) + ':' + ('0' + seconds % 60).slice(-2);

    function initializeState() {
      let clockSeconds = 1500; // 25 minutes
  
      return {
        breakLength: 5,
        sessionLength: 25,
        clockSeconds,
        timer: undefined,
        label: LABEL.session,
      };

    }

    return {initializeState, time, MAX_LENGTH, LABEL};
  }
)();

class PomodoroClock extends React.Component {
  constructor(props) {
    super(props);

    let clockSeconds = 1500;
    let time = ClockUtil.time(clockSeconds);

    let initialState =  ClockUtil.initializeState();
    let audioRef = React.createRef();

    this.state  = {
      ...initialState,
      audioRef
    }
  }

  handleStartStop = () => {
    let timer = this.state.timer;     

    if(timer) {
      // Stop timer
      clearInterval(timer);
      timer = undefined;     

    } else {
      // Set timer
      timer = setInterval(this.decrementClock, 1000);          
    }

    this.setState({
      timer
    });
  };

  decrementClock = () => {
    let timer = this.state.timer;
    let clockSeconds = this.state.clockSeconds;

    if(clockSeconds === 0) {
      // Play audio
      const audioElement = this.state.audioRef.current;
      audioElement.play();

      // Stop timer
      clearInterval(timer);

      // Set timer
      timer = setInterval(this.runNext, 4000);       
    } else {
      clockSeconds = this.state.clockSeconds - 1;
      let time = ClockUtil.time(clockSeconds); 
    }

    this.setState({
      clockSeconds,
      timer
    });
  }

  runNext = () => {
    // Pause audio
    const audioElement = this.state.audioRef.current;
    audioElement.pause();
    
    let label = this.getNextLabel();
    let clockSeconds = label === ClockUtil.LABEL.session ? this.getSessionLengthSeconds() :this.getBreakLengthSeconds();

    let timer = this.state.timer;

    // Stop timer
    clearInterval(timer);

    // Set timer
    timer = setInterval(this.decrementClock, 1000);

    this.setState({
      clockSeconds,
      label,
      timer
    });
  };
    
  handleReset = () => {

    if(this.state.timer) {
      clearInterval(this.state.timer);
    }

    if(this.state.audioRef.current) {
      // Pause audio
      const audioElement = this.state.audioRef.current;
      audioElement.pause();
  }

    let state =  ClockUtil.initializeState();
    this.setState(state);      
  };

  handleBreakLength = (event) => {
    let operator = event.currentTarget.value;
    let length = this.state.breakLength;

    let updatedLength = this.adjustLength(length, ClockUtil.MAX_LENGTH.break, operator);

    let isBreakLabel = this.state.label === ClockUtil.LABEL.break;

    if(updatedLength) {
      let clockSeconds = this.state.clockSeconds;

      if(isBreakLabel) {
        clockSeconds = updatedLength * 60;
      }
      
      this.setState({
        breakLength: updatedLength,
        clockSeconds: clockSeconds
      });
    }
  };

  handleSessionLength = (event) => {
    let operator = event.currentTarget.value;
    let length = this.state.sessionLength;

    let updatedLength = this.adjustLength(length, ClockUtil.MAX_LENGTH.session, operator);

    let isSessionLabel = this.state.label === ClockUtil.LABEL.session;

    if(updatedLength) {
      let clockSeconds = this.state.clockSeconds;

      if(isSessionLabel) {
        clockSeconds = updatedLength * 60;
      }

      this.setState({
        sessionLength: updatedLength,
        clockSeconds: clockSeconds
      });
    }
  };

  adjustLength(length, maxLength, operator) {
    let result = -1;

    // Don't adjust if timer is running
    if(this.state.timer) {
      return;
    }

    switch(operator) {
      case '-':
        result = length - 1;
        break;
      case '+':
        result = length + 1;                             
    }
    
    if((result >= 1) && (result <= maxLength)) {
      return result;
    }
  }

  getNextLabel() {
    return this.state.label === ClockUtil.LABEL.session ? ClockUtil.LABEL.break : ClockUtil.LABEL.session;
  }

  getBreakLengthSeconds() {
    return this.state.breakLength * 60;
  }

  getSessionLengthSeconds() {
    return this.state.sessionLength * 60;
  }

  render() {

    // 60 minutes should be formatted as "60:00"
    let time = this.state.clockSeconds !== 3600 ? ClockUtil.time(this.state.clockSeconds) : "60:00";
    let isWarning = this.state.clockSeconds < 60;

    return (
      <main>
        <div className="main-title">Pomodoro Clock</div>
        <div className="length-control">
            <div id="break-label">Break Length</div>
            <button id="break-decrement" onClick={(e) => this.handleBreakLength(e)} className="btn-level" value="-"><i className="fa fa-arrow-down fa-2x"></i></button>
            <div id="break-length" className="btn-level">{this.state.breakLength}</div>
            <button id="break-increment" onClick={(e) => this.handleBreakLength(e)} className="btn-level" value="+"><i className="fa fa-arrow-up fa-2x"></i></button>
        </div>
        <div className="length-control">
            <div id="session-label">Session Length</div>
            <button id="session-decrement" onClick={(e) => this.handleSessionLength(e)} className="btn-level" value="-"><i className="fa fa-arrow-down fa-2x"></i></button>
            <div id="session-length" className="btn-level">{this.state.sessionLength}</div>
            <button id="session-increment" onClick={(e) => this.handleSessionLength(e)} className="btn-level" value="+"><i className="fa fa-arrow-up fa-2x"></i></button>
        </div>
        <div className="timer">
            <div className={isWarning ? 'timer-wrapper warning-countdown' : 'timer-wrapper'}>
                <div id="timer-label">{this.state.label}</div>
                <div id="time-left">{time}</div>
            </div>
        </div>
        <div className="timer-control">
            <button id="start_stop" onClick={() => this.handleStartStop()}><i className="fa fa-play fa-2x"></i> <i className="fa fa-pause fa-2x"></i></button>
            <button id="reset" onClick={() => this.handleReset()}><i className="fas fa-sync-alt fa-2x"></i></button>
        </div>
        <audio id="beep" ref={this.state.audioRef} src="http://www.peter-weinberg.com/files/1014/8073/6015/BeepSound.wav"></audio>
      </main>      
    );
  }
}

ReactDOM.render(<PomodoroClock />, mainContent);

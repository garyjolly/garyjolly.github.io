const mainContent = document.getElementById('main-container');

const audioList = [ {id: 'Heater-1', key: 'Q',  src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'},
                    {id: 'Heater-2', key: 'W',  src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'},
                    {id: 'Heater-3', key: 'E',  src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'},
                    {id: 'Heater-4', key: 'A',  src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'},
                    {id: 'Clap', key: 'S',  src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'},
                    {id: 'Open-HH', key: 'D',  src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'},
                    {id: 'Kick-n\'-Hat', key: 'Z',  src: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'},
                    {id: 'Kick', key: 'X',  src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'},
                    {id: 'Closed-HH', key: 'C',  src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'}];

class DrumMachine  extends React.Component { 
  constructor(props){
    super(props);

    // Set media refs for audio tag and its parent tag (has the onclick event)

    const mediaRefs = audioList.reduce((mediaRefs, audio) => {
      mediaRefs[audio.key] = React.createRef();

      let parent = `${audio.key}_parent`
      mediaRefs[parent] = React.createRef();
      return mediaRefs;
    }, {});

    this.state = {
      mediaRefs,
      selection: ""
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = (event) => {
    
    // Check for keyboard keys that correspond to our
    // audio keys.

    const key = event.key.toUpperCase();
    let audioKey;

    switch(key) {
      case 'Q':
      case 'W':
      case 'E':
      case 'A':
      case 'S':
      case 'D':
      case 'Z':
      case 'X':
      case 'C':
        audioKey = key;
        break;
    }

    if(audioKey) {
      const audioInfo = this.props.audioList.find(a => a.key === audioKey);

      let parent = `${audioInfo.key}_parent`
      const parentMediaRef = this.state.mediaRefs[parent];

      // Set the click animation class and click parent element
      const parentElement = parentMediaRef.current;

      parentElement.classList.add('click-fade');      
      parentElement.click();
    }
  }

  handleClick = (id) => {

    this.setState({selection: id});

    // Get audio info and the associated media ref
    const audioInfo = this.props.audioList.find(a => a.id === id);
    const mediaRef = this.state.mediaRefs[audioInfo.key];

    // Get audio element and play audio
    const audioElement = mediaRef.current;
    audioElement.play();
    
  };

  handleAnimationEnd = (id) => {    

    // Get audio info and the associated parent media ref
    const audioInfo = this.props.audioList.find(a => a.id === id);

    let parent = `${audioInfo.key}_parent`
    const parentMediaRef = this.state.mediaRefs[parent];

    // Remove click animation class
    const parentElement = parentMediaRef.current;

    parentElement.classList.remove('click-fade');        
  }

  render(){

    const audioRendering = this.props.audioList.map(a => {
      const  audioMediaRef = this.state.mediaRefs[a.key];

      let parent = `${a.key}_parent`
      const parentMediaRef = this.state.mediaRefs[parent];

      return <div ref={parentMediaRef} onClick={() => this.handleClick(a.id)} key={a.id} id={a.id} className="drum-pad" onAnimationEnd={() => this.handleAnimationEnd(a.id)}>
        <audio ref={audioMediaRef} className="clip" id={a.key} src={a.src}></audio>
        {a.key}
      </div>     
    });
    
    return (
        <>
          <div id="drum-machine">
            <div className="pad-bank">
                {audioRendering}
            </div>            
          </div>
          <div className="selection-container">
              <p id="display">{this.state.selection}</p>
          </div>
        </>
    );
  }

}

ReactDOM.render(<DrumMachine audioList={audioList} />, mainContent);

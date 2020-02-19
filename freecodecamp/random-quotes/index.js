const mainContent = document.getElementById('content');

const QUOTES = [
  {quote: 'In theory, Communism works! In theory.', author: 'Homer Simpson'},
  {quote: 'My eyes! The goggles do nothing!', author: 'Rainier Wolfcastle'},
  {quote: 'Ah, be creative. Instead of making sandwhiches with bread, use Pop-Tarts. Instead of chewing gum, chew bacon.', author: 'Dr. Nick'},
  {quote: "All I'm gonna use this bed for is sleeping, eating and maybe building a little fort.", author: 'Homer Simpson'},
  {quote: "All I'm gonna use this bed for is sleeping, eating and maybe building a little fort.", author: '"Homer Simpson'},
  {quote: 'Back in Edinburg, we had a coal miners strike. All we wanted were hats with a wee light on top. Then one day the mine collapsed. No one made it out alive, not even Willie!', author: 'Groundskeeper Willie'},
  {quote: "You're turning me into a criminal when all I want to be is a petty thug.", author: 'Bart Simpson'},
  {quote: "They taste like...burning.", author: 'Ralph Wiggum'},
  {quote: "Oh, so they have Internet on computers now!", author: 'Homer Simpson'},
  {quote: "Eat my shorts", author: 'Homer Simpson'}
];

class Quote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {index: 0};
  }
  
  randomIndex = () => {
    let randomIndex = Math.floor(Math.random() * this.props.quotes.length);

    this.setState({index: randomIndex});
  }

  render() {
  
    let quote = this.props.quotes[this.state.index].quote;
    let author = this.props.quotes[this.state.index].author;

    return (
      <div id="quote-box">
        <div className="quote-info">
          <span id="text">{quote}</span> - <span id="author">{author}</span>
        </div>
        <div>
          <button id="new-quote" onClick={this.randomIndex}>New Quote!</button>
          <a id="tweet-quote" href={`https://twitter.com/intent/tweet?text=${quote}`} target="_blank">Tweet it!</a>
        </div>
      </div>
      
    );
  }
}

ReactDOM.render(<Quote quotes={QUOTES} />, mainContent);

const mainContent = document.getElementById('content');

const initialMarkDownText = `
# Welcome to my React Markdown Previewer!
## This is a sub-heading...
Checkout the [demo page](https://marked.js.org/demo/) to see marked in action.
\`code\`
\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.\n
> Block Quotes!\n
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")\n
You can also make text **bold**... whoa!
`;

class Editor  extends React.Component { 
  constructor(props){
    super(props);
    this.state = {
      text: this.props.initial
    }
  }

  handleChange = (event) => {
    this.setState({text: event.target.value});
  };

  render(){

    return (
      <>
        <div className="editorWrap">
          <div className="toolbar">
              Editor
          </div> 
          <textarea id="editor" onChange={(event) => this.handleChange(event)}>
          {this.state.text}
          </textarea>
        </div>
        <Previewer text={this.state.text}/>              
      </>
    );
  }

}

class Previewer  extends React.Component { 
  constructor(props){
    super(props);
  }

  render(){
    const markedText = marked(this.props.text, {breaks: true});

    return (
      <div className="previewWrap">
        <div className="toolbar">
            Previewer
        </div>        
        <div id="preview" dangerouslySetInnerHTML={{__html: markedText}} />
      </div> 
    );
  }

}

ReactDOM.render(<Editor initial={initialMarkDownText} />, mainContent);

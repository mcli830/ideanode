import React, { Component } from 'react'
import {connect} from 'react-redux'
//components
import Control from './Control'
//actions
import { addNode } from '../actions/addNode'
import { changeMode } from '../actions/changeMode'

class ControlContainer extends Component {
  constructor(props){
    super(props);
    this.handleKeyUp=this.handleKeyUp.bind(this);
    this.handleAddNode=this.handleAddNode.bind(this);
    this.handleDeleteNode=this.handleDeleteNode.bind(this);
  }

  handleKeyUp(e){
    e = e || window.event;
    if(this.props.mode==='view'){
      if(e.shiftKey){
        switch(e.keyCode){
          case 65:
            this.props.addNode(this.props.uniqueID, this.props.cursor.x, this.props.cursor.y);
            break;
          case 68:
            this.props.changeMode('delete');
            break;
          default:
        }
      }
    }
    //not in view mode
    else {
      switch(e.keyCode){
        case 9:
          e.preventDefault();
          if(this.props.mode==='edit'){
            let next = nextSection(document.activeElement);
            document.querySelectorAll("[data-section="+next+"]")[0].focus();
            function nextSection(activeElement){
              let section=activeElement.className.slice(5);
              switch(section){
                case 'head':
                  return 'body';
                case 'body':
                  return 'foot';
                case 'foot':
                  return 'head';
                default:
              }
            }
          }
          break;
        case 27:
          this.props.changeMode('view');
          break;
        case 68:
          if(this.props.mode==='delete'&&e.shiftKey) this.props.changeMode('view');
          break;
        default:
      }
    }
  }

  handleAddNode(e){
    e = e || window.event;
    e.preventDefault();
    let b=e.target;
    b.onmouseup=(e)=>{
      b.onmouseup=null;
      this.props.addNode(this.props.uniqueID, e.pageX, e.pageY);
    };
    //add new node at location of cursor
  }

  handleDeleteNode(e){
    e = e || window.event;
    e.preventDefault();
    //add nested mouseup event to ensure no double hits
    let b=e.target;
    b.onmouseup=(f)=>{
      b.onmouseup=null;
      if(this.props.mode==='view'){
        this.props.changeMode('delete');
      }
    }
  }

  componentDidMount(){
    document.addEventListener('keydown',this.handleKeyUp);
  }

  shouldComponentUpdate(nextProps){
    if (this.props.cursor !== nextProps.cursor){
      return false;
    } else return true;
  }

  componentDidUpdate(prevProps){
    console.log('Update: Control');
    //if not in view mode, add click listener to control area to revert to view mode
    if(this.props.mode === 'delete'){
      let b=document.getElementById('App-control');
      b.onmousedown=(e)=>{
        b.onmouseup=(e)=>{
          b.onmouseup=null;
            this.props.changeMode('view');
        }
      };
    }
  }

  componentWillUpdate(nextProps){
    if (nextProps.mode !== 'delete'){
      document.getElementById('App-control').onmousedown=null;
    }
  }

  componentWillUnmount(){
    document.removeEventListener('keydown',this.handleKeyUp);
  }

  render(){
    //only insert button functionality in view mode
    return(
      <Control
        addNode={this.props.mode==='view'?this.handleAddNode:null}
        deleteNode={this.props.mode==='view'?this.handleDeleteNode:null}
      />
    );
  }
}

const mapStateToProps = state => ({
  uniqueID: state.node.uniqueID,
  mode: state.client.mode
});

const mapDispatchToProps = dispatch => ({
  addNode: (id,x,y)=>dispatch(addNode(id,x,y)),
  changeMode: (mode)=>dispatch(changeMode(mode))
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlContainer);

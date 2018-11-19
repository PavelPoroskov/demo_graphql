import React, { Component } from 'react'

import CreateLinkMutation from '../../mutations/CreateLinkMutation'

export default
class CreateLink extends Component {

  state = {
    description: '',
    url: '',
  }

  render() {

    return (
      <div>
        <div className='flex flex-column mt3'>
          <input
            className='mb2'
            value={this.state.description}
            onChange={(e) => this.setState({ description: e.target.value })}
            type='text'
            placeholder='A description for the link'
          />
          <input
            className='mb2'
            value={this.state.url}
            onChange={(e) => this.setState({ url: e.target.value })}
            type='text'
            placeholder='The URL for the link'
          />
        </div>
        <div
          className='button'
          onClick={() => this._createLink()}
        >
          submit
        </div>
      </div>
    )

  }

  _createLink = () => {
    const { description, url } = this.state
    CreateLinkMutation.commit( 
      //this.props.relay.environment, 
      description, 
      url, 
      () => {
        console.log(`Mutation completed`)

        this.props.history.push('/')
      }
    )
  }
}

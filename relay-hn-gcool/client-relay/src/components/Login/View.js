export default
class LoginView extends Component {

  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: ''
  }

  render() {
    //const {email, password, name} = this.hstate
    return (
      <div>
        <h4 className='mv3'>{this.state.login ? 'Login' : 'Sign Up'}</h4>
        <div className='flex flex-column'>
          {!this.state.login &&
          <input
            value={this.state.name}
            onChange={this._onEdit}
            type='text'
            name='name'
            placeholder='Your name'
          />}
          <input
            value={this.state.email}
            onChange={this._onEdit}
            type='text'
            name='email'
            placeholder='Your email address'
          />
          <input
            value={this.state.password}
            onChange={this._onEdit}
            type='password'
            name='password'
            placeholder='Choose a safe password'
          />
        </div>
        <div className='flex mt3'>
          <div
            className='pointer mr2 button'
            onClick={() => this._confirm()}
          >
            {this.state.login ? 'login' : 'create Account' }
          </div>
          <div
            className='pointer button'
            onClick={() => this.setState({ login: !this.state.login })}
          >
            {this.state.login ? 'need to create an account?' : 'already have an account?'}
          </div>
        </div>
      </div>
    )
  }

  _onEdit = (e) => {
    const name = e.target.name
    this.setState({ 
      [name]: e.target.value,
      errors: null
    })
  }
  _confirm = () => {
    const { login, name, email, password } = this.state

    this.props.submit( login, email, password, name, (errors) => {
      this.setState({ errors: errors })
    } )
  }
  // _saveUserData = (id, token) => {
  //   localStorage.setItem(GC_USER_ID, id)
  //   localStorage.setItem(GC_AUTH_TOKEN, token)
  // }

}

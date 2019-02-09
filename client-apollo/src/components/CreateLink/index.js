// // with component Mutation (from react-appolo)
// // one component/file 'index0'
// import CreateLink from './index0ComponentMutation'

// // with HOCs: graphql (from react-appolo); compose, withHandlers (from recompose)
// // two files: 'index1' (hoc) and 'View.js' (CreateLinkView) 
// import CreateLink from './index1Recompose'

// not use recompose
// three files: 'index2' (CreateLink), 'mutations/CreateLink', and 'View.js' (CreateLinkView) 
// ++: more modular
import CreateLink from './index2ClientMutateFile'

// // not use recompose
// // two files: 'index3' (CreateLink), and 'View.js' (CreateLinkView) 
//import CreateLink from './index3ClientMutate'


//which best for error processing?
//1) dont go from view component if error on server (mutation error), not valid inputs
//   user can fix inputs
//2) global(app context) error turn on

export default CreateLink
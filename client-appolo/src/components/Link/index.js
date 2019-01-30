import React from 'react'

export default
function Link (props) {
  return (
	  <div>
	    <div>
	      {props.description} ({props.url})
	    </div>
	  </div>
	)
}

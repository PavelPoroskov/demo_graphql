import React from 'react'

const WaitResultHoc = Component => props => {
  const { loading, error, data, ...rest } = props;

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{`Error: ${error}`}</div>;
  }

  return <Component data={data} {...rest} />;
};

export default WaitResultHoc;

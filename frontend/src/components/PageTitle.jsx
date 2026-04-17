import React, { useEffect } from 'react'

const PageTitle = ({title}) => {
  return (
    useEffect(()=>{
     document.title=title;
    },[title])
  )
}

export default PageTitle

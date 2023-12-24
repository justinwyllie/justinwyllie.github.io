import React from "react";

const Loading = () =>
{
    return(<div>loading...</div>)
}

const StopHacking = () =>
{
    return (<div class="alert alert-danger" role="alert">
        Stop hacking my site!
  </div>)
}


const CapitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



export 
{
    Loading,
    StopHacking,
    CapitalizeFirstLetter
}

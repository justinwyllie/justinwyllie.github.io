import * as jose from "jose";
window.decodeJwt = jose.decodeJwt;
import { setCookie, getCookie } from './helpers';
import React, { useState, useEffect } from "react";


const StopHacking = () =>
{
    return (<div class="alert alert-danger" role="alert">
        Stop hacking my site!
  </div>)
}

const LoginFields = ({userName, setUserName, userNameSet, setUserNameSet, }) =>
{

    const [hacker, setHacker] = useState(false);

    const setUserNameWrapper = (name) =>
    {

        if (name.length > 30)
        {
            setHacker(true);
            name = name.substr(0, 30);
        }
        else
        {
            setHacker(false);
        }

        if (name != '')
        {
            
            setUserName(name);
            setDisplayAccountInfo(preState => ({...prevState, name: userData.name}));
        }
  
        
    }

    return(



        <>

            {hacker && <StopHacking/>}
        
            <div className="mt-3 mb-3 input-group has-validation">
                <label htmlFor="userName" className="form-label me-2">Name  </label> 
                <input id="userName" maxLength="30"  className={setUserName ? "is-valid" : "is-invalid"} value={userName} onChange={(e) =>
                    setUserNameWrapper(e.currentTarget.value)}   />
                <div className="invalid-feedback">
                    Please enter your name
                </div>
            </div>

        </>
    
    )

}


const Login = ({setDisplayAccountInfo}) =>
{

    let repiProfile = {};
    repiProfile.email = '';
    repiProfile.name = '';
    repiProfile.ID = '';

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
 
    function decodeJwtResponse(data)
    {
        return window.decodeJwt(data);
    }


    const setUserData = (userData) =>
    {
            setUserName(userData.name);
            setUserEmail(userData.email);
            setDisplayAccountInfo({name: userData.name, email: userData.email});
    }
    

    function handleLogin(response)
    {
        const responsePayload = decodeJwtResponse(response.credential);

        repiProfile.email = responsePayload.email;
        repiProfile.name = responsePayload.name;
        repiProfile.ID = responsePayload.sub;
        setCookie("repi-name", repiProfile.name, 30);
        setCookie("repi-email", repiProfile.email, 30);

        setUserData(repiProfile); 
    
    }


    function signin() { 
        /*
        if (signinCheck !== false)
        {
            return;    
        }
        else
        {
            signinCheck = true;
        }
        */
        var email = getCookie("repi-email");
        var name = getCookie("repi-name");
        //auto_select: true, //if they logged in before and are in account now will not VISUALLY prompt but will call callback
        if (email == "")
        {
            var res1 = google.accounts.id.initialize({
               // client_id: '440488237448-1r2t7lo5bgb4nv46sg505h55ebg0bcoj.apps.googleusercontent.com',
               client_id: '71662042778-uuksgguj4bfs6bh6igi6ss4eleojnvla.apps.googleusercontent.com',
                use_fedcm_for_prompt: true,
                callback: handleLogin
            });
 
            /*
            google.accounts.id.renderButton(
                document.getElementById("buttonDiv"),
                { theme: "outline", size: "large" }  // customization attributes
                https://stackoverflow.com/questions/62281579/google-one-tap-sign-in-ui-not-displayed-after-clicking-the-close-button
                https://developers.google.com/identity/gsi/web/guides/features#globally_opt_out
            );
            */
           //https://developers.google.com/identity/gsi/web/guides/fedcm-migration?s=dc#display_moment
            google.accounts.id.prompt(function(notification) {
                //notification.isNotDisplayed() ||
                if ( notification.isSkippedMoment()) {
                    document.cookie =  `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
                    google.accounts.id.prompt()
                }
            });
           
        }
        else
        {
            repiProfile.email = email;
            repiProfile.name = name;
            setUserData(repiProfile); 
          
        }
    };

    
    useEffect(() => {
        
        signin();
        
        
    }, []);  

    return (

        <LoginFields userName={userName} setUserName={setUserName} setDisplayAccountInfo={setDisplayAccountInfo} />
    )


}

export {
    Login
  
}
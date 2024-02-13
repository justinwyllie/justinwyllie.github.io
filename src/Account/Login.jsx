import * as jose from "jose";
window.decodeJwt = jose.decodeJwt;
import { setCookie, getCookie } from './helpers';


const Login = (setUserName, setUserEmail) =>
{

    let repiProfile = {};
    repiProfile.email = '';
    repiProfile.name = '';
    repiProfile.ID = '';

    function decodeJwtResponse(data)
    {
        return window.decodeJwt(data);
    }


    const specialReactHook = (userData) =>
    {
            setUserName(userData.name);
            setUserEmail(userData.email);
    }
    

    function handleLogin(response)
    {
        const responsePayload = decodeJwtResponse(response.credential);

        repiProfile.email = responsePayload.email;
        repiProfile.name = responsePayload.name;
        repiProfile.ID = responsePayload.sub;
        setCookie("repi-name", repiProfile.name, 30);
        setCookie("repi-email", repiProfile.email, 30);

        specialReactHook(repiProfile); 
    
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
                client_id: '440488237448-1r2t7lo5bgb4nv46sg505h55ebg0bcoj.apps.googleusercontent.com',
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
            google.accounts.id.prompt(function(notification) {
                console.log("n", notification);
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    document.cookie =  `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
                    google.accounts.id.prompt()
                }
            });
           
        }
        else
        {
            repiProfile.email = email;
            repiProfile.name = name;
            specialReactHook(repiProfile); 
          
        }
    };


    console.log("about to call signin");
    signin();
    


}

export {
    Login
}
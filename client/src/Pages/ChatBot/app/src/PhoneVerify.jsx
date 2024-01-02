import { useEffect } from 'react'
import firebase from 'firebase/compat/app'
import * as firebaseui from 'firebaseui'
import "firebaseui/dist/firebaseui.css"
 
// eslint-disable-next-line react/prop-types
const PhoneVerify = ({auth}) => {
    useEffect(() => {
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
        ui.start(".otp-container", {
            signInOptions: [firebase.auth.PhoneAuthProvider.PROVIDER_ID],
            // signInSuccessUrl:
            //     "",
            // privacyPolicyUrl: "/",
        })
    })
  return <div className='otp-container'></div>
}

export default PhoneVerify